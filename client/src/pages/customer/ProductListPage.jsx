import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal, X, ChevronRight, LayoutGrid, List,
  Star, RotateCcw, Check, ShoppingBag, Search, ChevronDown,
} from 'lucide-react';
import { productService, categoryService } from '../../services';
import ProductCard from '../../components/products/ProductCard';
import Pagination from '../../components/common/Pagination';
import { MOCK_CATALOG } from '../../data/mockProductsCatalog';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/helpers';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
];

const RATING_OPTIONS = [
  { value: '4', label: '4★ & above' },
  { value: '3', label: '3★ & above' },
  { value: '2', label: '2★ & above' },
];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentKeyword = searchParams.get('keyword') || searchParams.get('q') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentMinRating = searchParams.get('minRating') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Component state
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Local price input state
  const [priceMinInput, setPriceMinInput] = useState(currentMinPrice);
  const [priceMaxInput, setPriceMaxInput] = useState(currentMaxPrice);

  useEffect(() => {
    setPriceMinInput(currentMinPrice);
    setPriceMaxInput(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  // Load categories once
  useEffect(() => {
    categoryService.getAll()
      .then(res => setCategories(res.data?.data || []))
      .catch(() => setCategories([]));
  }, []);

  // Update URL search parameters helper
  const updateFilter = useCallback((key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    // Always reset to page 1 when filter changes
    if (key !== 'page') {
      next.set('page', '1');
    }
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const next = new URLSearchParams();
    if (currentKeyword) next.set('keyword', currentKeyword);
    setSearchParams(next);
  }, [currentKeyword, setSearchParams]);

  // Fetch products
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const params = {
      page: currentPage,
      limit: 16,
      sort: currentSort,
    };
    if (currentCategory) params.category = currentCategory;
    if (currentKeyword) params.keyword = currentKeyword;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;
    if (currentMinRating) params.minRating = currentMinRating;
    if (currentInStock) params.inStock = 'true';

    productService.getAll(params)
      .then(res => {
        if (!isCancelled) {
          const list = res.data?.data || [];
          const finalProducts = list.length > 0 ? list : MOCK_CATALOG;
          setProducts(finalProducts);
          if (res.data?.pagination) {
            setPagination(res.data.pagination);
          } else {
            setPagination({ page: 1, totalPages: 1, total: finalProducts.length });
          }
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setProducts(MOCK_CATALOG);
          setPagination({ page: 1, totalPages: 1, total: MOCK_CATALOG.length });
        }
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => { isCancelled = true; };
  }, [
    currentCategory, currentKeyword, currentSort,
    currentMinPrice, currentMaxPrice, currentMinRating,
    currentInStock, currentPage,
  ]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentCategory) count++;
    if (currentMinPrice || currentMaxPrice) count++;
    if (currentMinRating) count++;
    if (currentInStock) count++;
    return count;
  }, [currentCategory, currentMinPrice, currentMaxPrice, currentMinRating, currentInStock]);

  const activeCategoryName = useMemo(() => {
    if (!currentCategory) return null;
    const found = categories.find(c => c.slug === currentCategory || c._id === currentCategory);
    return found ? found.name : currentCategory;
  }, [currentCategory, categories]);

  const handleApplyPrice = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (priceMinInput) next.set('minPrice', priceMinInput);
    else next.delete('minPrice');
    if (priceMaxInput) next.set('maxPrice', priceMaxInput);
    else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
  };

  const renderFilterPanel = () => (
    <div className="space-y-6">
      {/* Header / Clear */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-text-primary">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" className="text-xs px-2 py-0.5 font-bold">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary-600 hover:text-primary-800 font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider text-xs">
          Categories
        </h3>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => updateFilter('category', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
              !currentCategory
                ? 'bg-primary-50 text-primary-700 font-semibold'
                : 'text-text-secondary hover:bg-surface-bg'
            }`}
          >
            <span>All Categories</span>
            {!currentCategory && <Check className="w-4 h-4 text-primary-600" />}
          </button>
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug || currentCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => updateFilter('category', isSelected ? '' : cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-text-secondary hover:bg-surface-bg'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-4 h-4 text-primary-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-surface-border">
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider text-xs">
          Price Range (₹)
        </h3>
        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={priceMinInput}
              onChange={(e) => setPriceMinInput(e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm border border-surface-border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-surface-card"
            />
            <span className="text-text-muted text-xs">to</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={priceMaxInput}
              onChange={(e) => setPriceMaxInput(e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm border border-surface-border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-surface-card"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 px-3 bg-surface-bg hover:bg-gray-200 border border-surface-border text-text-primary rounded-lg text-xs font-semibold transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Customer Rating */}
      <div className="pt-4 border-t border-surface-border">
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider text-xs">
          Customer Rating
        </h3>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((opt) => {
            const isSelected = currentMinRating === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateFilter('minRating', isSelected ? '' : opt.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-amber-50 text-amber-900 font-semibold'
                    : 'text-text-secondary hover:bg-surface-bg'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-4 border-t border-surface-border">
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider text-xs">
          Availability
        </h3>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) => updateFilter('inStock', e.target.checked)}
            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-surface-border"
          />
          <span className="text-sm text-text-secondary font-medium">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-surface-border py-4">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/products" className="hover:text-primary-600 transition-colors">Catalog</Link>
            {activeCategoryName && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-text-primary font-medium">{activeCategoryName}</span>
              </>
            )}
            {currentKeyword && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-text-primary font-medium">Search: "{currentKeyword}"</span>
              </>
            )}
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
                {activeCategoryName || (currentKeyword ? `Results for "${currentKeyword}"` : 'All Products')}
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                {loading ? 'Finding matching products...' : `Showing ${products.length} of ${pagination.total} items`}
              </p>
            </div>

            {/* Mobile Filter Trigger + Sort dropdown */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-surface-border rounded-xl text-sm font-semibold text-text-primary shadow-sm hover:bg-surface-bg"
              >
                <SlidersHorizontal className="w-4 h-4 text-primary-600" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-lg border border-surface-border">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-text-muted hover:text-text-primary'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-text-muted hover:text-text-primary'}`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort selector */}
                <div className="relative inline-block">
                  <select
                    value={currentSort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="appearance-none bg-white border border-surface-border text-text-primary text-sm font-medium rounded-xl py-2 pl-3.5 pr-8 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 cursor-pointer shadow-sm"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container-main pt-6">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-xs sticky top-24">
              {renderFilterPanel()}
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 min-w-0">
            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded-xl border border-surface-border">
                <span className="text-xs text-text-muted font-medium">Applied Filters:</span>
                {activeCategoryName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-primary-50 text-primary-700 font-medium border border-primary-100">
                    Category: {activeCategoryName}
                    <button onClick={() => updateFilter('category', '')} className="hover:text-primary-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {(currentMinPrice || currentMaxPrice) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-primary-50 text-primary-700 font-medium border border-primary-100">
                    Price: ₹{currentMinPrice || '0'} – ₹{currentMaxPrice || '∞'}
                    <button onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('minPrice');
                      next.delete('maxPrice');
                      setSearchParams(next);
                    }} className="hover:text-primary-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {currentMinRating && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-amber-50 text-amber-800 font-medium border border-amber-200">
                    Rating: {currentMinRating}★+
                    <button onClick={() => updateFilter('minRating', '')} className="hover:text-amber-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {currentInStock && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700 font-medium border border-green-200">
                    In Stock
                    <button onClick={() => updateFilter('inStock', false)} className="hover:text-green-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-error-600 hover:underline font-semibold ml-auto"
                >
                  Reset All
                </button>
              </div>
            )}

            {/* Content State */}
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <div className="bg-white border border-surface-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">No products found</h3>
                <p className="text-sm text-text-muted mb-6">
                  We couldn't find any products matching your specific filters. Try relaxing or resetting your criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} className="bg-white border border-surface-border shadow-xs" />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={(p) => updateFilter('page', p)}
                    />
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
                <h2 className="font-bold text-text-primary text-lg">Filter Products</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderFilterPanel()}
            </div>
            <div className="pt-6 border-t border-surface-border mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl shadow-md hover:bg-primary-700 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}