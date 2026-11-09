const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

router.get('/products/:productId', reviewController.getProductReviews);
router.get('/product/:productId', reviewController.getProductReviews);
router.post('/products/:productId', authenticate, reviewController.addReview);
router.post('/', authenticate, (req, res, next) => {
  req.params.productId = req.body.productId;
  reviewController.addReview(req, res, next);
});
router.post('/:id/helpful', authenticate, reviewController.voteHelpful);

module.exports = router;
