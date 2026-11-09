const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getProfile = async (req, res) => {
  const profile = await SellerProfile.findOne({ user: req.user._id });
  if (!profile) throw ApiError.notFound('Seller profile not found');
  return ApiResponse.success(res, profile);
};

exports.updateProfile = async (req, res) => {
  const profile = await SellerProfile.findOneAndUpdate(
    { user: req.user._id },
    req.body,
    { new: true }
  );
  if (!profile) throw ApiError.notFound('Seller profile not found');
  return ApiResponse.success(res, profile, 'Seller profile updated');
};

exports.getMyProducts = async (req, res) => {
  const profile = await SellerProfile.findOne({ user: req.user._id });
  if (!profile) throw ApiError.notFound('Seller profile not found');

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ seller: profile._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ seller: profile._id }),
  ]);

  return ApiResponse.paginated(res, { items: products, page, limit, total });
};

exports.getMyOrders = async (req, res) => {
  const profile = await SellerProfile.findOne({ user: req.user._id });
  if (!profile) throw ApiError.notFound('Seller profile not found');

  const orders = await Order.find({ 'items.seller': profile._id })
    .populate('customer', 'name email phone')
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, orders);
};

exports.updateOrderItemStatus = async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status, trackingNumber, shippingCarrier } = req.body;

  const profile = await SellerProfile.findOne({ user: req.user._id });
  if (!profile) throw ApiError.notFound('Seller profile not found');

  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');

  const item = order.items.id(itemId);
  if (!item) throw ApiError.notFound('Item not in order');

  if (item.seller.toString() !== profile._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
    throw ApiError.forbidden('You can only update your own order items');
  }

  if (status) item.status = status;
  if (trackingNumber) item.trackingNumber = trackingNumber;
  if (shippingCarrier) item.shippingCarrier = shippingCarrier;

  // Check if all items delivered
  const allDelivered = order.items.every((it) => it.status === 'delivered');
  if (allDelivered) {
    order.orderStatus = 'delivered';
    order.deliveredAt = new Date();
  } else if (order.items.some((it) => ['shipped', 'out_for_delivery'].includes(it.status))) {
    order.orderStatus = 'shipped';
  }

  await order.save();
  return ApiResponse.success(res, order, 'Item status updated');
};

exports.getDashboardStats = async (req, res) => {
  const profile = await SellerProfile.findOne({ user: req.user._id });
  if (!profile) throw ApiError.notFound('Seller profile not found');

  const totalProducts = await Product.countDocuments({ seller: profile._id });
  const outOfStock = await Product.countDocuments({ seller: profile._id, stock: 0 });

  const orders = await Order.find({ 'items.seller': profile._id });

  let totalRevenue = 0;
  let totalItemsSold = 0;
  let pendingOrders = 0;

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.seller.toString() === profile._id.toString()) {
        if (order.payment.status === 'completed' || order.orderStatus === 'delivered') {
          totalRevenue += item.price * item.quantity;
        }
        totalItemsSold += item.quantity;
        if (['placed', 'confirmed'].includes(item.status)) {
          pendingOrders++;
        }
      }
    });
  });

  return ApiResponse.success(res, {
    profile,
    stats: {
      totalProducts,
      outOfStock,
      totalOrders: orders.length,
      pendingOrders,
      totalRevenue,
      totalItemsSold,
    },
  });
};
