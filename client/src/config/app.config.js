// JPP Market – Centralized application configuration
// All environment-specific values come from import.meta.env

const config = {
  // API base URL – points to the Express backend (proxied in Vite)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',

  // App identity
  appName: 'JPP Mart',
  appTagline: 'Everything You Need, One Marketplace.',
  appVersion: '1.0.0',

  // Currency
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
  },

  // Cloudinary (public config only – never expose private keys here)
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  },

  // Razorpay (only the public key ID belongs here)
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  },

  // Pagination defaults
  pagination: {
    productsPerPage: 20,
    ordersPerPage: 10,
    reviewsPerPage: 10,
  },

  // Image fallback
  placeholderImage: '/placeholder-product.svg',

  // Feature flags
  features: {
    guestCart: true,           // Allow cart before login
    wishlistRequiresAuth: true,
    reviewsRequireOrder: true, // Only verified-purchase reviewers
    codEnabled: false,         // Cash on delivery (enable when operations ready)
  },
};

export default config;
