const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'products',
    select: 'title slug price mrp discountPercentage images brand ratings stock',
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  return ApiResponse.success(res, wishlist);
};

exports.toggleWishlistItem = async (req, res) => {
  const { productId } = req.body;
  if (!productId) throw ApiError.badRequest('productId is required');

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }

  const index = wishlist.products.findIndex((p) => p.toString() === productId);
  let action = '';

  if (index > -1) {
    wishlist.products.splice(index, 1);
    action = 'removed';
  } else {
    wishlist.products.push(productId);
    action = 'added';
  }

  await wishlist.save();
  wishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'products',
    select: 'title slug price mrp discountPercentage images brand ratings stock',
  });

  return ApiResponse.success(res, wishlist, `Product ${action} wishlist`);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) throw ApiError.badRequest('productId is required');

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  wishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'products',
    select: 'title slug price mrp discountPercentage images brand ratings stock',
  });

  return ApiResponse.success(res, wishlist, 'Product added to wishlist');
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (wishlist) {
    wishlist.products.pull(productId);
    await wishlist.save();
  }

  wishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'products',
    select: 'title slug price mrp discountPercentage images brand ratings stock',
  });

  return ApiResponse.success(res, wishlist, 'Product removed from wishlist');
};
