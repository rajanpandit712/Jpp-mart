const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
  return ApiResponse.success(res, categories);
};

exports.getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) throw ApiError.notFound('Category not found');
  return ApiResponse.success(res, category);
};

exports.createCategory = async (req, res) => {
  const { name, slug, description, image, parent, isFeatured, order } = req.body;
  const computedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const category = await Category.create({
    name,
    slug: computedSlug,
    description,
    image,
    parent: parent || null,
    isFeatured: !!isFeatured,
    order: order || 0,
  });
  return ApiResponse.created(res, category);
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) throw ApiError.notFound('Category not found');
  return ApiResponse.success(res, category, 'Category updated');
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');
  return ApiResponse.success(res, null, 'Category deleted');
};
