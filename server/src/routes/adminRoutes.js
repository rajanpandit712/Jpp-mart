const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin', 'superadmin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/dashboard-stats', adminController.getDashboardStats);

router.get('/customers', adminController.getCustomers);
router.patch('/customers/:id/status', adminController.toggleUserStatus);
router.patch('/customers/:id', adminController.toggleUserStatus);

router.get('/sellers', adminController.getSellers);
router.patch('/sellers/:id/status', adminController.updateSellerStatus);

router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.put('/orders/:id/status', adminController.updateOrderStatus);

router.get('/categories', categoryController.getCategories);
router.post('/categories', categoryController.createCategory);
router.patch('/categories/:id', categoryController.updateCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

router.get('/coupons', adminController.getCoupons);
router.post('/coupons', adminController.createCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

router.get('/products', adminController.getProducts);
router.get('/products/pending', adminController.getProducts);
router.patch('/products/:id/approve', adminController.approveProduct);
router.patch('/products/:id/reject', adminController.rejectProduct);

module.exports = router;
