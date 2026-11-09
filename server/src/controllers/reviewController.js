const Review = require('../models/Review');
const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: productId }),
  ]);

  return ApiResponse.paginated(res, { items: reviews, page, limit, total });
};

exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw ApiError.badRequest('Rating must be between 1 and 5');
  }
  if (!comment) {
    throw ApiError.badRequest('Review comment is required');
  }

  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const existingReview = await Review.findOne({ product: productId, user: req.user._id });
  if (existingReview) {
    throw ApiError.conflict('You have already submitted a review for this product');
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating: Number(rating),
    title,
    comment,
    isVerifiedPurchase: true,
  });

  // Re-calculate product ratings
  const allReviews = await Review.find({ product: productId });
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  product.ratings = {
    average: Math.round(avg * 10) / 10,
    count: allReviews.length,
  };
  await product.save();

  return ApiResponse.created(res, review, 'Review submitted successfully');
};

exports.voteHelpful = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpfulVotes: 1 } },
    { new: true }
  );
  if (!review) throw ApiError.notFound('Review not found');

  return ApiResponse.success(res, review, 'Vote recorded');
};
