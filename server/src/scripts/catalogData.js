/**
 * Comprehensive Product Catalog for JPP Market
 * 75+ realistic Indian e-commerce products across all major categories.
 */

const sellersData = [
  {
    storeName: 'TechHaven Electronics',
    slug: 'techhaven-electronics',
    description: 'Authorized retailer of cutting-edge electronics, personal audio, and computing gear.',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&q=80',
    rating: { average: 4.8, count: 245 },
    businessDetails: {
      gstNumber: '29ABCDE1234F1Z5',
      businessType: 'private_limited',
      registeredAddress: 'Indiranagar 100ft Road, Bengaluru, KA',
    },
  },
  {
    storeName: 'UrbanTrends Apparel',
    slug: 'urbantrends-apparel',
    description: 'Curated premium fashion, everyday streetwear, and ethical apparel for the modern creator.',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80',
    rating: { average: 4.7, count: 189 },
    businessDetails: {
      gstNumber: '29WXYZ7890K1Z2',
      businessType: 'proprietorship',
      registeredAddress: 'Koramangala 4th Block, Bengaluru, KA',
    },
  },
  {
    storeName: 'HomeCraft & Kitchen Living',
    slug: 'homecraft-appliances',
    description: 'Modern cookware, precision kitchen appliances, and certified home comfort solutions.',
    logo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&q=80',
    rating: { average: 4.6, count: 112 },
    businessDetails: {
      gstNumber: '27HOMEK9988C1Z4',
      businessType: 'private_limited',
      registeredAddress: 'Andheri West, Mumbai, MH',
    },
  },
  {
    storeName: 'PureGlow Wellness & Care',
    slug: 'pureglow-wellness',
    description: 'Dermatologist-recommended skincare, ayurvedic formulations, and luxury wellness.',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80',
    rating: { average: 4.9, count: 320 },
    businessDetails: {
      gstNumber: '07PUREG4321P1Z9',
      businessType: 'private_limited',
      registeredAddress: 'Connaught Place, New Delhi, DL',
    },
  },
  {
    storeName: 'Apex Sports & Outdoor Gear',
    slug: 'apex-sports-gear',
    description: 'Pro-grade athletic gear, fitness equipment, gym essentials, and outdoor accessories.',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&q=80',
    rating: { average: 4.8, count: 140 },
    businessDetails: {
      gstNumber: '33APEXS5678Q1Z1',
      businessType: 'private_limited',
      registeredAddress: 'T Nagar, Chennai, TN',
    },
  },
];

const productsCatalog = [
  // =========================================================================
  // AUDIO & HEADPHONES (Electronics) - 12 Products
  // =========================================================================
  {
    title: 'Zebronics Thunder Pro (2026 Upgrade) Wireless Over-Ear Headphones',
    slug: 'zebronics-thunder-pro-wireless-headphones-bt-6',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Zebronics',
    description: 'Zebronics Thunder Pro Wireless Headphones with Bluetooth v6.0, massive 60h playback time, 40mm dynamic drivers with deep bass, dual pairing, ENC for crystal clear calls, low latency gaming mode, and AUX & MicroSD support.',
    highlights: [
      'True 60-Hour Playback with Fast Type-C Charging',
      'Latest Bluetooth v6.0 with Dual Device Pairing',
      '40mm Dynamic Bass Drivers & Gaming Low Latency Mode',
      'Built-in Environmental Noise Cancellation (ENC) Mic',
      'Versatile 3.5mm AUX & MicroSD Card Playback Slot'
    ],
    mrp: 2999,
    price: 999,
    stock: 45,
    sku: 'ZEB-THUNDER-PRO-BLU',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'Zebronics Thunder Pro Wireless Headphones', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', alt: 'Earcups and cushioned headband' },
      { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', alt: 'Side profile controls' }
    ],
    ratings: { average: 4.5, count: 2840 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['headphones', 'zebronics', 'wireless', 'audio', 'bluetooth', 'gaming', 'bass'],
    specifications: {
      'Bluetooth Version': 'v6.0',
      'Playback Time': 'Up to 60 Hours',
      'Driver Size': '40 mm',
      'Charging Port': 'USB Type-C',
      'Connector Type': 'Bluetooth / 3.5mm AUX / MicroSD',
      'Warranty': '1 Year Manufacturer Warranty'
    }
  },
  {
    title: 'boAt Rockerz 450 Bluetooth On-Ear Headphones with 15H Battery',
    slug: 'boat-rockerz-450-bluetooth-on-ear-headphones',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'boAt',
    description: 'boAt Rockerz 450 on-ear wireless headphones feature 40mm dynamic drivers for signature HD sound, plush adaptive ear cushions, integrated controls, and up to 15 hours of musical bliss.',
    highlights: [
      '40mm Dynamic Drivers for Immersive boAt Signature Sound',
      'Up to 15 Hours Playback Time with 300mAh Battery',
      'Soft Padded Ear Cushions with Lightweight Ergonomic Design',
      'Dual Mode Connectivity: Bluetooth & 3.5mm AUX Cable'
    ],
    mrp: 3990,
    price: 1499,
    stock: 60,
    sku: 'BOAT-ROCKERZ-450-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', alt: 'boAt Rockerz 450 Black', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', alt: 'boAt Headband Detail' }
    ],
    ratings: { average: 4.4, count: 5820 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['boat', 'headphones', 'on-ear', 'audio', 'rockerz'],
    specifications: {
      'Driver Size': '40 mm',
      'Battery Life': '15 Hours',
      'Charging Time': '2 Hours',
      'Weight': '168 grams',
      'Warranty': '1 Year boAt Warranty'
    }
  },
  {
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    slug: 'sony-wh-1000xm5-wireless-noise-cancelling-headphones',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Sony',
    description: 'Industry leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging. Crystal clear hands-free calling with precise voice pickup technology and carbon fiber composite driver.',
    highlights: [
      'Industry-leading active noise cancellation (Auto NC Optimizer)',
      'Up to 30 hours battery life (3 min quick charge for 3 hours)',
      'High-Resolution Audio Wireless with LDAC support',
      'Speak-to-Chat & Multipoint Bluetooth connection'
    ],
    mrp: 34990,
    price: 26990,
    stock: 28,
    sku: 'SONY-WH1000XM5-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'Sony WH-1000XM5', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', alt: 'Sony Premium Finish' }
    ],
    ratings: { average: 4.9, count: 1420 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['sony', 'anc', 'headphones', 'premium', 'wireless', 'noise-cancelling'],
    specifications: {
      'Noise Cancellation': 'Dual Processor V1 + QN1 HD NC',
      'Battery Life': '30 Hours (ANC ON)',
      'Audio Codecs': 'LDAC, AAC, SBC',
      'Weight': '250 grams',
      'Warranty': '1 Year Sony India Warranty'
    }
  },
  {
    title: 'boAt Nirvana Ion ANC True Wireless Earbuds with 120H Playtime',
    slug: 'boat-nirvana-ion-anc-tws-earbuds',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'boAt',
    description: 'boAt Nirvana Ion ANC earbuds offer up to 32dB active noise cancellation, incredible 120 hours total playtime with dual EQ modes, crystal bionic sound, and quad mic ENx technology.',
    highlights: [
      'Up to 32dB Active Noise Cancellation',
      'Staggering 120-Hour Total Playtime with Pocket Case',
      'Quad Mics with ENx Tech for Noise-Free Calling',
      'Hi-Fi DSP with Dual EQ Modes (Bass & Balanced)'
    ],
    mrp: 9990,
    price: 2499,
    stock: 55,
    sku: 'BOAT-NIRVANA-ION-SLV',
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', alt: 'boAt Nirvana Ion Earbuds', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80', alt: 'Charging case' }
    ],
    ratings: { average: 4.6, count: 3100 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['boat', 'earbuds', 'tws', 'anc', 'wireless', 'nirvana'],
    specifications: {
      'ANC Depth': 'Up to 32 dB',
      'Total Playtime': '120 Hours (24 Hours per bud)',
      'Latency': '60ms BEAST Mode',
      'Water Resistance': 'IPX4 Splash Proof'
    }
  },
  {
    title: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    slug: 'apple-airpods-pro-2nd-gen-usbc',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Apple',
    description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio that tailors noise control to your environment, Transparency mode, and Personalized Spatial Audio with dynamic head tracking.',
    highlights: [
      'Apple-designed H2 chip with next-level audio performance',
      'Up to 2x better Active Noise Cancellation',
      'Adaptive Audio & Transparency mode',
      'Up to 30 hours of listening time with MagSafe USB-C Case'
    ],
    mrp: 24900,
    price: 20999,
    stock: 22,
    sku: 'APL-AIRPODS-PRO-2-USBC',
    images: [
      { url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80', alt: 'Apple AirPods Pro 2', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80', alt: 'AirPods Pro Case Open' }
    ],
    ratings: { average: 4.8, count: 2190 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['apple', 'airpods', 'pro', 'anc', 'ios', 'earbuds'],
    specifications: {
      'Chip': 'Apple H2 headphone chip',
      'Charging Case': 'MagSafe Case (USB-C) with Speaker & Lanyard Loop',
      'Battery Life': 'Up to 6 hours with ANC on single charge',
      'Water Resistance': 'IP54 dust, sweat, and water resistant'
    }
  },
  {
    title: 'JBL Tune 770NC Wireless Over-Ear Active Noise Cancelling Headphones',
    slug: 'jbl-tune-770nc-wireless-over-ear-headphones',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'JBL',
    description: 'Adaptive Noise Cancelling with Smart Ambient, JBL Pure Bass Sound, Bluetooth 5.3 with LE Audio support, up to 70 hours battery life and lightweight foldable design.',
    highlights: [
      'Adaptive Noise Cancelling with Smart Ambient technology',
      'Up to 70 hours battery life (44h with ANC)',
      'Speed Charge: 5 mins gives 3 hours playback',
      'JBL Headphones App customization'
    ],
    mrp: 9999,
    price: 5999,
    stock: 35,
    sku: 'JBL-TUNE-770NC-BLU',
    images: [
      { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', alt: 'JBL Tune 770NC Blue', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 1650 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['jbl', 'anc', 'pure-bass', 'wireless', 'headphones'],
    specifications: {
      'Driver': '40mm Dynamic driver',
      'Battery Life': 'Up to 70 Hours',
      'Bluetooth': 'v5.3',
      'Weight': '232g'
    }
  },
  {
    title: 'OnePlus Bullets Wireless Z2 Bluetooth Neckband Earphones',
    slug: 'oneplus-bullets-wireless-z2-neckband',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'OnePlus',
    description: 'Fast Charge 10 minutes for 20 hours playback! Massive 12.4mm dynamic drivers with bass boost, anti-distortion audio technology, and IP55 water & sweat resistance.',
    highlights: [
      '10-Minute Warp Charge delivers 20 hours of music',
      'Total 30 Hours Battery Life on full charge',
      'Huge 12.4mm Drivers for booming bass',
      'IP55 Water and Sweat Resistance'
    ],
    mrp: 2299,
    price: 1599,
    stock: 75,
    sku: 'OP-BULLETS-Z2-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80', alt: 'OnePlus Bullets Wireless Z2', isPrimary: true }
    ],
    ratings: { average: 4.4, count: 7400 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['oneplus', 'bullets', 'neckband', 'earphones', 'fast-charging'],
    specifications: {
      'Driver Size': '12.4mm',
      'Battery': '30 Hours',
      'Water Resistance': 'IP55',
      'Bluetooth': 'v5.0'
    }
  },
  {
    title: 'Realme Buds Air 5 Pro with 50dB ANC and LDAC Hi-Res Audio',
    slug: 'realme-buds-air-5-pro-tws',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Realme',
    description: 'Realme flagship TWS with coaxial dual drivers (11mm bass + 6mm micro-planar tweeter), 50dB active noise cancellation, 4000Hz ultra-wideband noise reduction, and 40 hours total playback.',
    highlights: [
      '50dB Active Noise Cancellation with Ultra-Wideband reduction',
      'Coaxial Dual Drivers: 11mm Bass + 6mm Micro-Planar Tweeter',
      'Hi-Res Audio Wireless certification with LDAC codec',
      'Up to 40 Hours Playback and 40ms Super Low Latency'
    ],
    mrp: 7999,
    price: 4999,
    stock: 40,
    sku: 'RLM-AIR-5-PRO-WHT',
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', alt: 'Realme Buds Air 5 Pro', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 1890 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['realme', 'tws', 'earbuds', 'anc', 'hires', 'ldac'],
    specifications: {
      'ANC Depth': '50 dB',
      'Audio Codec': 'LDAC, AAC, SBC',
      'Total Playtime': '40 Hours',
      'Waterproof': 'IPX5'
    }
  },
  {
    title: 'Sennheiser ACCENTUM Wireless ANC Bluetooth Headphones',
    slug: 'sennheiser-accentum-wireless-anc-headphones',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Sennheiser',
    description: 'Experience legendary Sennheiser sound engineering with 50-hour battery playtime, hybrid active noise cancellation, customizable sound modes, and supreme ergonomic comfort.',
    highlights: [
      'Unrivalled 50-Hour Battery Playtime',
      'Hybrid Active Noise Cancellation for undisturbed listening',
      'Sennheiser Signature Sound with custom acoustic transducer',
      'Built-in 5-band EQ and Smart Control App'
    ],
    mrp: 14990,
    price: 10990,
    stock: 18,
    sku: 'SENN-ACCENTUM-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', alt: 'Sennheiser ACCENTUM Headphones', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 870 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['sennheiser', 'audiophile', 'anc', 'headphones', 'premium'],
    specifications: {
      'Battery Life': '50 Hours',
      'Transducer': '37mm dynamic',
      'Connectivity': 'Bluetooth 5.2, USB-C Audio',
      'Weight': '222g'
    }
  },
  {
    title: 'Zebronics Zeb-Duke Wireless Over-Ear RGB Gaming Headphones',
    slug: 'zebronics-zeb-duke-rgb-wireless-headphones',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Zebronics',
    description: 'Get your game on with Zebronics Zeb-Duke wireless headphones featuring dynamic breathing RGB lights, 40mm drivers, dual pairing, 30 hours playback, and voice assistant support.',
    highlights: [
      'Dynamic RGB Breathing Lights on earcups',
      'Up to 30 Hours Playback on single charge',
      'Deep Bass 40mm drivers with low latency audio',
      'Supports Voice Assistant (Siri / Google)'
    ],
    mrp: 2499,
    price: 1299,
    stock: 3, // Urgency test stock!
    sku: 'ZEB-DUKE-RGB-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', alt: 'Zebronics Zeb-Duke RGB Headphones', isPrimary: true }
    ],
    ratings: { average: 4.3, count: 1980 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['zebronics', 'rgb', 'gaming', 'headphones', 'budget'],
    specifications: {
      'RGB Lighting': 'Multi-color breathing LED',
      'Driver Size': '40 mm',
      'Playback Time': '30 Hours (LED Off)',
      'Charging Time': '2.5 Hours'
    }
  },
  {
    title: 'Sony WF-1000XM5 Truly Wireless Noise Canceling Earbuds',
    slug: 'sony-wf-1000xm5-wireless-anc-earbuds',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Sony',
    description: 'The best noise canceling earbuds with dual feedback microphones and Dynamic Driver X. Pristine call quality with bone conduction sensors and AI-based noise reduction algorithm.',
    highlights: [
      'The Best Truly Wireless Noise Canceling in the market',
      'Dynamic Driver X for richer vocals and enhanced details',
      'Bone conduction sensor for crystal-clear phone calls',
      'Multipoint connection and Qi wireless charging'
    ],
    mrp: 29990,
    price: 21990,
    stock: 15,
    sku: 'SONY-WF1000XM5-SLV',
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', alt: 'Sony WF-1000XM5 Earbuds', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 1140 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['sony', 'tws', 'flagship', 'anc', 'earbuds', 'audiophile'],
    specifications: {
      'Driver Unit': '8.4 mm Dynamic Driver X',
      'Battery Life': '8 Hours (ANC On) + 16 Hours Case',
      'Water Resistance': 'IPX4',
      'Weight': '5.9g per earbud'
    }
  },
  {
    title: 'Noise Two Wireless On-Ear Bluetooth Headphones with 50H Playtime',
    slug: 'noise-two-wireless-on-ear-headphones',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Noise',
    description: 'Immerse in pure punchy bass with 40mm drivers, low latency gaming mode, 50-hour marathon battery, dual pairing, and soft-cushioned comfort cushions.',
    highlights: [
      '50 Hours Non-Stop Playtime',
      'Tru Bass Technology with 40mm speaker drivers',
      'Dual Pairing & Low Latency Gaming Mode',
      'Foldable design with built-in FM Radio and SD Card slot'
    ],
    mrp: 3999,
    price: 1499,
    stock: 50,
    sku: 'NOISE-TWO-BT-TEL',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'Noise Two Wireless Teal', isPrimary: true }
    ],
    ratings: { average: 4.4, count: 2310 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['noise', 'headphones', 'budget', 'wireless', 'battery'],
    specifications: {
      'Playtime': '50 Hours',
      'Driver': '40 mm',
      'Bluetooth': 'v5.3',
      'Features': 'FM Radio, MicroSD slot, AUX'
    }
  },

  // =========================================================================
  // SMARTPHONES & TABLETS (Electronics) - 10 Products
  // =========================================================================
  {
    title: 'Apple iPhone 16 Pro (128GB, Natural Titanium)',
    slug: 'apple-iphone-16-pro-128gb-natural-titanium',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Apple',
    description: 'Featuring a stunning grade 5 titanium design, Camera Control button, 4K 120 fps Dolby Vision recording, A18 Pro chip, and a huge leap in battery life with Apple Intelligence.',
    highlights: [
      'A18 Pro chip with 6-core GPU for unprecedented mobile performance',
      'Camera Control gives easier access to camera tools',
      '48MP Fusion camera with 5x Telephoto optical zoom',
      'All-day battery life with up to 27 hours video playback'
    ],
    mrp: 119900,
    price: 114900,
    stock: 25,
    sku: 'APL-IP16P-128-NAT',
    images: [
      { url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80', alt: 'Apple iPhone 16 Pro', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80', alt: 'iPhone back camera view' }
    ],
    ratings: { average: 4.9, count: 1820 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['apple', 'iphone', 'flagship', 'smartphone', 'titanium', 'a18-pro'],
    specifications: {
      'Display': '6.3-inch Super Retina XDR with ProMotion 120Hz',
      'Processor': 'A18 Pro Bionic Chip',
      'Storage': '128 GB NVMe',
      'Rear Camera': '48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto',
      'Battery': 'Up to 27 hrs video playback'
    }
  },
  {
    title: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Gray)',
    slug: 'samsung-galaxy-s24-ultra-5g-256gb',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Samsung',
    description: 'Meet Galaxy S24 Ultra with Galaxy AI, titanium exterior, built-in S Pen, 200MP camera system with ProVisual engine, and Snapdragon 8 Gen 3 for Galaxy.',
    highlights: [
      'Galaxy AI: Circle to Search, Live Call Translate, Note Assist',
      'Titanium Frame with Corning Gorilla Armor anti-reflective glass',
      '200MP Quad Telephoto Camera with 100x Space Zoom',
      'Built-in S Pen stylus with gesture control'
    ],
    mrp: 134999,
    price: 119999,
    stock: 20,
    sku: 'SAM-S24U-256-GRY',
    images: [
      { url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', alt: 'Samsung Galaxy S24 Ultra', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 2150 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['samsung', 'galaxy', 's24-ultra', 'ai', 'smartphone', 's-pen'],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X, 120Hz, 2600 nits',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'RAM / Storage': '12GB RAM / 256GB UFS 4.0',
      'Battery': '5000 mAh with 45W Fast Charging'
    }
  },
  {
    title: 'OnePlus 12 5G (16GB RAM, 512GB, Silky Black)',
    slug: 'oneplus-12-5g-16gb-512gb-silky-black',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'OnePlus',
    description: 'OnePlus 12 pairs Snapdragon 8 Gen 3 with 16GB LPDDR5X RAM, 4th Gen Hasselblad Camera System with 64MP periscope telephoto, 2K 120Hz ProXDR display, and 100W SUPERVOOC charging.',
    highlights: [
      'Snapdragon 8 Gen 3 processor with Dual Cryo-velocity VC Cooling',
      '4th Gen Hasselblad Camera System with 64MP 3X Periscope Zoom',
      '5400 mAh Battery with 100W Wired & 50W Wireless Charging',
      '2K 120Hz ProXDR Display with 4500 nits Peak Brightness'
    ],
    mrp: 69999,
    price: 64999,
    stock: 30,
    sku: 'OP-12-512-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80', alt: 'OnePlus 12 5G', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 1540 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['oneplus', 'oneplus-12', 'flagship', 'hasselblad', 'fast-charge'],
    specifications: {
      'RAM / Storage': '16GB LPDDR5X / 512GB UFS 4.0',
      'Charging': '100W SUPERVOOC wired, 50W AIRVOOC wireless',
      'Display': '6.82-inch QHD+ 120Hz LTPO AMOLED',
      'Main Camera': '50MP Sony LYT-808 with OIS'
    }
  },
  {
    title: 'Google Pixel 9 (128GB, Porcelain) with Gemini AI',
    slug: 'google-pixel-9-128gb-porcelain',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Google',
    description: 'Google Pixel 9 is engineered by Google with Google Tensor G4 for advanced Gemini AI, award-winning Pixel Camera system, 24-hour battery life, and 7 years of OS updates.',
    highlights: [
      'Custom Google Tensor G4 chip built for Gemini Nano AI',
      'Award-winning 50MP main camera with Magic Editor & Best Take',
      '6.3-inch Actua display with 120Hz smooth refresh rate',
      '7 years of guaranteed Android OS upgrades & feature drops'
    ],
    mrp: 79999,
    price: 74999,
    stock: 18,
    sku: 'GOOG-PIX9-128-POR',
    images: [
      { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', alt: 'Google Pixel 9 Porcelain', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 920 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['google', 'pixel', 'gemini', 'camera', 'android'],
    specifications: {
      'Processor': 'Google Tensor G4 + Titan M2 security coprocessor',
      'RAM': '12GB',
      'Display': '6.3" Actua OLED, 60-120Hz',
      'Camera': '50MP Octa PD main + 48MP Quad PD ultrawide'
    }
  },
  {
    title: 'Nothing Phone (2a) Plus 5G (12GB RAM, 256GB, Metallic Grey)',
    slug: 'nothing-phone-2a-plus-5g-256gb',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Nothing',
    description: 'Extra power with MediaTek Dimensity 7350 Pro 5G, iconic Glyph Interface lighting, dual 50MP rear cameras + 50MP selfie camera, and clean Nothing OS 2.6 with zero bloatware.',
    highlights: [
      'Iconic Glyph Interface with customizable light sequences',
      'MediaTek Dimensity 7350 Pro 5G processor (Exclusive)',
      'Triple 50MP Cameras (50MP Main + 50MP Ultrawide + 50MP Front)',
      'Nothing OS 2.6 with seamless widgets & ChatGPT integration'
    ],
    mrp: 29999,
    price: 24999,
    stock: 40,
    sku: 'NOTH-2AP-256-GRY',
    images: [
      { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', alt: 'Nothing Phone 2a Plus', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 3200 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['nothing', 'glyph', '5g', 'transparent', 'nothing-os'],
    specifications: {
      'Processor': 'Dimensity 7350 Pro 5G',
      'RAM / Storage': '12GB / 256GB',
      'Display': '6.7" Flexible AMOLED, 120Hz, 1300 nits',
      'Battery': '5000 mAh with 50W fast charging'
    }
  },
  {
    title: 'Apple iPad Air 11-inch M2 (128GB, Space Grey, Wi-Fi)',
    slug: 'apple-ipad-air-11-inch-m2-128gb',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Apple',
    description: 'Supercharged by Apple M2 chip. Stunning 11-inch Liquid Retina display with True Tone and P3 wide colour. Supports Apple Pencil Pro and Magic Keyboard for effortless productivity.',
    highlights: [
      'Blazing-fast M2 chip with 8-core CPU and 10-core GPU',
      '11-inch Liquid Retina display with anti-reflective coating',
      'Landscape 12MP Ultra Wide front camera with Center Stage',
      'Compatible with Apple Pencil Pro & Magic Keyboard'
    ],
    mrp: 59900,
    price: 54900,
    stock: 24,
    sku: 'APL-IPADAIR-M2-128-GRY',
    images: [
      { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', alt: 'Apple iPad Air M2', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 1450 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['apple', 'ipad', 'tablet', 'm2', 'retina'],
    specifications: {
      'Chip': 'Apple M2 chip',
      'Display': '11-inch Liquid Retina, 500 nits, P3 color',
      'Storage': '128 GB',
      'Weight': '462 grams'
    }
  },
  {
    title: 'Samsung Galaxy Tab S9 Ultra (12GB RAM, 256GB, Wi-Fi + 5G with S Pen)',
    slug: 'samsung-galaxy-tab-s9-ultra-5g-256gb',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Samsung',
    description: 'The ultimate giant canvas: 14.6-inch Dynamic AMOLED 2X 120Hz display, IP68 water & dust resistance on tablet and S Pen, Snapdragon 8 Gen 2 for Galaxy, and quad AKG stereo speakers.',
    highlights: [
      'Massive 14.6-inch Dynamic AMOLED 2X 120Hz Display',
      'IP68 Water & Dust Resistance (First on Galaxy Tab S series)',
      'Ultra-low latency S Pen included in the box',
      '11,200 mAh Long-Lasting Battery with 45W Fast Charging'
    ],
    mrp: 122999,
    price: 99999,
    stock: 12,
    sku: 'SAM-TABS9U-5G-256-GRF',
    images: [
      { url: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80', alt: 'Samsung Galaxy Tab S9 Ultra', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 620 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['samsung', 'tablet', 'tab-s9-ultra', 'amoled', 's-pen'],
    specifications: {
      'Screen Size': '14.6 inches (2960 x 1848)',
      'Processor': 'Snapdragon 8 Gen 2 for Galaxy',
      'Battery': '11200 mAh',
      'Audio': 'Quad Speakers tuned by AKG with Dolby Atmos'
    }
  },
  {
    title: 'Motorola Edge 50 Pro 5G with 125W TurboPower Charging (12GB/256GB)',
    slug: 'motorola-edge-50-pro-5g-12gb-256gb',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Motorola',
    description: 'World’s 1st Pantone validated display and camera! Features 144Hz 1.5K pOLED curved display, 50MP AI camera with 30x hybrid zoom, 125W wired TurboPower charging, and IP68 underwater protection.',
    highlights: [
      'World’s 1st Pantone Validated Curved 1.5K 144Hz Display',
      '125W TurboPower charging: 0 to 100% in 18 minutes',
      '50W Wireless Charging & 10W Reverse Wireless Charging',
      'IP68 Underwater Protection'
    ],
    mrp: 35999,
    price: 29999,
    stock: 35,
    sku: 'MOTO-EDGE50P-256-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', alt: 'Motorola Edge 50 Pro', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 2100 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['motorola', 'edge-50-pro', 'curved-display', '125w-charge', 'ip68'],
    specifications: {
      'Display': '6.7" 1.5K 144Hz 3D Curved pOLED',
      'Charging': '125W Wired + 50W Wireless',
      'Processor': 'Snapdragon 7 Gen 3',
      'Main Camera': '50MP f/1.4 with OIS'
    }
  },
  {
    title: 'Realme GT 6 5G (12GB RAM, 256GB, Fluid Silver)',
    slug: 'realme-gt-6-5g-12gb-256gb-silver',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Realme',
    description: 'Flagship killer with Snapdragon 8s Gen 3, world-record 6000 nits Ultra Bright Display, 50MP Sony LYT-808 OIS camera, and 120W SUPERVOOC charging with 5500 mAh battery.',
    highlights: [
      'Snapdragon 8s Gen 3 with Next-Gen AI features',
      'World Record 6000 nits 8T LTPO 120Hz Display',
      '50MP Sony LYT-808 Camera with OIS & 50MP 2X Telephoto',
      '5500 mAh Massive Battery with 120W GaN Fast Charger'
    ],
    mrp: 44999,
    price: 38999,
    stock: 25,
    sku: 'RLM-GT6-256-SLV',
    images: [
      { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', alt: 'Realme GT 6 5G', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 1740 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['realme', 'gt-6', 'snapdragon-8s-gen-3', 'flagship-killer', 'amoled'],
    specifications: {
      'Processor': 'Snapdragon 8s Gen 3 (4nm)',
      'Brightness': '6000 nits Peak',
      'Battery / Charger': '5500 mAh with 120W SUPERVOOC',
      'Cooling': '10014mm² Iceberg Vapor Chamber'
    }
  },
  {
    title: 'Xiaomi 14 Ultra 5G (16GB RAM, 512GB, Leica Quad Camera)',
    slug: 'xiaomi-14-ultra-5g-512gb-black',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Xiaomi',
    description: 'Pinnacle of mobile photography: Leica Quad 50MP Camera system with 1-inch Sony LYT-900 sensor and stepless variable aperture, Snapdragon 8 Gen 3, and Xiaomi Guardian Structure.',
    highlights: [
      'Leica All-Star 50MP Quad Camera with 1-inch LYT-900 sensor',
      'Stepless Variable Aperture from f/1.63 to f/4.0',
      'Snapdragon 8 Gen 3 processor with Dual-Channel IceLoop Cooling',
      '90W HyperCharge wired + 80W Wireless HyperCharge'
    ],
    mrp: 119999,
    price: 99999,
    stock: 8,
    sku: 'MI-14U-512-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', alt: 'Xiaomi 14 Ultra Leica Camera Phone', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 850 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['xiaomi', '14-ultra', 'leica', 'photography', 'flagship'],
    specifications: {
      'Sensor Size': '1-inch Sony LYT-900',
      'Display': '6.73" WQHD+ 120Hz AMOLED, 3000 nits',
      'RAM / ROM': '16GB LPDDR5X / 512GB UFS 4.0',
      'Protection': 'Xiaomi Shield Glass & IP68'
    }
  },

  // =========================================================================
  // LAPTOPS & GAMING COMPUTERS (Electronics) - 8 Products
  // =========================================================================
  {
    title: 'Apple MacBook Air M3 (13.6-inch, 16GB RAM, 512GB SSD, Midnight)',
    slug: 'apple-macbook-air-m3-13-inch-512gb-midnight',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Apple',
    description: 'Supercharged by Apple M3 chip with next-generation GPU and hardware-accelerated ray tracing. Liquid Retina display supports 1 billion colours. Up to 18 hours of battery life in a fanless, whisper-quiet design.',
    highlights: [
      'Apple M3 chip with 8-core CPU and 10-core GPU',
      '13.6-inch Liquid Retina display with 500 nits brightness',
      'Support for up to two external displays with laptop lid closed',
      'All-day 18-hour battery in a durable 100% recycled aluminium body'
    ],
    mrp: 134900,
    price: 119900,
    stock: 20,
    sku: 'APL-MBA-M3-16-512-MID',
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', alt: 'Apple MacBook Air M3', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', alt: 'MacBook Air open view' }
    ],
    ratings: { average: 4.9, count: 1120 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['apple', 'macbook', 'm3', 'laptop', 'thin-and-light'],
    specifications: {
      'Processor': 'Apple M3 chip',
      'Unified Memory': '16 GB',
      'Storage': '512 GB SSD',
      'Battery Life': 'Up to 18 Hours',
      'Weight': '1.24 kg'
    }
  },
  {
    title: 'ASUS ROG Zephyrus G14 Gaming Laptop (AMD Ryzen 9, RTX 4070, 32GB RAM)',
    slug: 'asus-rog-zephyrus-g14-gaming-laptop-rtx-4070',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'ASUS',
    description: 'Ultraportable gaming powerhouse featuring CNC machined unibody, ROG Nebula 3K 120Hz OLED display, AMD Ryzen 9 8945HS with AI, and NVIDIA GeForce RTX 4070 Laptop GPU.',
    highlights: [
      'ROG Nebula 3K 120Hz 0.2ms OLED display with 100% DCI-P3',
      'AMD Ryzen 9 8945HS Processor with Ryzen AI 16 TOPS',
      'NVIDIA GeForce RTX 4070 8GB GDDR6 (90W TGP)',
      'Ultra-thin 1.59cm CNC aluminium chassis weighing only 1.5kg'
    ],
    mrp: 199990,
    price: 174990,
    stock: 14,
    sku: 'ASUS-ROG-G14-RTX4070',
    images: [
      { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', alt: 'ASUS ROG Zephyrus G14', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 540 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['asus', 'rog', 'gaming-laptop', 'rtx4070', 'oled', 'zephyrus'],
    specifications: {
      'Graphics': 'NVIDIA GeForce RTX 4070 8GB',
      'Processor': 'AMD Ryzen 9 8945HS',
      'RAM / Storage': '32GB LPDDR5X / 1TB PCIe 4.0 SSD',
      'Display': '14-inch 3K (2880 x 1800) 120Hz OLED'
    }
  },
  {
    title: 'Dell XPS 15 9530 (13th Gen Intel Core i7, 32GB RAM, 1TB SSD, RTX 4050)',
    slug: 'dell-xps-15-intel-i7-32gb-1tb-rtx4050',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Dell',
    description: 'Master creative projects on the Dell XPS 15. Features a 15.6-inch 3.5K OLED InfinityEdge touchscreen, CNC machined aluminium with carbon fiber palm rest, and quad-speaker studio sound.',
    highlights: [
      '15.6-inch 3.5K (3456x2160) OLED InfinityEdge Touch Display',
      '13th Gen Intel Core i7-13700H (14 cores, up to 5.0 GHz)',
      'NVIDIA GeForce RTX 4050 6GB GDDR6 Graphics',
      'Machined Aluminium with aerospace carbon-fiber palm rest'
    ],
    mrp: 224990,
    price: 189990,
    stock: 9,
    sku: 'DELL-XPS15-I7-32GB',
    images: [
      { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80', alt: 'Dell XPS 15 Laptop', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 480 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['dell', 'xps', 'creator-laptop', 'oled', 'touchscreen', 'intel-i7'],
    specifications: {
      'Screen': '15.6" 3.5K OLED Touch',
      'RAM': '32GB DDR5 4800MHz',
      'Storage': '1TB M.2 PCIe NVMe SSD',
      'Battery': '86 Whr with Type-C 130W'
    }
  },
  {
    title: 'Lenovo Legion Pro 5i Gaming Laptop (Intel Core i7-14700HX, RTX 4060)',
    slug: 'lenovo-legion-pro-5i-i7-14700hx-rtx4060',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Lenovo',
    description: 'Crush competition with Lenovo AI Engine+ powered by LA1 AI Chip. Features 16-inch WQXGA 240Hz PureSight Gaming display, ColdFront 5.0 thermal technology, and TrueStrike keyboard.',
    highlights: [
      '14th Gen Intel Core i7-14700HX (20 cores, 28 threads)',
      'NVIDIA GeForce RTX 4060 8GB GDDR6 (140W Max TGP)',
      '16" WQXGA (2560x1600) 240Hz 500 nits 100% sRGB Display',
      'Legion ColdFront 5.0 Thermal Technology with dual fans'
    ],
    mrp: 169990,
    price: 139990,
    stock: 16,
    sku: 'LEN-LEGION5I-RTX4060',
    images: [
      { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', alt: 'Lenovo Legion Pro 5i', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 720 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['lenovo', 'legion', 'gaming', 'rtx4060', 'intel-14th-gen'],
    specifications: {
      'Graphics TGP': '140W Full Power RTX 4060',
      'Display': '16" 240Hz WQXGA, G-SYNC',
      'RAM': '16GB DDR5 5600MHz (Upgradable)',
      'Storage': '1TB PCIe 4.0 SSD'
    }
  },
  {
    title: 'HP Spectre x360 2-in-1 Laptop (Intel Core Ultra 7, 16GB, 1TB SSD, OLED)',
    slug: 'hp-spectre-x360-core-ultra-7-oled',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'HP',
    description: 'Transform how you create with 360-degree versatility, Intel Core Ultra 7 processor with dedicated NPU, 2.8K 120Hz IMAX Enhanced OLED touchscreen, and 9MP AI camera.',
    highlights: [
      'Intel Core Ultra 7 155H with Intel AI Boost NPU',
      '14-inch 2.8K 120Hz OLED Touchscreen with Corning Gorilla Glass NBT',
      '360-degree convertible hinge for Laptop, Tent, and Tablet modes',
      '9MP IR Camera with Auto Frame and Physical Privacy Shutter'
    ],
    mrp: 179999,
    price: 154999,
    stock: 11,
    sku: 'HP-SPECTRE-U7-OLED',
    images: [
      { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', alt: 'HP Spectre x360', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 390 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['hp', 'spectre', '2-in-1', 'convertible', 'oled', 'intel-core-ultra'],
    specifications: {
      'Processor': 'Intel Core Ultra 7 155H (16 Cores)',
      'Display': '14" 2.8K (2880 x 1800) OLED 120Hz Touch',
      'RAM / SSD': '16GB LPDDR5x / 1TB PCIe Gen4 SSD',
      'Weight': '1.44 kg'
    }
  },
  {
    title: 'Sony PlayStation 5 Slim Digital Edition Console (1TB SSD)',
    slug: 'playstation-5-slim-digital-edition-1tb',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Sony',
    description: 'PlayStation 5 Slim unleashes new gaming possibilities. Experience lightning-fast loading with an ultra-high speed 1TB SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
    highlights: [
      'Slimmer design with upgraded 1TB High-Speed NVMe SSD',
      'Ray Tracing, 4K-TV Gaming, and up to 120 fps with 120Hz output',
      'Tempest 3D AudioTech and HDR Technology support',
      'DualSense Wireless Controller with Haptic Feedback included'
    ],
    mrp: 44990,
    price: 39990,
    stock: 22,
    sku: 'SONY-PS5-SLIM-DIG-1TB',
    images: [
      { url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80', alt: 'Sony PlayStation 5 Console', isPrimary: true }
    ],
    ratings: { average: 4.9, count: 4800 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['sony', 'ps5', 'playstation', 'gaming-console', 'dualsense'],
    specifications: {
      'Internal Storage': '1TB Custom NVMe SSD',
      'Video Output': 'Supports 4K 120Hz TVs, 8K TVs, VRR',
      'Audio': 'Tempest 3D AudioTech',
      'Included': 'PS5 Slim console, DualSense wireless controller, HDMI cable'
    }
  },
  {
    title: 'Nintendo Switch – OLED Model with White Joy-Con',
    slug: 'nintendo-switch-oled-model-white',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Nintendo',
    description: 'Featuring a vibrant 7-inch OLED screen, a wide adjustable stand for tabletop mode, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio in handheld and tabletop modes.',
    highlights: [
      'Vibrant 7-inch OLED Screen with deep blacks and rich colors',
      'Wide, adjustable stand for comfortable tabletop gaming',
      'Wired LAN port built into the TV dock',
      '64GB internal storage expandable via MicroSD'
    ],
    mrp: 34999,
    price: 28999,
    stock: 18,
    sku: 'NINT-SWITCH-OLED-WHT',
    images: [
      { url: 'https://images.unsplash.com/photo-1578303512597-8be9abb94711?w=800&q=80', alt: 'Nintendo Switch OLED Model', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 3200 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['nintendo', 'switch', 'oled', 'portable-console', 'joycon'],
    specifications: {
      'Screen': '7.0-inch OLED multi-touch screen',
      'Battery Life': 'Approx. 4.5 to 9 hours',
      'Internal Storage': '64 GB',
      'Modes': 'TV Mode, Tabletop Mode, Handheld Mode'
    }
  },
  {
    title: 'Razer DeathAdder V3 Pro Ultra-Lightweight Wireless Gaming Mouse',
    slug: 'razer-deathadder-v3-pro-wireless-mouse',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Razer',
    description: 'Victory takes shape with the Razer DeathAdder V3 Pro. Refined with the aid of top esports pros, its iconic ergonomic form is now more than 25% lighter, backed by industry-leading optical switches.',
    highlights: [
      'Ultra-lightweight 63g design for supreme speed and control',
      'Focus Pro 30K Optical Sensor with 99.8% resolution accuracy',
      'Gen-3 Optical Mouse Switches rated for 90 million clicks',
      'Up to 90 hours of battery life on single USB-C charge'
    ],
    mrp: 14999,
    price: 11499,
    stock: 25,
    sku: 'RZR-DAV3-PRO-WHT',
    images: [
      { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80', alt: 'Razer DeathAdder V3 Pro Mouse', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 1280 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['razer', 'mouse', 'gaming', 'esports', 'deathadder', 'wireless'],
    specifications: {
      'Weight': '63 grams',
      'DPI': '30,000 Focus Pro Sensor',
      'Battery': 'Up to 90 Hours',
      'Switches': 'Optical Gen-3 (0.2ms actuation)'
    }
  },

  // =========================================================================
  // SMART WATCHES & WEARABLES (Electronics) - 8 Products
  // =========================================================================
  {
    title: 'Apple Watch Series 10 GPS (46mm, Jet Black Aluminium Case)',
    slug: 'apple-watch-series-10-gps-46mm-jet-black',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Apple',
    description: 'Thinnest Apple Watch ever with our biggest display. Breakthrough health insights including Sleep Apnoea notifications, faster charging, and depth & water temperature sensors.',
    highlights: [
      'Up to 30% more active screen area on Wide-angle OLED display',
      'S10 SiP with 4-core Neural Engine and on-device Siri',
      'Sleep Apnoea notifications, ECG app, Blood Oxygen insights',
      'Fast charge to 80% in about 30 minutes'
    ],
    mrp: 49900,
    price: 45900,
    stock: 20,
    sku: 'APL-WATCH-S10-46-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Apple Watch Series 10', isPrimary: true }
    ],
    ratings: { average: 4.9, count: 980 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['apple', 'apple-watch', 'series-10', 'smartwatch', 'fitness', 'oled'],
    specifications: {
      'Case Size': '46 mm',
      'Display': 'Wide-angle OLED, up to 2000 nits',
      'Water Resistance': '50 meters (Swimproof)',
      'Battery': '18 hours normal use, 36 hours Low Power'
    }
  },
  {
    title: 'Samsung Galaxy Watch6 Classic (47mm, Bluetooth, Rotating Bezel)',
    slug: 'samsung-galaxy-watch6-classic-47mm-silver',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Samsung',
    description: 'Classic rotating bezel design meets cutting-edge wellness tracker. Sapphire crystal glass, advanced sleep coaching, body composition BIA analysis, and heart rate monitoring.',
    highlights: [
      'Signature Physical Rotating Bezel for intuitive navigation',
      'Sapphire Crystal glass display with IP68 & 5ATM water resistance',
      'Advanced Sleep Coaching with sleep animal profiles',
      'BioActive Sensor: BIA Body Composition, ECG & BP tracking'
    ],
    mrp: 36999,
    price: 27999,
    stock: 18,
    sku: 'SAM-WATCH6C-47-SLV',
    images: [
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', alt: 'Samsung Galaxy Watch6 Classic', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 1420 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['samsung', 'smartwatch', 'galaxy-watch6', 'rotating-bezel', 'sapphire'],
    specifications: {
      'Size': '47 mm Stainless Steel',
      'Display': '1.5-inch Super AMOLED 480x480',
      'OS': 'Wear OS powered by Samsung',
      'Battery': '425 mAh with WPC wireless charging'
    }
  },
  {
    title: 'Noise ColorFit Pro 5 Smart Watch with 1.85" AMOLED Display',
    slug: 'noise-colorfit-pro-5-smartwatch-amoled',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Noise',
    description: 'Noise ColorFit Pro 5 features a crisp 1.85" AMOLED display, SOS emergency feature, dynamic emoji support, Bluetooth calling with Tru Sync, and 100+ sports modes.',
    highlights: [
      '1.85" AMOLED Display with 600 nits brightness and Always-On',
      'Tru Sync Bluetooth Calling with quick dial pad & contact storage',
      'SOS Technology for emergency calling from your wrist',
      '7-Day Battery Life with IP68 Water Resistance'
    ],
    mrp: 8999,
    price: 3499,
    stock: 45,
    sku: 'NOISE-CFP5-JET-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Noise ColorFit Pro 5', isPrimary: true }
    ],
    ratings: { average: 4.4, count: 4890 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['noise', 'smartwatch', 'amoled', 'calling', 'budget'],
    specifications: {
      'Screen Size': '1.85" AMOLED',
      'Battery': 'Up to 7 Days',
      'Water Resistance': 'IP68',
      'Sports Modes': '100+'
    }
  },
  {
    title: 'boAt Wave Call 2 Smart Watch with Bluetooth Calling & 1.83" HD Display',
    slug: 'boat-wave-call-2-smartwatch',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'boAt',
    description: 'Stay connected on the move with boAt Wave Call 2 featuring high-definition Bluetooth calling, 700+ active modes, custom DIY watch face studio, and heart rate & SpO2 tracking.',
    highlights: [
      '1.83" HD Display with 550 nits peak brightness',
      'Seamless Bluetooth Calling with noise-suppressed mic',
      '700+ Active Workout Modes via boAt Crest App',
      'Live Cricket Scores directly on your smartwatch screen'
    ],
    mrp: 6990,
    price: 1299,
    stock: 65,
    sku: 'BOAT-WAVECALL2-CHERRY',
    images: [
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', alt: 'boAt Wave Call 2', isPrimary: true }
    ],
    ratings: { average: 4.3, count: 6200 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['boat', 'smartwatch', 'wave-call', 'budget', 'calling'],
    specifications: {
      'Display': '1.83" HD (240x284)',
      'Battery': 'Up to 5 Days (2 Days with Calling)',
      'Waterproof': 'IP67',
      'Cricket Scores': 'Yes'
    }
  },
  {
    title: 'Fastrack Limitless FS1 Pro Smart Watch with 1.96" Super AMOLED Display',
    slug: 'fastrack-limitless-fs1-pro-amoled-smartwatch',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Fastrack',
    description: 'India’s largest 1.96" Super AMOLED arched display with 410x502 resolution, Always-On Display, SingleSync Bluetooth calling with NitroFast charging, and 110+ sports modes.',
    highlights: [
      '1.96" Super AMOLED Arched Curved Display (410x502 high-res)',
      'SingleSync BT Calling with advanced chipset',
      'NitroFast Charging: 10 mins charge lasts a full day',
      '110+ Sports Modes & 200+ Cloud Watch Faces'
    ],
    mrp: 7995,
    price: 2499,
    stock: 38,
    sku: 'FT-FS1PRO-TEAL',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Fastrack Limitless FS1 Pro', isPrimary: true }
    ],
    ratings: { average: 4.4, count: 3100 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['fastrack', 'smartwatch', 'amoled', 'arched-display', 'titan'],
    specifications: {
      'Screen': '1.96" Super AMOLED Arched',
      'Resolution': '410 x 502 Pixels',
      'Charging': 'NitroFast 10 mins for 24h',
      'Protection': 'IP68 Water Resistant'
    }
  },
  {
    title: 'Amazfit GTR 4 Smart Watch with Dual-Band GPS & 14-Day Battery',
    slug: 'amazfit-gtr-4-smartwatch-dual-gps',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Amazfit',
    description: 'Precision dual-band circularly polarized GPS tracking, 150+ sports modes with smart recognition, 1.43" HD AMOLED display with anti-glare glass bezel, and massive 14-day battery.',
    highlights: [
      'Industry-first Dual-band Circularly-Polarized GPS Antenna',
      'Ultra-long 14-Day Battery Life on typical usage',
      '1.43" Large HD AMOLED with Anti-glare Glass Bezel',
      'Store & Play Music directly from watch (2.3GB local storage)'
    ],
    mrp: 23999,
    price: 16999,
    stock: 15,
    sku: 'AMZ-GTR4-RETRO-BRN',
    images: [
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', alt: 'Amazfit GTR 4 Classic', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 1850 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['amazfit', 'gtr-4', 'gps', 'fitness-watch', 'battery-champ'],
    specifications: {
      'GPS': 'Dual-band 6 Satellite Positioning',
      'Battery': '14 Days Typical Use (475 mAh)',
      'Display': '1.43" AMOLED (326 ppi)',
      'Water Resistance': '5 ATM (50m)'
    }
  },
  {
    title: 'Garmin Forerunner 265 Running GPS Smartwatch with AMOLED Display',
    slug: 'garmin-forerunner-265-running-smartwatch',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Garmin',
    description: 'Train brilliantly with bright AMOLED touchscreen display, training readiness score, morning report, Garmin Coach adaptive training plans, wrist-based running dynamics, and multi-band GPS.',
    highlights: [
      'Vibrant 1.3" AMOLED Touchscreen with traditional 5-button control',
      'Training Readiness score tells you if today is prime for a hard workout',
      'Up to 13 days of battery life in smartwatch mode (20 hours in GPS mode)',
      'Multi-Band GNSS with SatIQ technology for superior accuracy'
    ],
    mrp: 50490,
    price: 43990,
    stock: 10,
    sku: 'GAR-FR265-BLK-AQUA',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Garmin Forerunner 265', isPrimary: true }
    ],
    ratings: { average: 4.9, count: 410 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['garmin', 'running', 'triathlon', 'marathon', 'gps', 'amoled'],
    specifications: {
      'Display': '1.3" AMOLED (416 x 416)',
      'Battery Life': 'Up to 13 Days Smartwatch, 20 Hours GPS',
      'Water Rating': '5 ATM',
      'Weight': '47 grams'
    }
  },
  {
    title: 'Titan Smart Pro Smartwatch with Body Temperature & AMOLED Display',
    slug: 'titan-smart-pro-smartwatch-amoled',
    categorySlug: 'electronics',
    sellerSlug: 'techhaven-electronics',
    brand: 'Titan',
    description: 'Elevate your wrist with Titan craftsmanship: premium aluminum body, 1.32" AMOLED display, built-in GPS, continuous heart rate, SpO2, stress, and body temperature sensor.',
    highlights: [
      '1.32" AMOLED Display with 360x360 resolution',
      'Built-in GPS for accurate distance tracking without phone',
      'Body Temperature, Heart Rate, SpO2, and Stress Monitoring',
      'Up to 14 Days Battery Life on standard mode'
    ],
    mrp: 14995,
    price: 7995,
    stock: 22,
    sku: 'TITAN-SMARTPRO-BLU',
    images: [
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', alt: 'Titan Smart Pro Blue', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 1220 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['titan', 'smart-pro', 'amoled', 'gps', 'premium-watch'],
    specifications: {
      'Body Material': 'Aviation-grade Aluminium',
      'Display': '1.32" AMOLED',
      'Battery': '14 Days',
      'Warranty': '1 Year Titan Warranty'
    }
  },

  // =========================================================================
  // FASHION & FOOTWEAR - MEN & WOMEN (Fashion) - 10 Products
  // =========================================================================
  {
    title: 'Nike Air Jordan 1 Low Retro Men’s Casual Sneakers',
    slug: 'nike-air-jordan-1-low-retro-sneakers',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'Nike',
    description: 'Inspired by the original 1985 silhouette, the Air Jordan 1 Low offers a clean, classic look in an iconic package. Premium leather upper, encapsulated Air-Sole unit, and solid rubber outsole.',
    highlights: [
      'Genuine leather upper provides premium durability and structured feel',
      'Encapsulated Air-Sole unit cushions every single stride',
      'Solid rubber outsole with deep flex grooves gives traction on varied surfaces',
      'Iconic Wings logo on heel and stitched Swoosh design'
    ],
    mrp: 9995,
    price: 8495,
    stock: 28,
    sku: 'NIKE-AJ1-LOW-WHTRED',
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', alt: 'Nike Air Jordan 1 Low Sneakers', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80', alt: 'Sneakers top view' }
    ],
    ratings: { average: 4.9, count: 3400 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['nike', 'jordan', 'sneakers', 'retro', 'streetwear', 'shoes'],
    specifications: {
      'Sole Material': 'Rubber with Air-Sole Unit',
      'Outer Material': 'Genuine Leather',
      'Closure': 'Lace-Up',
      'Ideal For': 'Men'
    }
  },
  {
    title: 'Puma Velocity Nitro 3 Men’s Daily Running Shoes',
    slug: 'puma-velocity-nitro-3-running-shoes',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'Puma',
    description: 'Your go-to daily trainer. Velocity Nitro 3 combines NITRO FOAM technology for explosive responsiveness with PUMAGRIP durable rubber compound for all-surface traction.',
    highlights: [
      'NITRO FOAM: Advanced nitrogen-injected foam for superior bounce',
      'PUMAGRIP: High-performance rubber for maximum grip on wet & dry roads',
      'Engineered mesh upper for breathable comfort during long runs',
      'TPU heel spoiler for enhanced foot stability'
    ],
    mrp: 11999,
    price: 6999,
    stock: 35,
    sku: 'PUMA-VELO-N3-ORG',
    images: [
      { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', alt: 'Puma Velocity Nitro 3', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 1820 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['puma', 'running-shoes', 'nitro', 'marathon', 'sportswear'],
    specifications: {
      'Cushioning': 'NITRO Foam',
      'Drop': '10 mm',
      'Weight': '264g',
      'Terrain': 'Road Running'
    }
  },
  {
    title: 'Adidas Ultraboost Light Running Shoes',
    slug: 'adidas-ultraboost-light-running-shoes',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'Adidas',
    description: 'Experience epic energy with the lightest Ultraboost ever made. Featuring Light BOOST midsole foam, PRIMEKNIT+ textile upper, and Continental Better Rubber outsole.',
    highlights: [
      'Light BOOST Midsole: 30% lighter BOOST material with maximum energy return',
      'Linear Energy Push (LEP) system for snappy push-off',
      'Continental Rubber outsole provides extraordinary traction in wet/dry conditions',
      'Upper yarn contains at least 50% Parley Ocean Plastic'
    ],
    mrp: 18999,
    price: 12999,
    stock: 20,
    sku: 'ADI-UB-LIGHT-COREBLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80', alt: 'Adidas Ultraboost Light', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 2100 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['adidas', 'ultraboost', 'boost', 'sneakers', 'running'],
    specifications: {
      'Midsole': 'Light BOOST',
      'Upper': 'PRIMEKNIT+',
      'Outsole': 'Continental Rubber',
      'Drop': '10 mm'
    }
  },
  {
    title: 'Levi’s 511 Slim Fit Stretchable Denim Jeans (Dark Indigo)',
    slug: 'levis-511-slim-fit-stretch-jeans-indigo',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: "Levi's",
    description: 'A modern slim with room to move. The 511 Slim Fit Stretch Jeans are a classic since right now. Cut close through the thigh with a slim leg opening for everyday clean styling.',
    highlights: [
      'Iconic 511 Slim cut: Sits below waist, slim from hip to ankle',
      'Levi’s Flex advanced stretch technology for maximum flex & comfort',
      'Authentic 5-pocket styling with signature Arcuate back pocket stitching',
      '99% Cotton, 1% Elastane premium denim fabric'
    ],
    mrp: 4199,
    price: 2499,
    stock: 50,
    sku: 'LEV-511-IND-32',
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80', alt: "Levi's 511 Slim Fit Jeans", isPrimary: true }
    ],
    ratings: { average: 4.6, count: 5200 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['levis', 'jeans', 'denim', '511', 'slim-fit', 'menswear'],
    specifications: {
      'Fit': 'Slim Fit',
      'Fabric': '99% Cotton, 1% Elastane',
      'Wash': 'Dark Wash Enzyme Rinse',
      'Rise': 'Mid Rise'
    }
  },
  {
    title: 'Allen Solly Men’s 100% Cotton Slim Fit Formal Shirt (Sky Blue)',
    slug: 'allen-solly-mens-slim-fit-cotton-formal-shirt',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'Allen Solly',
    description: 'Exude effortless elegance at work and formal occasions with this 100% premium combed cotton slim fit shirt from Allen Solly featuring semi-cutaway collar and buttoned cuffs.',
    highlights: [
      '100% Breathable Combed Cotton with smooth lustrous finish',
      'Tailored Slim Fit contouring chest and waist gracefully',
      'Semi-Cutaway Collar with crisp fused interlining',
      'Color-fast fabric suitable for machine washing'
    ],
    mrp: 2299,
    price: 1199,
    stock: 45,
    sku: 'AS-SHIRT-SKYBLU-40',
    images: [
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', alt: 'Allen Solly Sky Blue Shirt', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 2800 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['allen-solly', 'formal-shirt', 'cotton', 'office-wear', 'fashion'],
    specifications: {
      'Material': '100% Combed Cotton',
      'Fit': 'Slim Fit',
      'Collar': 'Semi-Cutaway',
      'Sleeve': 'Full Sleeve'
    }
  },
  {
    title: 'Zara Premium Pure Linen Blend Overshirt (Beige Khaki)',
    slug: 'zara-pure-linen-blend-overshirt-beige',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'Zara',
    description: 'Relaxed fit overshirt crafted from a textured linen and cotton blend. Features lapel collar, button-up front, chest patch pockets with flaps, and long sleeves with button cuffs.',
    highlights: [
      '55% European Linen, 45% Cotton for breezy summer drape',
      'Dual chest utility pockets with flap closure',
      'Relaxed boxy silhouette perfect for layered styling',
      'Eco-washed fabric with soft pre-shrunk texture'
    ],
    mrp: 4990,
    price: 3590,
    stock: 22,
    sku: 'ZARA-LINEN-OVERSHIRT-M',
    images: [
      { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80', alt: 'Zara Linen Overshirt', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 890 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['zara', 'linen', 'overshirt', 'summer', 'streetwear'],
    specifications: {
      'Fabric': '55% Linen, 45% Cotton',
      'Care': 'Machine wash at 30°C delicate',
      'Fit': 'Relaxed Fit'
    }
  },
  {
    title: 'FabIndia Pure Cotton Hand-Block Print Men’s Long Kurta',
    slug: 'fabindia-cotton-hand-block-print-kurta',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'FabIndia',
    description: 'Celebrate festive traditions in comfort with FabIndia’s artisan-crafted long kurta. Made from breathable handspun cotton featuring exquisite Bagru wooden block print patterns.',
    highlights: [
      'Crafted from 100% Pure Artisan Handwoven Cotton',
      'Authentic Rajasthani Woodblock Print using natural azo-free dyes',
      'Mandarin collar with subtle 3-button placket and side slits',
      'Includes two concealed side pockets'
    ],
    mrp: 2990,
    price: 1890,
    stock: 32,
    sku: 'FAB-KURTA-BLKPRINT-L',
    images: [
      { url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80', alt: 'FabIndia Cotton Long Kurta', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 1450 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['fabindia', 'kurta', 'ethnic', 'cotton', 'traditional', 'handblock'],
    specifications: {
      'Craft': 'Hand Block Print',
      'Material': '100% Cotton',
      'Length': 'Mid Calf Knee Length',
      'Collar': 'Mandarin Band Collar'
    }
  },
  {
    title: 'Ray-Ban Classic Aviator Sunglasses (Polarized Green Classic G-15)',
    slug: 'ray-ban-classic-aviator-polarized-sunglasses',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'Ray-Ban',
    description: 'Originally designed for US aviators in 1937, the Ray-Ban Aviator Classic is timeless. Gold metal frame combined with crystal green polarized lenses offering 100% UV protection.',
    highlights: [
      'Polarized Crystal Green G-15 lenses block 99% of reflected glare',
      'High optical clarity with 100% UV400 radiation protection',
      'Lightweight high-tensile gold metal monel frame with silicone nose pads',
      'Includes original leather protective case and microfiber cloth'
    ],
    mrp: 11590,
    price: 8990,
    stock: 18,
    sku: 'RB-AVIATOR-3025-GLD',
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', alt: 'Ray-Ban Aviator Sunglasses', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 2600 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['ray-ban', 'aviator', 'sunglasses', 'polarized', 'eyewear'],
    specifications: {
      'Frame Material': 'Gold Monel Metal',
      'Lens Color': 'Polarized Green Classic G-15',
      'UV Protection': 'UV400 (100% UVA & UVB)',
      'Bridge Size': '14 mm'
    }
  },
  {
    title: 'Fossil Neutra Chronograph Brown Leather Men’s Watch',
    slug: 'fossil-neutra-chronograph-brown-leather-watch',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'Fossil',
    description: 'Inspired by mid-century architecture, the Fossil Neutra watch features balanced proportions with a minimalist navy dial, stopwatch chronograph sub-eyes, and amber brown leather strap.',
    highlights: [
      '44mm Stainless Steel Case with striking Sunray Blue dial',
      'Chronograph movement with 3 sub-dials and date window',
      'Genuine 22mm interchangeable brown leather strap with buckle',
      '50m (5 ATM) Water Resistance against splashes and rain'
    ],
    mrp: 13495,
    price: 8995,
    stock: 24,
    sku: 'FOS-NEUTRA-FS5380',
    images: [
      { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80', alt: 'Fossil Neutra Chronograph Watch', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 1890 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['fossil', 'chronograph', 'leather-watch', 'mens-watch', 'accessories'],
    specifications: {
      'Case Diameter': '44 mm',
      'Movement': 'Quartz Chronograph',
      'Strap Material': '100% Genuine Leather',
      'Water Resistance': '50 Meters'
    }
  },
  {
    title: 'Woodland Men’s Camel Nubuck Leather Outdoor Trekking Boots',
    slug: 'woodland-camel-nubuck-leather-trekking-boots',
    categorySlug: 'fashion',
    sellerSlug: 'urbantrends-apparel',
    brand: 'Woodland',
    description: 'Engineered for extreme trails and rough terrain. Crafted from heavy-duty camel nubuck leather with deeply lugged TPR outsole for unmatched rock and mud grip.',
    highlights: [
      'Heavy-duty genuine Nubuck leather with waterproof oiled finish',
      'Deep cleated rubber outsole for rock-solid stability on wet trails',
      'Padded leather collar and tongue prevent chafing on long treks',
      'Rust-proof metal hexagonal eyelets with reinforced nylon laces'
    ],
    mrp: 5995,
    price: 4195,
    stock: 26,
    sku: 'WOOD-BOOTS-CAMEL-42',
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', alt: 'Woodland Leather Boots', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 3750 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['woodland', 'boots', 'trekking', 'leather', 'outdoor', 'shoes'],
    specifications: {
      'Material': 'Genuine Nubuck Leather',
      'Sole': 'Heavy-Duty Cleated TPR',
      'Ankle Height': 'High-Top',
      'Ideal For': 'Trekking, Hiking, Rough Terrain'
    }
  },

  // =========================================================================
  // HOME & KITCHEN APPLIANCES (Home & Kitchen) - 10 Products
  // =========================================================================
  {
    title: 'Philips Digital Air Fryer XL (4.1 Litre, Rapid Air Technology)',
    slug: 'philips-digital-air-fryer-xl-4-1l',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Philips',
    description: 'Enjoy delicious food with up to 90% less fat! Philips Rapid Air Technology circulates hot air around the starfish pan design to create crispy fried food with little or no oil.',
    highlights: [
      'Rapid Air Technology cooks with up to 90% less added fat',
      '4.1 Litre Basket capacity feeds up to 4 people with ease',
      'Touchscreen with 7 preset cooking modes (Frozen snacks, Fries, Meat, Cake)',
      'Keep Warm mode maintains temperature for 30 minutes'
    ],
    mrp: 12995,
    price: 7999,
    stock: 35,
    sku: 'PHIL-AIRFRYER-HD9252',
    images: [
      { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', alt: 'Philips Digital Air Fryer', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 6400 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['philips', 'air-fryer', 'kitchen', 'healthy', 'appliances'],
    specifications: {
      'Capacity': '4.1 Litres',
      'Power': '1400 Watts',
      'Presets': '7 One-touch cooking menus',
      'Warranty': '2 Years Global Philips Warranty'
    }
  },
  {
    title: 'Prestige Iris 750 Watt Mixer Grinder with 3 Stainless Steel Jars',
    slug: 'prestige-iris-750-watt-mixer-grinder',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Prestige',
    description: 'Heavy duty 750W motor delivers efficient grinding of tough Indian spices, dosa batter, and chutneys. Features 3 stainless steel jars with flow breakers and a transparent juicer jar.',
    highlights: [
      'Powerful 750 Watts motor with overload safety protection',
      '3 Stainless Steel Jars: Wet Grinding (1.5L), Dry Grinding (1.0L), Chutney (300ml)',
      'Transparent 1.5L Juicer jar with sieve for fresh juices',
      'Ergonomic jar handles and sturdy non-slip rubber feet'
    ],
    mrp: 6195,
    price: 3299,
    stock: 50,
    sku: 'PRES-IRIS-750W-MIX',
    images: [
      { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', alt: 'Prestige Iris Mixer Grinder', isPrimary: true }
    ],
    ratings: { average: 4.4, count: 8900 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['prestige', 'mixer-grinder', 'kitchen', 'grinding', 'home-appliances'],
    specifications: {
      'Wattage': '750 Watts',
      'Speed': '3 Speed Control with Incher Pulse',
      'Jars': '4 Jars (3 SS + 1 Juicer)',
      'Warranty': '2 Years Prestige Warranty'
    }
  },
  {
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker (6 Litre)',
    slug: 'instant-pot-duo-7-in-1-electric-pressure-cooker-6l',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Instant Pot',
    description: 'Replaces 7 kitchen appliances: Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and food warmer. Cook healthy meals up to 70% faster with 13 smart programs.',
    highlights: [
      '7-in-1 Multifunctionality: Pressure cook, slow cook, sauté, steam, make yogurt',
      'Cooks up to 70% faster while preserving nutrients and natural flavor',
      'Food-grade 304 (18/8) Stainless Steel inner cooking pot with tri-ply bottom',
      '10+ Proven Safety Mechanisms including overheat protection and safety lid lock'
    ],
    mrp: 14990,
    price: 9499,
    stock: 20,
    sku: 'INST-POT-DUO-6L',
    images: [
      { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', alt: 'Instant Pot Duo 6L', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 4200 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['instant-pot', 'pressure-cooker', 'smart-cooker', 'multicooker'],
    specifications: {
      'Capacity': '6 Litres (Serves 6 people)',
      'Power': '1000 Watts',
      'Inner Pot': '304 Stainless Steel (Dishwasher Safe)',
      'Programs': '13 One-Touch Smart Programs'
    }
  },
  {
    title: 'Dyson V12 Detect Slim Total Clean Cordless Vacuum Cleaner',
    slug: 'dyson-v12-detect-slim-cordless-vacuum',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Dyson',
    description: 'Dyson’s lightest intelligent cordless vacuum with laser illumination. Laser reveals invisible microscopic dust on hard floors. Piezo sensor continuously sizes and counts dust particles.',
    highlights: [
      'Laser reveals microscopic dust invisible to the naked human eye',
      'Piezo sensor automatically increases suction power when higher dust is detected',
      'LCD screen calculates and displays particle count as proof of deep clean',
      'Up to 60 minutes of run time with click-in swappable battery'
    ],
    mrp: 65900,
    price: 52900,
    stock: 12,
    sku: 'DYS-V12-SLIM-YLW',
    images: [
      { url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80', alt: 'Dyson V12 Cordless Vacuum', isPrimary: true }
    ],
    ratings: { average: 4.9, count: 1100 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['dyson', 'vacuum', 'cleaning', 'cordless', 'laser', 'home'],
    specifications: {
      'Weight': '2.2 kg (Ultra lightweight)',
      'Suction Power': '150 Air Watts',
      'Bin Volume': '0.35 Litres',
      'Run Time': 'Up to 60 Minutes'
    }
  },
  {
    title: 'Nespresso Essenza Mini Espresso Coffee Machine (Piano Black)',
    slug: 'nespresso-essenza-mini-espresso-machine',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Nespresso',
    description: 'Compact size with huge coffee flavor. 19-bar high pressure pump creates barista-style espresso with thick velvety crema. Two programmable cup sizes for Espresso and Lungo.',
    highlights: [
      '19-bar High Pressure Pump extracts the delicate flavor and premium aromas',
      'Ultra-compact footprint fits seamlessly into any modern kitchen or desk',
      'Fast 25-second heat-up time with Eco mode energy saving after 3 mins',
      '2 Programmable coffee buttons: Espresso (40ml) & Lungo (110ml)'
    ],
    mrp: 19999,
    price: 14999,
    stock: 16,
    sku: 'NESP-ESSENZA-MINI-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80', alt: 'Nespresso Essenza Mini', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 1890 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['nespresso', 'coffee', 'espresso', 'kitchen', 'cappuccino'],
    specifications: {
      'Pressure': '19 Bar',
      'Water Tank': '0.6 Litres',
      'Heat-up Time': '25 Seconds',
      'Weight': '2.3 kg'
    }
  },
  {
    title: 'LG 32 Litre All-in-One Charcoal Convection Microwave Oven',
    slug: 'lg-32-litre-charcoal-convection-microwave',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'LG',
    description: 'Recreate traditional charcoal tandoori dishes at home! Features Charcoal Lighting Heater, 301 Auto Cook menus, Diet Fry technology for guilt-free snacks, and motorized 360 rotisserie.',
    highlights: [
      'Charcoal Lighting Heater delivers authentic crunchy exterior and juicy interior',
      'Diet Fry technology lets you prepare crispy samosas with 88% less oil',
      '301 Indian Auto Cook Menu presets including paneer tikka & tandoori chicken',
      'Stainless Steel Cavity for hygienic and even heat distribution'
    ],
    mrp: 29990,
    price: 21490,
    stock: 18,
    sku: 'LG-MICROWAVE-32L-CHAR',
    images: [
      { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', alt: 'LG Charcoal Convection Microwave', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 2300 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['lg', 'microwave', 'convection', 'charcoal', 'kitchen'],
    specifications: {
      'Capacity': '32 Litres',
      'Cooking Features': 'Charcoal, Diet Fry, Indian Roti Basket, Tandoor',
      'Cavity': 'Stainless Steel',
      'Warranty': '1 Year on Product, 5 Years on Magnetron'
    }
  },
  {
    title: 'Kent Grand Plus RO + UV + UF + TDS Water Purifier (9 Litre)',
    slug: 'kent-grand-plus-ro-water-purifier-9l',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Kent',
    description: 'India’s most trusted water purifier. Uses multi-stage RO+UV+UF+TDS control purification to remove dissolved impurities like arsenic, rust, pesticides, while retaining essential minerals.',
    highlights: [
      'Multiple purification by RO+UV+UF+Alkaline+TDS Control process',
      'In-tank UV LED keeps stored purified water pure and bacteria-free',
      'Zero Water Wastage Technology recirculates rejected water to overhead tank',
      'High purification capacity of 20 Litres per hour with 9L storage tank'
    ],
    mrp: 21500,
    price: 15999,
    stock: 25,
    sku: 'KENT-GRANDPLUS-RO-9L',
    images: [
      { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', alt: 'Kent Grand Plus RO Purifier', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 5400 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['kent', 'water-purifier', 'ro', 'health', 'drinking-water'],
    specifications: {
      'Purification Capacity': '20 L/hr',
      'Storage Tank': '9 Litres',
      'Technology': 'RO + UV + UF + Alkaline + TDS Control',
      'Warranty': '1 Year Warranty + 3 Years Free Service'
    }
  },
  {
    title: 'Milton Thermosteel Flip Lid Insulated Flask Bottle (1000 ml)',
    slug: 'milton-thermosteel-flask-bottle-1000ml',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Milton',
    description: 'Keep beverages piping hot or icy cold for 24 hours. Double-walled vacuum insulation made with 100% rust-free 304 food-grade stainless steel with leak-proof flip lid.',
    highlights: [
      'Double-walled vacuum insulation keeps liquids Hot or Cold for 24 hours',
      'Crafted from 100% food-grade 304 stainless steel interior and exterior',
      'Spill-proof threaded flip lid with jacket carrying pouch included',
      'BPA-free, non-toxic, and retains freshness without metallic taste'
    ],
    mrp: 1295,
    price: 849,
    stock: 80,
    sku: 'MILT-FLASK-1000-SS',
    images: [
      { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', alt: 'Milton Thermosteel 1000ml Flask', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 12400 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['milton', 'flask', 'thermosteel', 'water-bottle', 'kitchen'],
    specifications: {
      'Capacity': '1000 ml',
      'Insulation': '24 Hours Hot / Cold',
      'Material': 'Grade 304 Stainless Steel',
      'Leakproof': 'Yes'
    }
  },
  {
    title: 'Pigeon by Stovekraft Cruise 1800-Watt Induction Cooktop',
    slug: 'pigeon-cruise-1800w-induction-cooktop',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Pigeon',
    description: 'Fast, energy-efficient cooking with 1800W induction element. Features microcrystal plate, 7 Indian preset menus (Pressure Cook, Milk, Roti, Dosa), and LED temperature display.',
    highlights: [
      '1800 Watts high-speed induction heating saves up to 50% gas fuel',
      '7 Preset Indian Cooking Menus for automatic temperature modulation',
      'Dual heat sensor with auto-shut off prevents boiling overflow and dry heating',
      'Durable microcrystal top plate is easy to wipe clean'
    ],
    mrp: 3195,
    price: 1499,
    stock: 60,
    sku: 'PIG-CRUISE-1800W-IND',
    images: [
      { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', alt: 'Pigeon Cruise Induction Cooktop', isPrimary: true }
    ],
    ratings: { average: 4.3, count: 7800 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['pigeon', 'induction', 'cooktop', 'kitchen-appliances', 'stove'],
    specifications: {
      'Wattage': '1800 Watts',
      'Presets': '7 Cooking Menus',
      'Safety': 'Auto Shut-off, Overheat Protection',
      'Warranty': '1 Year Pigeon Warranty'
    }
  },
  {
    title: 'Wonderchef Nutri-blend 400W Mixer-Grinder & Smoothie Maker (3 Jars)',
    slug: 'wonderchef-nutri-blend-400w-mixer-smoothie-maker',
    categorySlug: 'home-kitchen',
    sellerSlug: 'homecraft-appliances',
    brand: 'Wonderchef',
    description: 'Sanjeev Kapoor recommended super-compact mixer grinder. Powerful 400W 22,000 RPM copper motor breaks down food walls to extract complete micronutrients from fruits, nuts, and chutneys.',
    highlights: [
      'Extracts every drop of immunity-boosting antioxidants and vitamins',
      'Precision surgical-grade stainless steel blades running at 22,000 RPM',
      'Comes with 3 unbreakable polycarbonate jars and sipper travel lid',
      'Hands-free push operation with zero buttons or switches'
    ],
    mrp: 5500,
    price: 2799,
    stock: 35,
    sku: 'WND-NUTRIBLEND-400-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', alt: 'Wonderchef Nutri-blend', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 4600 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['wonderchef', 'nutri-blend', 'smoothie-maker', 'blender', 'kitchen'],
    specifications: {
      'Power': '400 Watts, 22000 RPM',
      'Jars': 'Big (750ml), Medium (500ml), Small (300ml)',
      'Blades': 'Grinding & Blending Stainless Steel blades',
      'Warranty': '2 Years Wonderchef Warranty'
    }
  },

  // =========================================================================
  // BEAUTY, WELLNESS & GROOMING (Beauty & Wellness) - 9 Products
  // =========================================================================
  {
    title: 'Philips Multigroom Series 7000 14-in-1 Face, Hair & Body Trimmer',
    slug: 'philips-multigroom-series-7000-14-in-1-trimmer',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: 'Philips',
    description: 'Ultimate precision styling for beard, head hair, and body. DualCut self-sharpening blades with 14 quality tools, 120 minutes run time from lithium-ion battery, and 100% showerproof.',
    highlights: [
      '14 premium tools: Metal trimmer, nose/ear trimmer, body shaver, 8 combs',
      'DualCut self-sharpening blades stay as sharp as day 1 after 5 years',
      'Lithium-ion battery delivers up to 120 minutes run time per 1-hour charge',
      '100% waterproof for convenient use in the shower and easy cleaning'
    ],
    mrp: 5495,
    price: 3699,
    stock: 40,
    sku: 'PHIL-MG7715-TRIM',
    images: [
      { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', alt: 'Philips Multigroom 7000', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 6800 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['philips', 'trimmer', 'grooming', 'shaving', 'beard', 'waterproof'],
    specifications: {
      'Battery Run Time': '120 Minutes',
      'Tools Included': '14 Grooming Attachments',
      'Blade Material': 'Self-sharpening DualCut Stainless Steel',
      'Waterproof': '100% Showerproof'
    }
  },
  {
    title: 'Dyson Supersonic Hair Dryer with Intelligent Heat Control',
    slug: 'dyson-supersonic-hair-dryer-iron-fuchsia',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: 'Dyson',
    description: 'Fast drying with no extreme heat. Engineered for different hair types with 5 magnetic styling attachments including the Flyaway attachment for a smooth, salon-standard shiny finish.',
    highlights: [
      'Small, powerful Dyson V9 digital motor spins at up to 110,000 rpm',
      'Intelligent heat control measures air temperature over 40 times a second',
      '5 Magnetic styling attachments including the Flyaway smoothing tool',
      'Negative ions help reduce static electricity in hair'
    ],
    mrp: 39900,
    price: 34900,
    stock: 14,
    sku: 'DYS-SUPERSONIC-HD08-FCH',
    images: [
      { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', alt: 'Dyson Supersonic Hair Dryer', isPrimary: true }
    ],
    ratings: { average: 4.9, count: 1240 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['dyson', 'hair-dryer', 'supersonic', 'beauty', 'hair-care', 'luxury'],
    specifications: {
      'Motor': 'Dyson V9 Digital Motor',
      'Heat Settings': '4 Precise Heat Settings (28°C to 100°C)',
      'Speed Settings': '3 Precise Speed Settings',
      'Weight': '659 grams'
    }
  },
  {
    title: 'The Ordinary Niacinamide 10% + Zinc 1% High-Strength Blemish Serum (30ml)',
    slug: 'the-ordinary-niacinamide-10-zinc-1-serum-30ml',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: 'The Ordinary',
    description: 'A universal serum for blemish-prone skin that visibly smooths, brightens, and supports skin barrier health. Reduces the appearance of skin blemishes and congestion.',
    highlights: [
      '10% Pure Niacinamide (Vitamin B3) balances visible sebum activity',
      '1% Zinc PCA visibly minimizes enlarged pores and enhances skin texture',
      'Alcohol-free, oil-free, silicone-free, vegan, and cruelty-free',
      'Improves skin barrier hydration and resilience within 8 days'
    ],
    mrp: 750,
    price: 600,
    stock: 90,
    sku: 'ORD-NIAC-30ML',
    images: [
      { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', alt: 'The Ordinary Niacinamide Serum', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 14200 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['the-ordinary', 'niacinamide', 'skincare', 'serum', 'acne', 'pores'],
    specifications: {
      'Volume': '30 ml',
      'Key Actives': '10% Niacinamide, 1% Zinc PCA',
      'Skin Type': 'All Skin Types (Best for Oily & Combination)',
      'Application': 'Morning and Evening before heavy creams'
    }
  },
  {
    title: 'Forest Essentials Soundarya Radiance Face Serum with 24K Gold (30ml)',
    slug: 'forest-essentials-soundarya-radiance-face-serum-24k-gold',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: 'Forest Essentials',
    description: 'An iconic Ayurvedic night serum infused with 24 Karat Gold Bhasma and cold-pressed pure oils. Deeply nourishes the skin, boosts elasticity, and imparts an ethereal, lit-from-within glow.',
    highlights: [
      'Infused with 24K pure Gold Bhasma for natural cellular regeneration',
      'Ashwagandha, Saffron, and Sandalwood stimulate collagen production',
      '100% Natural Ayurvedic formulation free from parabens and petrochemicals',
      'Reduces fine lines, pigment spots, and restores youthful radiance'
    ],
    mrp: 6895,
    price: 5795,
    stock: 15,
    sku: 'FE-SOUNDARYA-SERUM-30ML',
    images: [
      { url: 'https://images.unsplash.com/photo-1608248597359-00f741394b9f?w=800&q=80', alt: 'Forest Essentials Soundarya Serum', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 890 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['forest-essentials', 'ayurveda', 'gold-serum', 'luxury-skincare', 'anti-aging'],
    specifications: {
      'Volume': '30 ml',
      'Key Ingredients': '24K Gold Bhasma, Saffron, Ashwagandha, Sesame Oil',
      'Skin Benefit': 'Luminosity, Firming, Anti-aging'
    }
  },
  {
    title: 'Minimalist 2% Salicylic Acid Face Serum for Blackheads & Oil Control (30ml)',
    slug: 'minimalist-2-salicylic-acid-face-serum-30ml',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: 'Minimalist',
    description: 'Potent formulation of 2% Salicylic Acid (BHA) that easily penetrates deep into pores to scoop out pore-clogging sebum and dead cells, preventing blackheads and breakouts.',
    highlights: [
      '2% Salicylic Acid (BHA) dissolves sebum inside pores',
      'Formulated with Oligopeptide-10 to combat acne-causing bacteria',
      'Contains Aloe vera juice base to soothe redness and prevent dry flaking',
      'Fragrance-free, non-comedogenic, and dermatologically tested'
    ],
    mrp: 599,
    price: 499,
    stock: 70,
    sku: 'MIN-SA2-SERUM-30ML',
    images: [
      { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', alt: 'Minimalist Salicylic Acid Serum', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 8700 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['minimalist', 'salicylic-acid', 'bha', 'acne', 'skincare'],
    specifications: {
      'Volume': '30 ml',
      'Active Percentage': '2% Pure Salicylic Acid',
      'Target Concerns': 'Blackheads, Whiteheads, Acne, Excess Sebum'
    }
  },
  {
    title: 'Kama Ayurveda Pure Rose Water Hydrating Face Mist (200ml)',
    slug: 'kama-ayurveda-pure-rose-water-mist-200ml',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: 'Kama Ayurveda',
    description: 'Steam distilled from the legendary Rosa Damascena roses of Kannauj. A natural astringent that balances and restores skin pH while tightening pores and refreshing tired skin.',
    highlights: [
      '100% Pure Steam Distilled Kannauj Rose Water',
      'Balances skin pH level and gently tightens facial pores',
      'Soothes sunburn, tired eyes, and delivers immediate cooling hydration',
      'Free from artificial fragrances, alcohol, preservatives, or chemical additives'
    ],
    mrp: 1495,
    price: 1250,
    stock: 55,
    sku: 'KAMA-ROSEWATER-200ML',
    images: [
      { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', alt: 'Kama Ayurveda Pure Rose Water', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 5200 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['kama-ayurveda', 'rose-water', 'toner', 'mist', 'ayurvedic'],
    specifications: {
      'Volume': '200 ml Spray Bottle',
      'Source': 'Kannauj Roses (Rosa Damascena)',
      'Benefits': 'Toning, Hydrating, Soothing'
    }
  },
  {
    title: 'Bombay Shaving Company Precision Metal Safety Razor Grooming Kit',
    slug: 'bombay-shaving-company-precision-metal-safety-razor-kit',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: 'Bombay Shaving Company',
    description: 'Rediscover the art of the classic barbershop shave. Heavyweight brass safety razor engineered with gravity-assisted balance, precision head, and 10 platinum-coated Feather blades.',
    highlights: [
      'Heavyweight brass handle engineered for effortless zero-pressure glide',
      'Aggressive yet comfortable double-edge head eliminates razor bumps & ingrown hair',
      'Includes 10 Japanese Feather platinum blades, pre-shave scrub & post-shave balm',
      'Eco-friendly 100% plastic-free zero waste wet shaving kit'
    ],
    mrp: 2995,
    price: 1795,
    stock: 30,
    sku: 'BSC-RAZOR-KIT-SLV',
    images: [
      { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', alt: 'Bombay Shaving Company Safety Razor', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 2400 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['bombay-shaving-company', 'safety-razor', 'shaving', 'grooming', 'zero-waste'],
    specifications: {
      'Handle Material': 'Solid Chrome-Plated Brass',
      'Blade Type': 'Standard Double Edge (DE)',
      'Included': 'Razor, 10 Feather Blades, Shaving Cream, Post-Shave Balm'
    }
  },
  {
    title: 'Cetaphil Gentle Skin Cleanser for Dry to Normal Sensitive Skin (250ml)',
    slug: 'cetaphil-gentle-skin-cleanser-250ml',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: 'Cetaphil',
    description: 'Dermatologist-recommended creamy, non-foaming formula with Micellar Technology. Gently removes dirt, makeup, and impurities while preserving skin moisture barrier.',
    highlights: [
      'Formulated with Niacinamide, Panthenol (Pro-Vitamin B5), and hydrating Glycerin',
      'Hypoallergenic, fragrance-free, soap-free, and non-comedogenic',
      'Defends against 5 signs of skin sensitivity (Dryness, Irritation, Roughness, Tightness, Weakened barrier)',
      'Can be used with or without water'
    ],
    mrp: 495,
    price: 420,
    stock: 85,
    sku: 'CET-GENTLE-CLEANSE-250',
    images: [
      { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80', alt: 'Cetaphil Gentle Skin Cleanser', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 18900 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['cetaphil', 'cleanser', 'skincare', 'sensitive-skin', 'dermatology'],
    specifications: {
      'Volume': '250 ml Pump Bottle',
      'Formula': 'Soap-Free, Fragrance-Free Lotion',
      'Skin Type': 'Dry to Normal, Sensitive Skin'
    }
  },
  {
    title: 'L’Oreal Paris Extraordinary Oil Serum with 6 Rare Flower Extracts (100ml)',
    slug: 'loreal-paris-extraordinary-oil-hair-serum-100ml',
    categorySlug: 'beauty-wellness',
    sellerSlug: 'pureglow-wellness',
    brand: "L'Oreal Paris",
    description: 'Transform dull, unruly hair into silky, lustrous locks. Lightweight multi-use serum infused with 6 precious flower oils that controls frizz, delivers luminous shine, and heat protection.',
    highlights: [
      'Infused with 6 floral micro-oils (Lotus, Chamomile, Tiare, Rose, Flax, Sunflower)',
      'Controls frizz and flyaways for up to 48 hours without weighing hair down',
      'Provides heat styling protection up to 230°C',
      'Can be applied on damp hair before blow-drying or dry hair for gloss touch-up'
    ],
    mrp: 649,
    price: 485,
    stock: 65,
    sku: 'LOR-EXTRAOIL-100ML',
    images: [
      { url: 'https://images.unsplash.com/photo-1608248597359-00f741394b9f?w=800&q=80', alt: "L'Oreal Paris Extraordinary Oil", isPrimary: true }
    ],
    ratings: { average: 4.6, count: 9800 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['loreal', 'hair-serum', 'hair-care', 'frizz-control', 'extraordinary-oil'],
    specifications: {
      'Volume': '100 ml Glass Dispenser',
      'Key Oils': '6 Rare Flower Extracts',
      'Hair Type': 'All Hair Types (Dry, Frizzy, Dull)'
    }
  },

  // =========================================================================
  // SPORTS, FITNESS & OUTDOORS (Sports & Fitness) - 8 Products
  // =========================================================================
  {
    title: 'Decathlon Domyos Hex Rubber Dumbbell Pair (10kg each, 20kg Total)',
    slug: 'decathlon-domyos-hex-rubber-dumbbell-pair-10kg',
    categorySlug: 'sports-fitness',
    sellerSlug: 'apex-sports-gear',
    brand: 'Decathlon',
    description: 'Commercial grade hexagonal rubber dumbbells designed for cross-training and strength workouts. Hexagonal shape prevents rolling on the floor, and ergonomic knurled chrome handle provides secure grip.',
    highlights: [
      'Hexagonal shape prevents rolling and allows push-ups on dumbbells',
      'Thick rubber coating protects floor tiles against scratches and dampens noise',
      'Ergonomic contoured chrome handle with cross-hatched knurling',
      'Pair of 2 dumbbells (10kg + 10kg = 20kg total)'
    ],
    mrp: 5999,
    price: 4499,
    stock: 30,
    sku: 'DEC-HEXDUMB-10KG-PR',
    images: [
      { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80', alt: 'Decathlon Hex Dumbbells', isPrimary: true }
    ],
    ratings: { average: 4.8, count: 2750 },
    isFeatured: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['decathlon', 'dumbbells', 'fitness', 'gym', 'strength', 'weights'],
    specifications: {
      'Weight': '10 kg x 2 = 20 kg',
      'Material': 'Cast Iron with Heavy Duty Rubber Encasing',
      'Grip': 'Ergonomic Knurled Chrome Steel'
    }
  },
  {
    title: 'Cosco High Density Anti-Skid Rubberised Yoga Mat with Alignment Lines (6mm)',
    slug: 'cosco-anti-skid-rubberised-yoga-mat-6mm',
    categorySlug: 'sports-fitness',
    sellerSlug: 'apex-sports-gear',
    brand: 'Cosco',
    description: 'Master your asanas with superior stability. Eco-friendly dual-layer TPE material with body alignment guidance markings, non-slip textured grip, and moisture-resistant cushioning.',
    highlights: [
      '6mm high-density cushioned thickness protects joints and knees on hard floors',
      'Laser-engraved body alignment lines help position hands and feet precisely',
      'Eco-friendly biodegradable TPE material: free from PVC, latex, and toxic chemicals',
      'Includes complimentary carrying strap for effortless transport'
    ],
    mrp: 2499,
    price: 1299,
    stock: 45,
    sku: 'COSCO-YOGAMAT-6MM-BLU',
    images: [
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', alt: 'Cosco Yoga Mat with Alignment', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 3400 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['cosco', 'yoga-mat', 'fitness', 'exercise', 'pilates', 'yoga'],
    specifications: {
      'Dimensions': '183 cm x 61 cm (6ft x 2ft)',
      'Thickness': '6 mm',
      'Material': 'Dual-layer Non-Slip TPE',
      'Weight': '950 grams'
    }
  },
  {
    title: 'Yonex Astrox 99 Pro Graphite Badminton Racket (3U / 4U, G4)',
    slug: 'yonex-astrox-99-pro-badminton-racket',
    categorySlug: 'sports-fitness',
    sellerSlug: 'apex-sports-gear',
    brand: 'Yonex',
    description: 'Engineered for power smashers. Co-developed with Kento Momota, the Astrox 99 Pro features the Rotational Generator System, Namd graphite for flex and snapback, and Power-Assist Bumper.',
    highlights: [
      'Rotational Generator System applies counterbalance theory for smooth transitions',
      'Extra Slim Shaft with Namd revolutionary graphite maximizes shuttle speed',
      'Head-Heavy balance engineered specifically for steep unreturnable smashes',
      'Made in Japan with premium full cover included'
    ],
    mrp: 18990,
    price: 14490,
    stock: 16,
    sku: 'YNX-ASTROX99-PRO-WHT',
    images: [
      { url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80', alt: 'Yonex Astrox 99 Pro Racket', isPrimary: true }
    ],
    ratings: { average: 4.9, count: 1120 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['yonex', 'badminton', 'astrox', 'racket', 'smash', 'sports'],
    specifications: {
      'Frame': 'HM Graphite + Namd + Volume Cut Resin',
      'Weight / Grip': '4U (Avg. 83g) G5',
      'Stringing Advice': 'Up to 28 lbs',
      'Origin': 'Made in Japan'
    }
  },
  {
    title: 'Nivia Storm Football (Size 5, Rubber Molded All-Weather Design)',
    slug: 'nivia-storm-football-size-5-rubber-molded',
    categorySlug: 'sports-fitness',
    sellerSlug: 'apex-sports-gear',
    brand: 'Nivia',
    description: 'India’s most popular training football. Suitable for hard ground without grass, wet and muddy conditions, and artificial turf. 32-panel rubber molded construction with latex bladder.',
    highlights: [
      '32-panel rubber molded design withstands abrasive hard dirt and concrete surfaces',
      'Multi-layer rubber outer material prevents water absorption on wet days',
      'High air-retention butyl bladder maintains consistent bounce and pressure',
      'Approved by FIFA standards for training and club matches'
    ],
    mrp: 999,
    price: 499,
    stock: 75,
    sku: 'NIV-STORM-FB-SZ5',
    images: [
      { url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', alt: 'Nivia Storm Football', isPrimary: true }
    ],
    ratings: { average: 4.4, count: 9600 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    tags: ['nivia', 'football', 'soccer', 'sports', 'size-5', 'outdoor'],
    specifications: {
      'Size': 'Size 5 (Official Adult Match Size)',
      'Construction': 'Rubber Molded 32 Panels',
      'Surface': 'Hard Ground, Wet Mud, Concrete, Grass'
    }
  },
  {
    title: 'Vector X Resistance Bands Set for Home Workout (5 Tube Set with Handles)',
    slug: 'vector-x-resistance-bands-tube-set-5-levels',
    categorySlug: 'sports-fitness',
    sellerSlug: 'apex-sports-gear',
    brand: 'Vector X',
    description: 'Complete portable gym in a pouch. Includes 5 color-coded natural latex resistance tubes (10 lbs to 50 lbs, stackable up to 150 lbs), foam cushioned handles, ankle straps, and door anchor.',
    highlights: [
      '5 Resistance Levels: Yellow (10lb), Blue (20lb), Green (30lb), Black (40lb), Red (50lb)',
      'Stackable up to 150 lbs of resistance for progressive overload strength training',
      '100% High-grade Natural Malayan Latex tubes with steel carabiners',
      'Includes Door Anchor, 2 Foam Handles, 2 Ankle Straps, and Waterproof Carry Bag'
    ],
    mrp: 1999,
    price: 899,
    stock: 50,
    sku: 'VX-RESIST-5TUBE-SET',
    images: [
      { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80', alt: 'Resistance Bands Set', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 3800 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['resistance-bands', 'home-workout', 'fitness', 'vector-x', 'strength'],
    specifications: {
      'Total Resistance': 'Up to 150 lbs (Stackable)',
      'Material': '100% Natural Latex',
      'Included': '5 Tubes, 2 Handles, 2 Ankle Straps, 1 Door Anchor, 1 Pouch'
    }
  },
  {
    title: 'SG Sierra Plus English Willow Cricket Bat (Full Size, Short Handle)',
    slug: 'sg-sierra-plus-english-willow-cricket-bat',
    categorySlug: 'sports-fitness',
    sellerSlug: 'apex-sports-gear',
    brand: 'SG',
    description: 'Handcrafted from selected Grade 3 English willow with massive thick edges and curved blade for explosive stroke play. Fitted with short cane handle for ultimate shock absorption.',
    highlights: [
      'Finest Handcrafted Grade 3 English Willow with 5 to 7 straight grains',
      'Massive 38-40mm edge profile with rounded spine for high sweet spot power',
      'Imported Sarawak cane handle with chevron grip for superior ball control',
      'Comes with full-length padded bat cover with adjustable shoulder strap'
    ],
    mrp: 9999,
    price: 6499,
    stock: 18,
    sku: 'SG-SIERRA-EW-SH',
    images: [
      { url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80', alt: 'SG English Willow Cricket Bat', isPrimary: true }
    ],
    ratings: { average: 4.7, count: 1890 },
    isFeatured: true,
    isBestSeller: false,
    isDealOfTheDay: false,
    tags: ['sg', 'cricket', 'cricket-bat', 'english-willow', 'sports'],
    specifications: {
      'Willow': 'Grade 3 English Willow',
      'Size': 'Full Size (Men’s Short Handle)',
      'Weight': '1180 to 1220 grams',
      'Edge Thickness': '38 to 40 mm'
    }
  },
  {
    title: 'Strava Pro Aerodynamic Cycling Helmet with Integrated Visor (M/L)',
    slug: 'strava-pro-aerodynamic-cycling-helmet',
    categorySlug: 'sports-fitness',
    sellerSlug: 'apex-sports-gear',
    brand: 'Strava',
    description: 'Ride safer and faster with in-mold polycarbonate shell and high-density EPS foam liner. Features 18 airflow cooling vents, magnetic snap-on UV400 visor, and dial fit adjustment system.',
    highlights: [
      'In-Mold Polycarbonate outer shell fused with shock-absorbing EPS liner',
      'Magnetic detachable UV400 shield visor protects against wind and sun glare',
      '18 Aerodynamic wind-tunnel tested vents keep head cool during intense climbs',
      '360-degree micro-dial adjustment fit system fits head sizes 56-62 cm'
    ],
    mrp: 3499,
    price: 1999,
    stock: 28,
    sku: 'STR-HELMET-AERO-BLK',
    images: [
      { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80', alt: 'Cycling Helmet with Visor', isPrimary: true }
    ],
    ratings: { average: 4.6, count: 870 },
    isFeatured: false,
    isBestSeller: false,
    isDealOfTheDay: true,
    tags: ['cycling', 'helmet', 'bike', 'safety', 'strava', 'bicycle'],
    specifications: {
      'Certification': 'CE EN1078 Certified',
      'Vents': '18 Air Flow Vents',
      'Head Size': '56 to 62 cm (Adjustable)',
      'Weight': '290 grams'
    }
  },
  {
    title: 'Boldfit 1 Litre Motivational Water Bottle with Time Marker & Straw',
    slug: 'boldfit-1-litre-motivational-water-bottle-straw',
    categorySlug: 'sports-fitness',
    sellerSlug: 'apex-sports-gear',
    brand: 'Boldfit',
    description: 'Track daily hydration effortlessly! Features hourly time markings, motivational quotes, one-click flip lid with safety lock, silicone straw, and 100% BPA-free Tritan plastic.',
    highlights: [
      'Hourly time markers with encouraging quotes keep you drinking throughout the day',
      '100% BPA-Free non-toxic eco-friendly Tritan co-polyester plastic',
      'One-click flip top lid with secure lock makes it leakproof and dust-proof',
      'Removable pop-up silicone straw for spill-proof sipping on gym machines'
    ],
    mrp: 999,
    price: 499,
    stock: 70,
    sku: 'BOLD-BOTTLE-1L-GRAD',
    images: [
      { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', alt: 'Boldfit Motivational Water Bottle', isPrimary: true }
    ],
    ratings: { average: 4.5, count: 8400 },
    isFeatured: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    tags: ['boldfit', 'water-bottle', 'gym-bottle', 'hydration', 'fitness'],
    specifications: {
      'Capacity': '1000 ml (32 oz)',
      'Material': 'BPA-Free Food Grade Tritan',
      'Features': 'Time Marker, Silicone Straw, Carry Strap'
    }
  }
];

module.exports = {
  sellersData,
  productsCatalog,
};
