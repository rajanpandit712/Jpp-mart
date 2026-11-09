const mongoose = require('mongoose');

const sellerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '',
    },
    businessDetails: {
      gstNumber: String,
      panNumber: String,
      businessType: {
        type: String,
        enum: ['individual', 'proprietorship', 'partnership', 'private_limited'],
        default: 'individual',
      },
      registeredAddress: String,
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    commissionRate: {
      type: Number,
      default: 10, // 10%
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'approved', // auto-approve in dev for seamless vendor onboarding
      index: true,
    },
    rating: {
      average: { type: Number, default: 4.5 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

sellerProfileSchema.pre('save', function () {
  if (this.isModified('storeName') && !this.slug) {
    this.slug = this.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
});

module.exports = mongoose.model('SellerProfile', sellerProfileSchema);
