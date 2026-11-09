const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const populateCart = (cartQuery) => {
  return cartQuery.populate({
    path: 'items.product',
    select: 'title slug price mrp stock images brand',
  });
};

exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  cart = await populateCart(Cart.findById(cart._id));
  return ApiResponse.success(res, cart);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1, variantId = null } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');
  if (product.stock < quantity) throw ApiError.badRequest('Requested quantity exceeds available stock');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && (!variantId || item.variantId?.toString() === variantId)
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
    cart.items[existingItemIndex].price = product.price;
  } else {
    cart.items.push({
      product: productId,
      variantId,
      quantity: Number(quantity),
      price: product.price,
    });
  }

  await cart.save();
  cart = await populateCart(Cart.findById(cart._id));
  return ApiResponse.success(res, cart, 'Item added to cart');
};

exports.updateQuantity = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) throw ApiError.badRequest('Quantity must be at least 1');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  const item = cart.items.id(itemId);
  if (!item) throw ApiError.notFound('Item not in cart');

  item.quantity = Number(quantity);
  await cart.save();

  cart = await populateCart(Cart.findById(cart._id));
  return ApiResponse.success(res, cart, 'Cart updated');
};

exports.removeItem = async (req, res) => {
  const { itemId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  cart.items.pull({ _id: itemId });
  await cart.save();

  cart = await populateCart(Cart.findById(cart._id));
  return ApiResponse.success(res, cart, 'Item removed from cart');
};

exports.clearCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    cart.coupon = undefined;
    await cart.save();
  }
  return ApiResponse.success(res, { items: [] }, 'Cart cleared');
};

exports.applyCoupon = async (req, res) => {
  const { code } = req.body;
  if (!code) throw ApiError.badRequest('Coupon code is required');

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validUntil: { $gte: new Date() },
  });

  if (!coupon) throw ApiError.badRequest('Invalid or expired coupon code');

  let cart = await populateCart(Cart.findOne({ user: req.user._id }));
  if (!cart || cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.price || item.price) * item.quantity, 0);

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    throw ApiError.badRequest(`Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`);
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountAmount) / 100;
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = coupon.discountAmount;
  }

  cart.coupon = {
    code: coupon.code,
    discount: Math.round(discount),
  };
  await cart.save();

  return ApiResponse.success(res, cart, `Coupon ${coupon.code} applied! Saved ₹${Math.round(discount)}`);
};

exports.removeCoupon = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.coupon = undefined;
    await cart.save();
  }
  cart = await populateCart(Cart.findById(cart._id));
  return ApiResponse.success(res, cart, 'Coupon removed');
};
