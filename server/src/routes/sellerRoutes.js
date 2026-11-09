const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('seller', 'admin', 'superadmin'));

router.get('/profile', sellerController.getProfile);
router.put('/profile', sellerController.updateProfile);
router.patch('/profile', sellerController.updateProfile);

router.get('/dashboard', sellerController.getDashboardStats);
router.get('/dashboard-stats', sellerController.getDashboardStats);

router.get('/products', sellerController.getMyProducts);
router.post('/products', productController.createProduct);
router.patch('/products/:id', productController.updateProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

router.get('/orders', sellerController.getMyOrders);
router.put('/orders/:orderId/items/:itemId', sellerController.updateOrderItemStatus);
router.patch('/orders/:orderId/items/:itemId', sellerController.updateOrderItemStatus);

module.exports = router;
