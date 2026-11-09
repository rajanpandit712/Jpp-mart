import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers, ChevronRight, ArrowRight, ShoppingBag,
  SlidersHorizontal, Sparkles, Star, Tag, TrendingUp,
} from 'lucide-react';
import { categoryService, productService } from '../../services';
import ProductCard from '../../components/products/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import { MOCK_CATALOG } from '../../data/mockProductsCatalog';

export default function CategoryPage() {
  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interactive filters
  const [filterMode, setFilterMode] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Load all categories for directory or lookup
  useEffect(() => {
    categoryService.getAll()
      .then((res) => {
        const list = res.data?.data || [];
        setCategories(list);
        if (slug) {
          const match = list.find((c) => c.slug === slug || c._id === slug);
          setCurrentCategory(match || null);
        }
      })
      .catch(() => setCategories([]));
  }, [slug]);

  // Load products if specific slug is selected
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    productService.getAll({ category: slug, limit: 100 })
      .then((res) => {
        const list = res.data?.data || [];
        const matches = list.length > 0 ? list : MOCK_CATALOG.filter(p => p.category?.slug === slug || !slug);
        setProducts(matches.length > 0 ? matches : MOCK_CATALOG);
      })
      .catch(() => {
        const matches = MOCK_CATALOG.filter(p => p.category?.slug === slug || !slug);
        setProducts(matches.length > 0 ? matches : MOCK_CATALOG);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Client-side instant interactive filtering & sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (filterMode === 'deals') {
      list = list.filter(
        (p) => p.isDealOfTheDay || (p.mrp && p.price && (p.mrp - p.price) / p.mrp >= 0.25)
      );
    } else if (filterMode === 'top-rated') {
      list = list.filter((p) => (p.ratings?.average || 0) >= 4.5);
    } else if (filterMode === 'best-sellers') {
      list = list.filter((p) => p.isBestSeller);
    } else if (filterMode === 'under-2k') {
      list = list.filter((p) => p.price <= 2000);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
    }

    return list;
  }, [products, filterMode, sortBy]);

  // ── Render Category Directory (when on /categories without slug) ───────────
  if (!slug) {
    return (
      <div className="bg-surface-bg min-h-screen py-10">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-primary font-medium">Categories</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Explore Categories</h1>
            <p className="text-sm text-text-muted mt-1">
              Browse top products organized into verified Indian marketplace categories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="group bg-white border border-surface-border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="h-44 bg-gray-100 overflow-hidden relative">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600">
                      <Layers className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg leading-tight drop-shadow-sm">{cat.name}</h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-text-muted line-clamp-2 mb-3">
                    {cat.description || 'Discover handpicked products in this category.'}
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                    <span>Browse Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Render Specific Category Page ─────────────────────────────────────────
  const categoryTitle =
    currentCategory?.name ||
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  const categoryDesc =
    currentCategory?.description || `Explore our handpicked selection of ${categoryTitle}.`;

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Category Hero Banner */}
      <div className="bg-linear-to-r from-navy-900 to-primary-900 text-white py-10 px-4 shadow-inner">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-blue-200 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{categoryTitle}</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {categoryTitle}
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              {categoryDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="bg-white border-b border-surface-border sticky top-[68px] z-20 shadow-2xs">
        <div className="container-main py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterMode === 'all'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-text-secondary'
              }`}
            >
              All Products ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('deals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                filterMode === 'deals'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-text-secondary'
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>Deals & Offers</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('top-rated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                filterMode === 'top-rated'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-text-secondary'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>4.5★ & Above</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('best-sellers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                filterMode === 'best-sellers'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-text-secondary'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Best Sellers</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('under-2k')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterMode === 'under-2k'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-text-secondary'
              }`}
            >
              Under ₹2,000
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-surface-bg border border-surface-border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <Link
              to={`/products?category=${slug}`}
              className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 shrink-0 ml-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">More Filters</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-main pt-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium text-text-muted">
            Showing <strong className="text-text-primary font-bold">{filteredProducts.length}</strong> items in {categoryTitle}
          </p>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-surface-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <ShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h3 className="text-lg font-bold text-text-primary mb-1">No products found</h3>
            <p className="text-sm text-text-muted mb-6">
              No products match the selected quick filter. Try resetting your filter.
            </p>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className="inline-flex px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} className="bg-white border border-surface-border shadow-xs" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}