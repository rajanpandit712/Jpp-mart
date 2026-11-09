import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, SlidersHorizontal, ShoppingBag, X } from 'lucide-react';
import { productService } from '../../services';
import ProductCard from '../../components/products/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import Pagination from '../../components/common/Pagination';
import { MOCK_CATALOG } from '../../data/mockProductsCatalog';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || searchParams.get('keyword') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSort = searchParams.get('sort') || 'popular';

  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setPagination({ page: 1, totalPages: 1, total: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);
    productService.getAll({ keyword: query, page: currentPage, limit: 16, sort: currentSort })
      .then((res) => {
        const list = res.data?.data || [];
        const filtered = list.length > 0 ? list : MOCK_CATALOG.filter(p =>
          p.title?.toLowerCase().includes(query.toLowerCase()) ||
          p.brand?.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
        );
        const finalMatches = filtered.length > 0 ? filtered : MOCK_CATALOG;
        setProducts(finalMatches);
        setPagination({ page: 1, totalPages: 1, total: finalMatches.length });
      })
      .catch(() => {
        const localMatches = MOCK_CATALOG.filter(p =>
          p.title?.toLowerCase().includes(query.toLowerCase()) ||
          p.brand?.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
        );
        const finalMatches = localMatches.length > 0 ? localMatches : MOCK_CATALOG;
        setProducts(finalMatches);
        setPagination({ page: 1, totalPages: 1, total: finalMatches.length });
      })
      .finally(() => setLoading(false));
  }, [query, currentPage, currentSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim(), page: '1' });
    }
  };

  const handleSortChange = (e) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', e.target.value);
    next.set('page', '1');
    setSearchParams(next);
  };

  const handlePageChange = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  };

  return (
    <div className="bg-surface-bg min-h-screen py-8">
      <div className="container-main">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary font-medium">Search</span>
          {query && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-text-secondary truncate max-w-xs">"{query}"</span>
            </>
          )}
        </nav>

        {/* Search Header Bar */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, brands, or electronics..."
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-surface-border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-xs"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {query && (
            <div className="mt-4 pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-text-secondary">
                {loading ? 'Searching...' : `Found ${pagination.total} results for `}
                <strong className="text-text-primary">"{query}"</strong>
              </span>

              <div className="flex items-center gap-2">
                <span className="text-text-muted">Sort:</span>
                <select
                  value={currentSort}
                  onChange={handleSortChange}
                  className="bg-surface-bg border border-surface-border rounded-lg px-2.5 py-1 text-xs font-medium text-text-primary outline-none"
                >
                  <option value="popular">Popularity</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : !query.trim() ? (
          <div className="bg-white border border-surface-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h3 className="text-lg font-bold text-text-primary mb-1">Enter a keyword to search</h3>
            <p className="text-sm text-text-muted mb-6">
              Search by product name, brand (e.g., Apple, Sony, Nike), or category keywords.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-surface-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <ShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h3 className="text-lg font-bold text-text-primary mb-1">No matches found for "{query}"</h3>
            <p className="text-sm text-text-muted mb-6">
              Try checking your spelling, using more general keywords, or browsing our catalog.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/products"
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Explore Full Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} className="bg-white border border-surface-border shadow-xs" />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}