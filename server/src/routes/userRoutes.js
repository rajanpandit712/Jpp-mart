const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

router.use(authenticate);

router.get('/profile', authController.getMe);
router.patch('/profile', authController.updateProfile);
router.get('/addresses', async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, user.addresses);
});
router.post('/addresses', authController.addAddress);
router.patch('/addresses/:addressId', authController.updateAddress);
router.delete('/addresses/:addressId', authController.deleteAddress);
router.patch('/addresses/:addressId/default', async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.forEach((a) => {
    a.isDefault = a._id.toString() === req.params.addressId;
  });
  await user.save();
  return ApiResponse.success(res, user.addresses, 'Default address updated');
});

router.patch('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    throw ApiError.badRequest('New password must be at least 6 characters');
  }
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  return ApiResponse.success(res, null, 'Password updated successfully');
});

module.exports = router;
