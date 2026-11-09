import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ChevronLeft, ChevronRight,
  ShoppingBag, Star, Zap, Clock, TrendingUp, Sparkles,
  Truck, Shield, RefreshCcw, Headphones,
  Package, Store, Award,
} from 'lucide-react';
import { productService } from '../services';
import { formatCurrency, calcDiscountPct } from '../utils/helpers';
import ProductCard from '../components/products/ProductCard';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { MOCK_CATALOG } from '../data/mockProductsCatalog';

// ─── Hero Slides ─────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'New Season Sale',
    headline: 'Discover India\'s Best\nDeals in One Place',
    sub: 'Electronics, Fashion, Home & more — all from verified sellers.',
    cta: 'Shop Now',
    ctaLink: '/products',
    secondaryCta: 'Explore Categories',
    secondaryLink: '/categories',
    badge: 'Up to 70% Off',
    gradient: 'from-navy-900 via-brand-navy to-primary-900',
    accent: 'from-primary-400 to-teal-400',
    pattern: '📱 💻 👗 🏠 ✨',
  },
  {
    id: 2,
    tag: 'Electronics Fest',
    headline: 'Top Smartphones &\nGadgets at Best Prices',
    sub: 'Latest phones, laptops, earbuds and accessories — all in one click.',
    cta: 'Explore Electronics',
    ctaLink: '/category/electronics',
    secondaryCta: 'Today\'s Deals',
    secondaryLink: '/deals',
    badge: 'Lowest Prices',
    gradient: 'from-[#0F1729] via-[#162244] to-[#1A2D5A]',
    accent: 'from-blue-400 to-cyan-400',
    pattern: '📱 🎧 💻 ⌚ 🖱️',
  },
  {
    id: 3,
    tag: 'Sell on JPP Market',
    headline: 'Start Your Online\nBusiness Today',
    sub: 'Join 10,000+ sellers. List products, manage orders, and grow your brand.',
    cta: 'Become a Seller',
    ctaLink: '/seller/register',
    secondaryCta: 'Learn More',
    secondaryLink: '/seller/guidelines',
    badge: 'Free to Register',
    gradient: 'from-[#0A2A2A] via-[#0F3D35] to-[#134E4A]',
    accent: 'from-teal-400 to-emerald-400',
    pattern: '🏪 📦 💰 📊 🚀',
  },
];

// ─── Category Cards ───────────────────────────────────────────────────────────

const CATEGORIES = [
  { emoji: '📱', label: 'Electronics',    slug: 'electronics',   count: '1200+', color: 'from-blue-50 to-blue-100 border-blue-200',    icon_bg: 'bg-blue-100',   icon_text: 'text-blue-600' },
  { emoji: '💻', label: 'Computers',      slug: 'computers',     count: '800+',  color: 'from-indigo-50 to-indigo-100 border-indigo-200', icon_bg: 'bg-indigo-100', icon_text: 'text-indigo-600' },
  { emoji: '👗', label: 'Fashion',        slug: 'fashion',       count: '5000+', color: 'from-pink-50 to-pink-100 border-pink-200',     icon_bg: 'bg-pink-100',   icon_text: 'text-pink-600' },
  { emoji: '🏠', label: 'Home & Kitchen', slug: 'home-kitchen',  count: '2500+', color: 'from-orange-50 to-orange-100 border-orange-200',icon_bg: 'bg-orange-100', icon_text: 'text-orange-600' },
  { emoji: '✨', label: 'Beauty & Care',  slug: 'beauty',        count: '1800+', color: 'from-purple-50 to-purple-100 border-purple-200',icon_bg: 'bg-purple-100', icon_text: 'text-purple-600' },
  { emoji: '⚽', label: 'Sports',         slug: 'sports',        count: '900+',  color: 'from-green-50 to-green-100 border-green-200',   icon_bg: 'bg-green-100',  icon_text: 'text-green-600' },
  { emoji: '📚', label: 'Books',          slug: 'books',         count: '3000+', color: 'from-yellow-50 to-yellow-100 border-yellow-200',icon_bg: 'bg-yellow-100', icon_text: 'text-yellow-600' },
  { emoji: '👟', label: 'Footwear',       slug: 'footwear',      count: '1500+', color: 'from-rose-50 to-rose-100 border-rose-200',     icon_bg: 'bg-rose-100',   icon_text: 'text-rose-600' },
  { emoji: '🧸', label: 'Toys & Baby',    slug: 'toys',          count: '700+',  color: 'from-teal-50 to-teal-100 border-teal-200',     icon_bg: 'bg-teal-100',   icon_text: 'text-teal-600' },
  { emoji: '🎒', label: 'Accessories',    slug: 'accessories',   count: '1100+', color: 'from-cyan-50 to-cyan-100 border-cyan-200',     icon_bg: 'bg-cyan-100',   icon_text: 'text-cyan-600' },
];

// ─── Services ─────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: Truck,       title: 'Free Delivery',   desc: 'On orders above ₹499',      color: 'bg-blue-50  text-blue-600' },
  { icon: RefreshCcw,  title: '10-Day Returns',  desc: 'Hassle-free return policy', color: 'bg-green-50 text-green-600' },
  { icon: Shield,      title: 'Secure Checkout', desc: '256-bit encrypted payments', color: 'bg-purple-50 text-purple-600' },
  { icon: Headphones,  title: '24/7 Support',    desc: 'Dedicated customer care',    color: 'bg-orange-50 text-orange-600' },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Store,    value: '10,000+', label: 'Verified Sellers',  color: 'text-primary-600' },
  { icon: Package,  value: '5L+',     label: 'Products Listed',   color: 'text-teal-600' },
  { icon: Star,     value: '4.6',     label: 'Average Rating',    color: 'text-warning-600' },
  { icon: Award,    value: '98%',     label: 'Customer Satisfied',color: 'text-success-600' },
];

// ─── Hero Component ───────────────────────────────────────────────────────────

function HeroSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = () => setActive(p => (p + 1) % HERO_SLIDES.length);
  const prev = () => setActive(p => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 5500);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const slide = HERO_SLIDES[active];

  return (
    <section
      aria-label="Featured promotions"
      className={`relative bg-gradient-to-br ${slide.gradient} overflow-hidden min-h-[420px] md:min-h-[500px]`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-white blur-3xl" />
      </div>

      {/* Floating emoji pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-6 right-8 text-4xl opacity-20 animate-pulse-soft">
          {slide.pattern.split(' ')[0]}
        </div>
        <div className="absolute top-20 right-24 text-3xl opacity-15 animate-pulse-soft" style={{ animationDelay: '0.5s' }}>
          {slide.pattern.split(' ')[1]}
        </div>
        <div className="absolute bottom-16 right-12 text-5xl opacity-10 animate-pulse-soft" style={{ animationDelay: '1s' }}>
          {slide.pattern.split(' ')[2]}
        </div>
        <div className="absolute top-32 right-48 text-2xl opacity-10 animate-pulse-soft" style={{ animationDelay: '1.5s' }}>
          {slide.pattern.split(' ')[3]}
        </div>
      </div>

      <div className="container-main relative z-10 py-14 md:py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4
                            bg-gradient-to-r ${slide.accent} text-white shadow-sm`}>
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            {slide.tag}
          </span>

          {/* Headline */}
          <h1
            key={slide.id}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 animate-fade-in whitespace-pre-line"
          >
            {slide.headline}
          </h1>

          {/* Sub */}
          <p className="text-base md:text-lg text-white/80 mb-2 leading-relaxed max-w-xl">
            {slide.sub}
          </p>

          {/* Offer badge */}
          <p className={`inline-block text-sm font-bold px-3 py-1 rounded-full mb-8
                         bg-gradient-to-r ${slide.accent} text-white`}>
            🎯 {slide.badge}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              to={slide.ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy-900
                         text-sm font-bold rounded-xl shadow-lg hover:shadow-xl
                         hover:scale-[1.02] transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {slide.cta}
            </Link>
            <Link
              to={slide.secondaryLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white
                         border border-white/30 text-sm font-medium rounded-xl
                         hover:bg-white/20 transition-colors duration-200"
            >
              {slide.secondaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Prev/Next buttons */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                   bg-white/20 hover:bg-white/30 text-white border border-white/30
                   flex items-center justify-center transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                   bg-white/20 hover:bg-white/30 text-white border border-white/30
                   flex items-center justify-center transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20" role="tablist" aria-label="Slide indicators">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Section wrapper with title ───────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, sub, linkTo, linkLabel = 'View All', accentColor = 'text-primary-600' }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-xl bg-primary-50`}>
            <Icon className={`w-5 h-5 ${accentColor}`} aria-hidden="true" />
          </div>
        )}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">{title}</h2>
          {sub && <p className="text-sm text-text-muted mt-0.5">{sub}</p>}
        </div>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700
                     transition-colors flex-shrink-0 mt-1"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

// ─── Product Grid Section ─────────────────────────────────────────────────────

function ProductSection({ icon, title, sub, products, loading, linkTo, accentColor }) {
  return (
    <section className="py-10">
      <div className="container-main">
        <SectionHeader icon={icon} title={title} sub={sub} linkTo={linkTo} accentColor={accentColor} />
        {loading ? (
          <ProductGridSkeleton count={5} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Products coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {products.slice(0, 10).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();

  const [featured,    setFeatured]    = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trending,    setTrending]    = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [deals,       setDeals]       = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [feat, best, trend, newArr, dealsRes] = await Promise.allSettled([
          productService.getFeatured(),
          productService.getBestSellers(),
          productService.getTrending(),
          productService.getNewArrivals(),
          productService.getDeals(),
        ]);

        const extract = (res) => {
          if (res.status !== 'fulfilled') return [];
          const val = res.value.data?.data;
          if (Array.isArray(val)) return val;
          if (Array.isArray(val?.products)) return val.products;
          if (Array.isArray(val?.items)) return val.items;
          return [];
        };

        const dealsList = extract(dealsRes);
        setDeals(dealsList.length > 0 ? dealsList : MOCK_CATALOG);
        const featList = extract(feat);
        setFeatured(featList.length > 0 ? featList : MOCK_CATALOG);
        const bestList = extract(best);
        setBestSellers(bestList.length > 0 ? bestList : MOCK_CATALOG);
        const trendList = extract(trend);
        setTrending(trendList.length > 0 ? trendList : MOCK_CATALOG);
        const newArrList = extract(newArr);
        setNewArrivals(newArrList.length > 0 ? newArrList : MOCK_CATALOG);
      } catch {}
      finally { setLoading(false); }
    }
    fetchAll();
  }, []);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Services Bar ─────────────────────────────────────── */}
      <section className="bg-white border-b border-surface-border">
        <div className="container-main py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {SERVICES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-xl ${color.split(' ')[0]} flex items-center justify-center flex-shrink-0
                                 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{title}</p>
                  <p className="text-xs text-text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ─────────────────────────────────── */}
      <section className="py-10 bg-surface-bg">
        <div className="container-main">
          <SectionHeader
            title="Shop by Category"
            sub="Browse our wide selection of product categories"
            linkTo="/categories"
            linkLabel="All Categories"
          />
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2 md:gap-3">
            {CATEGORIES.map(({ emoji, label, slug, count, color, icon_bg, icon_text }) => (
              <Link
                key={slug}
                to={`/category/${slug}`}
                className={`group flex flex-col items-center gap-2 p-3 rounded-xl border
                            bg-gradient-to-b ${color}
                            hover:shadow-md transition-all duration-200 hover:-translate-y-0.5
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                aria-label={`Browse ${label}`}
              >
                <div className={`w-12 h-12 rounded-full ${icon_bg} flex items-center justify-center
                                 group-hover:scale-110 transition-transform text-2xl`}>
                  {emoji}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-text-primary leading-tight line-clamp-2">{label}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Today's Deals ─────────────────────────────────────── */}
      {(loading || deals.length > 0) && (
        <>
          <div className="bg-gradient-to-r from-error-600 to-rose-600 py-3">
            <div className="container-main flex items-center gap-3">
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 fill-current" aria-hidden="true" />
                <span className="text-sm font-bold uppercase tracking-wider">Today&apos;s Deals</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Limited time offers</span>
              </div>
            </div>
          </div>
          <ProductSection
            icon={Zap}
            title="Flash Deals"
            sub="Grab these limited-time discounts before they're gone!"
            products={deals}
            loading={loading}
            linkTo="/deals"
            accentColor="text-error-600"
          />
        </>
      )}

      {/* ── Featured Products ─────────────────────────────────── */}
      <ProductSection
        icon={Star}
        title="Featured Products"
        sub="Handpicked products from our top sellers"
        products={featured}
        loading={loading}
        linkTo="/products?featured=true"
        accentColor="text-warning-600"
      />

      {/* ── Stats Banner ──────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-navy-900 to-brand-navy py-14">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              India&apos;s Growing Marketplace
            </h2>
            <p className="text-blue-200 text-sm">Trusted by millions of shoppers and sellers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="text-center group">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center
                                  group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white mb-1">{value}</p>
                <p className="text-sm text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────── */}
      <ProductSection
        icon={TrendingUp}
        title="Best Sellers"
        sub="Most loved products by our customers"
        products={bestSellers}
        loading={loading}
        linkTo="/products?sort=best-sellers"
        accentColor="text-success-600"
      />

      {/* ── Promotional Banner ────────────────────────────────── */}
      <section className="py-6">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sell banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-800 to-teal-600 p-8">
              <div className="absolute top-4 right-4 text-6xl opacity-20" aria-hidden="true">🏪</div>
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2">For Sellers</p>
              <h3 className="text-2xl font-bold text-white mb-2">Start Selling Today</h3>
              <p className="text-teal-100 text-sm mb-6 leading-relaxed">
                Reach crores of customers across India. Register your store in minutes.
              </p>
              <Link
                to="/seller/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-800
                           text-sm font-bold rounded-xl hover:shadow-lg hover:scale-[1.02]
                           transition-all duration-200"
              >
                <Store className="w-4 h-4" />
                Become a Seller
              </Link>
            </div>

            {/* App/Download banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 to-primary-600 p-8">
              <div className="absolute top-4 right-4 text-6xl opacity-20" aria-hidden="true">📱</div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">For Shoppers</p>
              <h3 className="text-2xl font-bold text-white mb-2">Download Our App</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Shop smarter on the go. Track orders, get exclusive deals and more.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-primary-800
                             text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  🍎 App Store
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-primary-800
                             text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  🤖 Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Products ─────────────────────────────────── */}
      <ProductSection
        icon={TrendingUp}
        title="Trending Now"
        sub="What everyone is shopping this week"
        products={trending}
        loading={loading}
        linkTo="/products?sort=trending"
        accentColor="text-teal-600"
      />

      {/* ── New Arrivals ──────────────────────────────────────── */}
      <ProductSection
        icon={Sparkles}
        title="New Arrivals"
        sub="Fresh products just added to our catalog"
        products={newArrivals}
        loading={loading}
        linkTo="/products?sort=newest"
        accentColor="text-primary-600"
      />
    </div>
  );
}
