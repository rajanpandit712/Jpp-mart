const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(10000 + Math.random() * 90000);
  return `JPP-${dateStr}-${randomStr}`;
};

exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod = 'cod' } = req.body;

  if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.pincode) {
    throw ApiError.badRequest('Complete shipping address is required');
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    populate: { path: 'seller' },
  });

  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Your cart is empty');
  }

  // Validate items and stock
  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;
    if (!product || product.status !== 'active') {
      throw ApiError.badRequest(`Product "${item.product?.title || 'Unknown'}" is no longer available`);
    }
    if (product.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for "${product.title}". Only ${product.stock} available.`);
    }

    const itemPrice = product.price;
    subtotal += itemPrice * item.quantity;

    orderItems.push({
      product: product._id,
      seller: product.seller?._id || product.seller,
      title: product.title,
      image: product.images?.[0]?.url || '',
      price: itemPrice,
      quantity: item.quantity,
      variantId: item.variantId,
      status: 'placed',
    });
  }

  const discount = cart.coupon?.discount || 0;
  const shippingFee = subtotal >= 499 ? 0 : 40;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const orderNumber = generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    customer: req.user._id,
    items: orderItems,
    shippingAddress,
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'completed',
      transactionId: paymentMethod !== 'cod' ? `TXN-${Date.now()}` : undefined,
    },
    subtotal,
    discount,
    shippingFee,
    total,
    orderStatus: 'placed',
  });

  // Decrement product inventory
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // Empty cart
  cart.items = [];
  cart.coupon = undefined;
  await cart.save();

  return ApiResponse.created(res, order, 'Order placed successfully');
};

exports.getMyOrders = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ customer: req.user._id }),
  ]);

  return ApiResponse.paginated(res, { items: orders, page, limit, total });
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'title slug images')
    .populate('customer', 'name email phone');

  if (!order) throw ApiError.notFound('Order not found');

  // Customer can only view their own order, unless admin or seller of one of the items
  const isOwner = order.customer._id.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAdmin && req.user.role !== 'seller') {
    throw ApiError.forbidden('You do not have permission to view this order');
  }

  return ApiResponse.success(res, order);
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found');

  if (order.customer.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
    throw ApiError.forbidden('You cannot cancel this order');
  }

  if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
    throw ApiError.badRequest(`Cannot cancel order in status: ${order.orderStatus}`);
  }

  order.orderStatus = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by customer';
  order.items.forEach((item) => {
    item.status = 'cancelled';
  });
  await order.save();

  // Restore inventory
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  return ApiResponse.success(res, order, 'Order cancelled successfully');
};
