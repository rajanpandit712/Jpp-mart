const Product = require('../models/Product');
const Category = require('../models/Category');
const SellerProfile = require('../models/SellerProfile');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getProducts = async (req, res) => {
  const {
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    isDealOfTheDay,
    isFeatured,
    isBestSeller,
    sort = 'newest',
    page = 1,
    limit = 20,
  } = req.query;

  const query = { status: 'active' };

  if (keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    query.$or = [
      { title: regex },
      { brand: regex },
      { tags: regex },
      { description: regex },
    ];
  }

  if (category) {
    // Check if category is slug or ID
    const catDoc = await Category.findOne({
      $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
    });
    if (catDoc) {
      query.category = catDoc._id;
    }
  }

  if (brand) {
    query.brand = new RegExp(`^${brand}$`, 'i');
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (minRating) {
    query['ratings.average'] = { $gte: Number(minRating) };
  }

  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  if (isDealOfTheDay === 'true') query.isDealOfTheDay = true;
  if (isFeatured === 'true') query.isFeatured = true;
  if (isBestSeller === 'true') query.isBestSeller = true;

  // Sorting
  const sortOptions = {};
  switch (sort) {
    case 'price-asc':
      sortOptions.price = 1;
      break;
    case 'price-desc':
      sortOptions.price = -1;
      break;
    case 'rating':
      sortOptions['ratings.average'] = -1;
      break;
    case 'discount':
      sortOptions.discountPercentage = -1;
      break;
    case 'popular':
      sortOptions['ratings.count'] = -1;
      break;
    case 'newest':
    default:
      sortOptions.createdAt = -1;
      break;
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'storeName rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  return ApiResponse.paginated(res, {
    items: products,
    page: pageNum,
    limit: limitNum,
    total,
  });
};

exports.getProductBySlug = async (req, res) => {
  const { slugOrId } = req.params;
  const isId = slugOrId.match(/^[0-9a-fA-F]{24}$/);

  const product = await Product.findOne({
    $or: [{ slug: slugOrId }, { _id: isId ? slugOrId : null }],
  })
    .populate('category', 'name slug')
    .populate('seller', 'storeName slug rating logo description');

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Fetch related products from same category
  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    status: 'active',
  })
    .limit(6)
    .select('title slug price mrp discountPercentage images ratings brand');

  return ApiResponse.success(res, { product, relatedProducts });
};

exports.createProduct = async (req, res) => {
  let sellerId = req.body.seller;

  // If user is seller, assign their seller profile
  if (req.user.role === 'seller') {
    const profile = await SellerProfile.findOne({ user: req.user._id });
    if (!profile) throw ApiError.badRequest('Seller profile not found');
    sellerId = profile._id;
  }

  if (!sellerId) {
    const defaultSeller = await SellerProfile.findOne();
    if (defaultSeller) sellerId = defaultSeller._id;
  }

  const slug = (req.body.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now();

  const product = await Product.create({
    ...req.body,
    slug,
    seller: sellerId,
  });

  return ApiResponse.created(res, product, 'Product created successfully');
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  // Verify ownership if seller
  if (req.user.role === 'seller') {
    const profile = await SellerProfile.findOne({ user: req.user._id });
    if (!profile || product.seller.toString() !== profile._id.toString()) {
      throw ApiError.forbidden('You can only update your own products');
    }
  }

  Object.assign(product, req.body);
  await product.save();

  return ApiResponse.success(res, product, 'Product updated successfully');
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  if (req.user.role === 'seller') {
    const profile = await SellerProfile.findOne({ user: req.user._id });
    if (!profile || product.seller.toString() !== profile._id.toString()) {
      throw ApiError.forbidden('You can only delete your own products');
    }
  }

  await Product.findByIdAndDelete(id);
  return ApiResponse.success(res, null, 'Product deleted successfully');
};

exports.getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true, status: 'active' })
    .populate('category', 'name slug')
    .limit(10);
  return ApiResponse.success(res, products);
};

exports.getBestSellers = async (req, res) => {
  const products = await Product.find({ isBestSeller: true, status: 'active' })
    .populate('category', 'name slug')
    .limit(10);
  return ApiResponse.success(res, products);
};

exports.getTrending = async (req, res) => {
  const products = await Product.find({ status: 'active' })
    .sort({ 'ratings.count': -1 })
    .populate('category', 'name slug')
    .limit(10);
  return ApiResponse.success(res, products);
};

exports.getNewArrivals = async (req, res) => {
  const products = await Product.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .populate('category', 'name slug')
    .limit(10);
  return ApiResponse.success(res, products);
};

exports.getDealsOfTheDay = async (req, res) => {
  const products = await Product.find({ isDealOfTheDay: true, status: 'active' })
    .populate('category', 'name slug')
    .limit(10);
  return ApiResponse.success(res, products);
};

exports.getRelated = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: 'active',
  })
    .limit(6)
    .populate('category', 'name slug');

  return ApiResponse.success(res, related);
};
