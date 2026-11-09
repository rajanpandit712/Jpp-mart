const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', productController.getProducts);
router.get('/search', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/best-sellers', productController.getBestSellers);
router.get('/trending', productController.getTrending);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/deals', productController.getDealsOfTheDay);
router.get('/category/:cat', (req, res, next) => { req.query.category = req.params.cat; productController.getProducts(req, res, next); });
router.get('/slug/:slugOrId', productController.getProductBySlug);
router.get('/:id/related', productController.getRelated);
router.get('/:slugOrId', productController.getProductBySlug);

router.post('/', authenticate, authorize('seller', 'admin', 'superadmin'), productController.createProduct);
router.put('/:id', authenticate, authorize('seller', 'admin', 'superadmin'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('seller', 'admin', 'superadmin'), productController.deleteProduct);

module.exports = router;
