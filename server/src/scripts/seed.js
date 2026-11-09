const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    logger.info('Connecting to database for seeding...');
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB. Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      SellerProfile.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
    ]);

    logger.info('Collections cleared. Creating categories...');

    const categories = await Category.create([
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
    ]);

    const catMap = {};
    categories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    logger.info('Creating users & seller accounts...');

    const admin = await User.create({
      name: 'JPP Admin',
      email: 'admin@jppmarket.com',
      password: 'AdminPassword123!',
      phone: '+91 98765 43210',
      role: 'admin',
      isVerified: true,
    });

    const seller1User = await User.create({
      name: 'Rohan Sharma',
      email: 'seller@techhaven.com',
      password: 'SellerPassword123!',
      phone: '+91 98111 22233',
      role: 'seller',
      isVerified: true,
    });

    const seller2User = await User.create({
      name: 'Priya Verma',
      email: 'seller@urbantrends.com',
      password: 'SellerPassword123!',
      phone: '+91 98222 33344',
      role: 'seller',
      isVerified: true,
    });

    const customerUser = await User.create({
      name: 'Aditya Patel',
      email: 'customer@jppmarket.com',
      password: 'CustomerPassword123!',
      phone: '+91 98333 44455',
      role: 'customer',
      isVerified: true,
      addresses: [
        {
          fullName: 'Aditya Patel',
          phone: '+91 98333 44455',
          addressLine1: 'Flat 402, Sunshine Heights',
          addressLine2: 'Outer Ring Road, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
          isDefault: true,
          type: 'home',
        },
      ],
    });

    const seller1Profile = await SellerProfile.create({
      user: seller1User._id,
      storeName: 'TechHaven Electronics',
      slug: 'techhaven-electronics',
      description: 'Authorized retailer of cutting-edge electronics, personal audio, and computing gear.',
      logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&q=80',
      status: 'approved',
      rating: { average: 4.8, count: 124 },
      businessDetails: {
        gstNumber: '29ABCDE1234F1Z5',
        businessType: 'private_limited',
        registeredAddress: 'Indiranagar 100ft Road, Bengaluru, KA',
      },
    });

    const seller2Profile = await SellerProfile.create({
      user: seller2User._id,
      storeName: 'UrbanTrends Apparel',
      slug: 'urbantrends-apparel',
      description: 'Curated premium fashion, everyday streetwear, and ethical apparel for the modern creator.',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80',
      status: 'approved',
      rating: { average: 4.7, count: 89 },
      businessDetails: {
        gstNumber: '29WXYZ7890K1Z2',
        businessType: 'proprietorship',
        registeredAddress: 'Koramangala 4th Block, Bengaluru, KA',
      },
    });

    logger.info('Creating catalog products...');

    const products = await Product.create([
      {
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        slug: 'sony-wh-1000xm5-wireless-noise-cancelling-headphones',
        seller: seller1Profile._id,
        category: catMap['electronics'],
        brand: 'Sony',
        description: 'Industry leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging. Crystal clear hands-free calling with precise voice pickup technology.',
        highlights: ['Industry-leading noise cancellation', '30-hour battery life', 'Ultra-comfortable lightweight design', 'Multipoint Bluetooth connection'],
        mrp: 34990,
        price: 26990,
        stock: 35,
        sku: 'SONY-WH1000XM5-BLK',
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'Sony WH-1000XM5', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', alt: 'Headphones angled' },
        ],
        ratings: { average: 4.9, count: 428 },
        isFeatured: true,
        isBestSeller: true,
        isDealOfTheDay: true,
        tags: ['headphones', 'audio', 'sony', 'wireless', 'anc'],
      },
      {
        title: 'Apple MacBook Air M3 (13.6-inch, 16GB RAM, 512GB SSD)',
        slug: 'apple-macbook-air-m3-13-inch-512gb',
        seller: seller1Profile._id,
        category: catMap['electronics'],
        brand: 'Apple',
        description: 'Supercharged by M3 chip with next-generation GPU. Liquid Retina display supports 1 billion colours. Up to 18 hours of battery life in a fanless, whisper-quiet design.',
        highlights: ['Apple M3 chip with 8-core CPU and 10-core GPU', '13.6-inch Liquid Retina display', 'MagSafe 3 charging port', 'All-day 18-hour battery'],
        mrp: 134900,
        price: 119900,
        stock: 20,
        sku: 'APL-MBA-M3-13-512',
        images: [
          { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', alt: 'MacBook Air M3', isPrimary: true },
        ],
        ratings: { average: 4.8, count: 215 },
        isFeatured: true,
        isBestSeller: true,
        tags: ['laptop', 'apple', 'macbook', 'm3'],
      },
      {
        title: 'Samsung Galaxy Watch 6 Classic (47mm Bluetooth)',
        slug: 'samsung-galaxy-watch-6-classic-47mm',
        seller: seller1Profile._id,
        category: catMap['electronics'],
        brand: 'Samsung',
        description: 'Iconic rotating bezel with sapphire crystal glass. Advanced sleep coaching, ECG, blood pressure monitoring, and comprehensive body composition analysis.',
        highlights: ['Classic rotating bezel', 'Advanced health & sleep tracking', 'Sapphire crystal display', 'Water resistant IP68'],
        mrp: 40999,
        price: 28999,
        stock: 45,
        sku: 'SAM-GW6C-47-BLK',
        images: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Samsung Galaxy Watch', isPrimary: true },
        ],
        ratings: { average: 4.6, count: 98 },
        isDealOfTheDay: true,
        tags: ['smartwatch', 'samsung', 'wearable', 'fitness'],
      },
      {
        title: 'vdlooks Men Regular Fit Checkered Casual Shirt',
        slug: 'vdlooks-men-regular-fit-checkered-casual-shirt',
        seller: seller2Profile._id,
        category: catMap['fashion'],
        brand: 'vdlooks',
        description: 'Men regular fit checkered casual shirt with spread collar, curved hem, and breathable cotton blend fabric. Ideal for everyday western wear.',
        highlights: ['Pack of: 1', 'Fabric: Cotton Blend', 'Sleeve: Full Sleeve', 'Pattern: Checkered'],
        mrp: 1499,
        price: 312,
        stock: 45,
        sku: 'VDL-SHIRT-CHK-GRY',
        images: [
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', alt: 'vdlooks Checkered Shirt Grey', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80', alt: 'vdlooks Checkered Shirt Blue' },
        ],
        ratings: { average: 3.9, count: 3478 },
        isFeatured: true,
        isDealOfTheDay: true,
        tags: ['shirt', 'checkered', 'casual', 'men', 'fashion', 'vdlooks'],
        specifications: {
          'Brand': 'vdlooks',
          'Size': 'XL',
          'Pack of': '1',
          'Style Code': 'LIPI_LFFLIP_01_GREEN*',
          'Fit': 'Regular',
          'Fabric': 'Cotton Blend',
          'Sleeve': 'Full Sleeve',
          'Pattern': 'Checkered',
          'Reversible': 'No',
          'Color': 'Grey, White',
          'Fabric Care': 'Cold water wash only',
          'Suitable For': 'Western Wear',
          'Net Quantity': '1',
          'Brand Color': 'Grey - 1',
          'Ideal For': 'Men',
          'Shirt Length': 'Hip Length',
        },
      },
      {
        title: 'Minimalist Heavyweight Cotton Oversized Tee',
        slug: 'minimalist-heavyweight-cotton-oversized-tee',
        seller: seller2Profile._id,
        category: catMap['fashion'],
        brand: 'UrbanTrends',
        description: '280 GSM premium combed cotton with a relaxed streetwear silhouette. Pre-shrunk fabric with reinforced ribbed collar.',
        highlights: ['280 GSM 100% combed cotton', 'Dropped shoulder oversized fit', 'Bio-washed for ultra-soft feel', 'Durable double-stitch hem'],
        mrp: 1999,
        price: 999,
        stock: 120,
        sku: 'UT-TEE-OVS-BLK',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', alt: 'Oversized Cotton Tee', isPrimary: true },
        ],
        ratings: { average: 4.7, count: 184 },
        isFeatured: true,
        isBestSeller: true,
        tags: ['tshirt', 'cotton', 'oversized', 'fashion', 'streetwear'],
      },
      {
        title: 'Classic Italian Leather Oxford Dress Shoes',
        slug: 'classic-italian-leather-oxford-dress-shoes',
        seller: seller2Profile._id,
        category: catMap['fashion'],
        brand: 'ArtisanCraft',
        description: 'Handcrafted full-grain leather Oxfords with Goodyear welted construction. Cushioned memory foam footbed for all-day formal comfort.',
        highlights: ['Full-grain calfskin leather', 'Goodyear welted durability', 'Memory foam cushioned insole', 'Hand-burnished finish'],
        mrp: 6999,
        price: 4499,
        stock: 25,
        sku: 'ART-OXF-BRN-42',
        images: [
          { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80', alt: 'Leather Oxford Shoes', isPrimary: true },
        ],
        ratings: { average: 4.8, count: 62 },
        tags: ['shoes', 'formal', 'leather', 'footwear'],
      },
      {
        title: 'Cast Iron Dutch Oven with Enameled Finish (5.5 Litres)',
        slug: 'cast-iron-dutch-oven-enameled-5-5-litres',
        seller: seller2Profile._id,
        category: catMap['home-kitchen'],
        brand: 'Culinaria',
        description: 'Heavyweight enameled cast iron delivers superior heat retention and even heat distribution. Oven-safe up to 260°C with tight-fitting condensation lid.',
        highlights: ['Heavyweight enameled cast iron', 'Oven safe up to 260°C', 'Superior heat distribution', 'Chip-resistant glossy porcelain'],
        mrp: 5499,
        price: 3699,
        stock: 30,
        sku: 'CUL-DUTCH-55L-RED',
        images: [
          { url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80', alt: 'Dutch Oven Cookware', isPrimary: true },
        ],
        ratings: { average: 4.9, count: 142 },
        isFeatured: true,
        tags: ['cookware', 'kitchen', 'dutch oven', 'cast iron'],
      },
      {
        title: 'Ergonomic High-Back Mesh Executive Office Chair',
        slug: 'ergonomic-high-back-mesh-executive-office-chair',
        seller: seller2Profile._id,
        category: catMap['home-kitchen'],
        brand: 'ErgoPro',
        description: 'Breathable dual-mesh backrest with 3D adjustable lumbar support, 4D armrests, and 135-degree recline mechanism. Class 4 gas lift for lasting stability.',
        highlights: ['3D dynamic lumbar support', '4D adjustable armrests', 'Breathable Korean mesh', 'BIFMA certified class-4 gas lift'],
        mrp: 18999,
        price: 11499,
        stock: 18,
        sku: 'ERGO-CHR-EX-GRY',
        images: [
          { url: 'https://images.unsplash.com/photo-1580481077195-731da01f3799?w=800&q=80', alt: 'Ergonomic Office Chair', isPrimary: true },
        ],
        ratings: { average: 4.7, count: 88 },
        isDealOfTheDay: true,
        tags: ['furniture', 'chair', 'ergonomic', 'office', 'home'],
      },
      {
        title: 'Botanical Vitamin C & Hyaluronic Acid Facial Serum (30ml)',
        slug: 'botanical-vitamin-c-hyaluronic-acid-facial-serum',
        seller: seller2Profile._id,
        category: catMap['beauty-wellness'],
        brand: 'GlowOrganics',
        description: 'Formulated with 20% active Vitamin C, pure botanical hyaluronic acid, and Ferulic acid to brighten dark spots and deeply hydrate skin.',
        highlights: ['20% pure Vitamin C + E + Ferulic Acid', 'Deep hydration with triple molecular hyaluronic', 'Dermatologist tested', 'Cruelty-free & vegan'],
        mrp: 1499,
        price: 799,
        stock: 75,
        sku: 'GLO-SER-VITC-30',
        images: [
          { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', alt: 'Face Serum Bottle', isPrimary: true },
        ],
        ratings: { average: 4.8, count: 320 },
        isBestSeller: true,
        tags: ['skincare', 'serum', 'vitamin c', 'beauty'],
      },
    ]);

    // Also insert expanded catalog items
    const { productsCatalog } = require('./catalogData');
    for (const prod of productsCatalog) {
      const exists = products.some(p => p.slug === prod.slug);
      if (!exists) {
        const catId = catMap[prod.categorySlug] || catMap['electronics'];
        await Product.create({
          title: prod.title,
          slug: prod.slug,
          seller: seller1Profile._id,
          category: catId,
          brand: prod.brand,
          description: prod.description,
          highlights: prod.highlights,
          images: prod.images,
          mrp: prod.mrp,
          price: prod.price,
          stock: prod.stock,
          sku: prod.sku,
          ratings: prod.ratings,
          isFeatured: Boolean(prod.isFeatured),
          isDealOfTheDay: Boolean(prod.isDealOfTheDay),
          isBestSeller: Boolean(prod.isBestSeller),
          status: 'active',
          tags: prod.tags || [],
          specifications: prod.specifications || {},
        });
      }
    }

    logger.info('Creating sample coupons...');

    await Coupon.create([
      {
        code: 'WELCOME100',
        discountType: 'fixed',
        discountAmount: 100,
        minOrderAmount: 499,
        validUntil: new Date('2028-12-31'),
        isActive: true,
      },
      {
        code: 'JPP20',
        discountType: 'percentage',
        discountAmount: 20,
        minOrderAmount: 999,
        maxDiscountAmount: 500,
        validUntil: new Date('2028-12-31'),
        isActive: true,
      },
    ]);

    logger.info('✅ Seeding completed successfully!');
    logger.info('Default credentials:');
    logger.info(' - Admin:    admin@jppmarket.com / AdminPassword123!');
    logger.info(' - Seller:   seller@techhaven.com / SellerPassword123!');
    logger.info(' - Customer: customer@jppmarket.com / CustomerPassword123!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    logger.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
