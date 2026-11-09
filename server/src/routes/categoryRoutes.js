const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post('/', authenticate, authorize('admin', 'superadmin'), categoryController.createCategory);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), categoryController.updateCategory);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), categoryController.deleteCategory);

module.exports = router;
