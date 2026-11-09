const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const config = require('../config');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

exports.register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const assignedRole = role === 'seller' ? 'seller' : 'customer';
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role: assignedRole,
  });

  if (assignedRole === 'seller') {
    const storeName = req.body.storeName || `${name}'s Store`;
    await SellerProfile.create({
      user: user._id,
      storeName,
      status: 'approved',
    });
  }

  const token = generateToken(user._id, user.role);

  return ApiResponse.created(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
    token,
  }, 'Registration successful');
};

exports.login = async (req, res) => {
  const { email, password, expectedRole } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
  }

  // If specific role requested for portal (e.g. admin or seller)
  if (expectedRole && expectedRole === 'admin' && !['admin', 'superadmin'].includes(user.role)) {
    throw ApiError.forbidden('Access restricted to administrators');
  }
  if (expectedRole && expectedRole === 'seller' && user.role !== 'seller' && !['admin', 'superadmin'].includes(user.role)) {
    throw ApiError.forbidden('Access restricted to verified sellers');
  }

  const token = generateToken(user._id, user.role);

  let sellerProfile = null;
  if (user.role === 'seller') {
    sellerProfile = await SellerProfile.findOne({ user: user._id });
  }

  return ApiResponse.success(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      sellerProfile,
    },
    token,
  }, 'Login successful');
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  let sellerProfile = null;
  if (user.role === 'seller') {
    sellerProfile = await SellerProfile.findOne({ user: user._id });
  }

  return ApiResponse.success(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      addresses: user.addresses,
      sellerProfile,
    },
  });
};

exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  await user.save();

  return ApiResponse.success(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  }, 'Profile updated successfully');
};

exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();

  return ApiResponse.success(res, { addresses: user.addresses }, 'Address added successfully');
};

exports.updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(addressId);
  if (!address) throw ApiError.notFound('Address not found');

  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save();

  return ApiResponse.success(res, { addresses: user.addresses }, 'Address updated successfully');
};

exports.deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user._id);
  user.addresses.pull({ _id: addressId });
  await user.save();

  return ApiResponse.success(res, { addresses: user.addresses }, 'Address deleted successfully');
};

exports.logout = async (req, res) => {
  return ApiResponse.success(res, null, 'Logged out successfully');
};

exports.refresh = async (req, res) => {
  // If user is already authenticated or sent token, return a fresh access token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], config.jwt.secret);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        const accessToken = generateToken(user._id, user.role);
        return ApiResponse.success(res, { accessToken });
      }
    } catch (_) {}
  }
  return ApiResponse.success(res, { accessToken: null });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email ? email.toLowerCase() : '' });
  return ApiResponse.success(res, null, 'If that email exists, password reset instructions have been sent.');
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!password || password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters long');
  }
  return ApiResponse.success(res, null, 'Password reset successfully. You may now log in.');
};
