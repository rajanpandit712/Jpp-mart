import api from './api';

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const authService = {
  register:       (data)  => api.post('/auth/register', data),
  login:          (data)  => api.post('/auth/login', data),
  logout:         ()      => api.post('/auth/logout'),
  me:             ()      => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
  verifyEmail:    (token) => api.get(`/auth/verify-email/${token}`),
  refresh:        ()      => api.post('/auth/refresh'),

  // Seller-specific auth
  sellerRegister: (data)  => api.post('/auth/seller/register', data),
  sellerLogin:    (data)  => api.post('/auth/seller/login', data),

  // Admin auth
  adminLogin:     (data)  => api.post('/auth/admin/login', data),
};

// ─── Product endpoints ────────────────────────────────────────────────────────

export const productService = {
  getAll:     (params) => api.get('/products', { params }),
  getById:    (id)     => api.get(`/products/${id}`),
  getBySlug:  (slug)   => api.get(`/products/slug/${slug}`),
  search:     (query, params) => api.get('/products/search', { params: { q: query, ...params } }),
  getFeatured:() => api.get('/products/featured'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getTrending: () => api.get('/products/trending'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getDeals:   () => api.get('/products/deals'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getByCategory: (cat, params) => api.get(`/products/category/${cat}`, { params }),
};

// ─── Category endpoints ───────────────────────────────────────────────────────

export const categoryService = {
  getAll:   () => api.get('/categories'),
  getById:  (id) => api.get(`/categories/${id}`),
  getBySlug:(slug) => api.get(`/categories/slug/${slug}`),
};

// ─── Cart endpoints ───────────────────────────────────────────────────────────

export const cartService = {
  get:        () => api.get('/cart'),
  addItem:    (data) => api.post('/cart/items', data),
  updateItem: (itemId, data) => api.patch(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear:      () => api.delete('/cart'),
  applyCoupon:(code) => api.post('/cart/coupon', { code }),
  removeCoupon:() => api.delete('/cart/coupon'),
};

// ─── Wishlist endpoints ───────────────────────────────────────────────────────

export const wishlistService = {
  get:    () => api.get('/wishlist'),
  add:    (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// ─── Order endpoints ──────────────────────────────────────────────────────────

export const orderService = {
  create:      (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById:     (id) => api.get(`/orders/${id}`),
  cancel:      (id, reason) => api.patch(`/orders/${id}/cancel`, { reason }),
  requestReturn:(id, data) => api.post(`/orders/${id}/return`, data),
};

// ─── Payment endpoints ────────────────────────────────────────────────────────

export const paymentService = {
  create:  (data) => api.post('/payments/create', data),
  verify:  (data) => api.post('/payments/verify', data),
};

// ─── Review endpoints ─────────────────────────────────────────────────────────

export const reviewService = {
  getByProduct: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  create:       (data) => api.post('/reviews', data),
  update:       (id, data) => api.patch(`/reviews/${id}`, data),
  delete:       (id) => api.delete(`/reviews/${id}`),
};

// ─── User / Customer endpoints ────────────────────────────────────────────────

export const userService = {
  getProfile:    () => api.get('/user/profile'),
  updateProfile: (data) => api.patch('/user/profile', data),
  changePassword:(data) => api.patch('/user/change-password', data),
  getAddresses:  () => api.get('/user/addresses'),
  addAddress:    (data) => api.post('/user/addresses', data),
  updateAddress: (id, data) => api.patch(`/user/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/user/addresses/${id}`),
  setDefault:    (id) => api.patch(`/user/addresses/${id}/default`),
};

// ─── Seller endpoints ─────────────────────────────────────────────────────────

export const sellerService = {
  getDashboard:   () => api.get('/seller/dashboard'),
  getProfile:     () => api.get('/seller/profile'),
  updateProfile:  (data) => api.patch('/seller/profile', data),
  getProducts:    (params) => api.get('/seller/products', { params }),
  createProduct:  (data) => api.post('/seller/products', data),
  updateProduct:  (id, data) => api.patch(`/seller/products/${id}`, data),
  deleteProduct:  (id) => api.delete(`/seller/products/${id}`),
  getOrders:      (params) => api.get('/seller/orders', { params }),
  updateOrderStatus:(orderId, itemId, data) =>
    api.patch(`/seller/orders/${orderId}/items/${itemId}`, data),
  getSalesReport: (params) => api.get('/seller/reports/sales', { params }),
};

// ─── Admin endpoints ──────────────────────────────────────────────────────────

export const adminService = {
  getDashboard:      () => api.get('/admin/dashboard'),
  getCustomers:      (params) => api.get('/admin/customers', { params }),
  updateCustomer:    (id, data) => api.patch(`/admin/customers/${id}`, data),
  getSellers:        (params) => api.get('/admin/sellers', { params }),
  updateSellerStatus:(id, data) => api.patch(`/admin/sellers/${id}/status`, data),
  getPendingProducts:(params) => api.get('/admin/products/pending', { params }),
  approveProduct:    (id) => api.patch(`/admin/products/${id}/approve`),
  rejectProduct:     (id, reason) => api.patch(`/admin/products/${id}/reject`, { reason }),
  getOrders:         (params) => api.get('/admin/orders', { params }),
  getCategories:     () => api.get('/admin/categories'),
  createCategory:    (data) => api.post('/admin/categories', data),
  updateCategory:    (id, data) => api.patch(`/admin/categories/${id}`, data),
  getCoupons:        (params) => api.get('/admin/coupons', { params }),
  createCoupon:      (data) => api.post('/admin/coupons', data),
  updateCoupon:      (id, data) => api.patch(`/admin/coupons/${id}`, data),
  deleteCoupon:      (id) => api.delete(`/admin/coupons/${id}`),
  getReports:        (params) => api.get('/admin/reports', { params }),
};

export { locationService } from './locationService';

