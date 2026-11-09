/**
 * Script to seed 75+ realistic products into JPP Market
 * Retains existing admin & accounts while expanding categories, sellers, and product database.
 */

const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const Category = require('../models/Category');
const Product = require('../models/Product');
const logger = require('../utils/logger');
const { sellersData, productsCatalog } = require('./catalogData');

const seedExpandedProducts = async () => {
  try {
    logger.info('Connecting to database to seed 75+ products...');
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB.');

    // 1. Ensure Categories exist and map them
    const categories = await Category.find({});
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // Make sure standard categories exist
    const standardCategories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets, laptops, smartphones, and audio gear',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
        isFeatured: true,
        order: 1,
      },
      {
        name: 'Fashion & Apparel',
        slug: 'fashion',
        description: 'Trending styles for men, women, and accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80',
        isFeatured: true,
        order: 2,
      },
      {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Modern cookware, home decor, and appliances',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80',
        isFeatured: true,
        order: 3,
      },
      {
        name: 'Beauty & Wellness',
        slug: 'beauty-wellness',
        description: 'Premium skincare, hair care, and fragrances',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80',
        isFeatured: true,
        order: 4,
      },
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Fitness equipment, athletic wear, and outdoor essentials',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80',
        isFeatured: true,
        order: 5,
      },
      {
        name: 'Books & Stationery',
        slug: 'books-stationery',
        description: 'Best-selling novels, academic books, and fine stationery',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
        isFeatured: true,
        order: 6,
      },
    ];

    for (const cat of standardCategories) {
      if (!catMap[cat.slug]) {
        const createdCat = await Category.create(cat);
        catMap[cat.slug] = createdCat._id;
        logger.info(`Created category: ${cat.name}`);
      }
    }

    // 3. Ensure Seller Profiles exist with dedicated user accounts
    const sellerMap = {};
    for (const sData of sellersData) {
      let seller = await SellerProfile.findOne({ slug: sData.slug });
      if (!seller) {
        const sellerUserEmail = `contact@${sData.slug}.com`;
        let sUser = await User.findOne({ email: sellerUserEmail });
        if (!sUser) {
          sUser = await User.create({
            name: sData.storeName,
            email: sellerUserEmail,
            password: 'SellerPassword123!',
            phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
            role: 'seller',
            isVerified: true,
          });
        }
        seller = await SellerProfile.create({
          user: sUser._id,
          storeName: sData.storeName,
          slug: sData.slug,
          description: sData.description,
          logo: sData.logo,
          status: 'approved',
          rating: sData.rating,
          businessDetails: sData.businessDetails,
        });
        logger.info(`Created seller profile: ${sData.storeName}`);
      }
      sellerMap[sData.slug] = seller._id;
    }

    // Fallback seller if slug not found
    const fallbackSellerId = Object.values(sellerMap)[0];

    // 4. Upsert / Seed products
    logger.info(`Seeding ${productsCatalog.length} products...`);
    let addedCount = 0;
    let updatedCount = 0;

    for (const prod of productsCatalog) {
      const categoryId = catMap[prod.categorySlug] || catMap['electronics'];
      const sellerId = sellerMap[prod.sellerSlug] || fallbackSellerId;

      const productData = {
        title: prod.title,
        slug: prod.slug,
        seller: sellerId,
        category: categoryId,
        brand: prod.brand,
        description: prod.description,
        highlights: prod.highlights,
        images: prod.images,
        mrp: prod.mrp,
        price: prod.price,
        discountPercentage: Math.round(((prod.mrp - prod.price) / prod.mrp) * 100),
        stock: prod.stock,
        sku: prod.sku,
        ratings: prod.ratings,
        isFeatured: Boolean(prod.isFeatured),
        isDealOfTheDay: Boolean(prod.isDealOfTheDay),
        isBestSeller: Boolean(prod.isBestSeller),
        status: 'active',
        tags: prod.tags || [],
        specifications: prod.specifications || {},
      };

      const existing = await Product.findOne({ slug: prod.slug });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: productData });
        updatedCount++;
      } else {
        await Product.create(productData);
        addedCount++;
      }
    }

    const totalProducts = await Product.countDocuments();
    logger.info(`✅ Products seeding complete! Added: ${addedCount}, Updated: ${updatedCount}. Total in database: ${totalProducts}`);
    process.exit(0);
  } catch (err) {
    logger.error('Error seeding products:', err);
    process.exit(1);
  }
};

seedExpandedProducts();
