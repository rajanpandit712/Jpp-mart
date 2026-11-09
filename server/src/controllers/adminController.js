const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getDashboardStats = async (req, res) => {
  const [
    totalCustomers,
    totalSellers,
    totalProducts,
    totalOrders,
    recentOrders,
    allOrders,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    SellerProfile.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name email'),
    Order.find({ orderStatus: { $ne: 'cancelled' } }).select('total'),
  ]);

  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return ApiResponse.success(res, {
    stats: {
      totalCustomers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
    },
    recentOrders,
  });
};

exports.getCustomers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments({ role: 'customer' }),
  ]);

  return ApiResponse.paginated(res, { items: users, page, limit, total });
};

exports.toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');

  user.isActive = !user.isActive;
  await user.save();

  return ApiResponse.success(res, { id: user._id, isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'suspended'}`);
};

exports.getSellers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [sellers, total] = await Promise.all([
    SellerProfile.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    SellerProfile.countDocuments(),
  ]);

  return ApiResponse.paginated(res, { items: sellers, page, limit, total });
};

exports.updateSellerStatus = async (req, res) => {
  const { status } = req.body;
  const seller = await SellerProfile.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!seller) throw ApiError.notFound('Seller not found');

  return ApiResponse.success(res, seller, `Seller status updated to ${status}`);
};

exports.getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
  ]);

  return ApiResponse.paginated(res, { items: orders, page, limit, total });
};

exports.updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus, ...(orderStatus === 'delivered' && { deliveredAt: new Date() }) },
    { new: true }
  );
  if (!order) throw ApiError.notFound('Order not found');

  return ApiResponse.success(res, order, `Order status updated to ${orderStatus}`);
};

// Coupons
exports.getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return ApiResponse.success(res, coupons);
};

exports.createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  return ApiResponse.created(res, coupon, 'Coupon created successfully');
};

exports.deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, null, 'Coupon deleted');
};

// Product management for Admin
exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const { status, search } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('seller', 'storeName name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  return ApiResponse.paginated(res, { items: products, page, limit, total });
};

exports.approveProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!product) throw ApiError.notFound('Product not found');
  return ApiResponse.success(res, product, 'Product approved');
};

exports.rejectProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  );
  if (!product) throw ApiError.notFound('Product not found');
  return ApiResponse.success(res, product, 'Product rejected');
};
