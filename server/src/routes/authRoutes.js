const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/seller/register', (req, res, next) => { req.body.role = 'seller'; authController.register(req, res, next); });
router.post('/seller/login', (req, res, next) => { req.body.expectedRole = 'seller'; authController.login(req, res, next); });
router.post('/admin/login', (req, res, next) => { req.body.expectedRole = 'admin'; authController.login(req, res, next); });
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/addresses', authenticate, authController.addAddress);
router.put('/addresses/:addressId', authenticate, authController.updateAddress);
router.delete('/addresses/:addressId', authenticate, authController.deleteAddress);

module.exports = router;
