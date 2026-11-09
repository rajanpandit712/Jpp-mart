import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, User, MapPin,
  ChevronDown, LogOut, Package, Settings,
  Store, Shield, Menu, X, Bell, TrendingUp, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLocationContext } from '../../context/LocationContext';
import { debounce, getInitials, formatCurrency } from '../../utils/helpers';
import { productService } from '../../services';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isSeller, logout } = useAuth();
  const { totals } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { openLocationModal, getHeaderDisplay } = useLocationContext();
  const deliveryInfo = getHeaderDisplay ? getHeaderDisplay() : { line1: 'Deliver to', line2: 'Select Location' };

  const [query,           setQuery]           = useState('');
  const [suggestions,     setSuggestions]     = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [accountMenu,     setAccountMenu]     = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [mobileSearchOpen,setMobileSearchOpen]= useState(false);

  const searchRef    = useRef(null);
  const accountRef   = useRef(null);

  // ── Search suggestions (debounced) ───────────────────────────────────────
  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (q.length < 2) { setSuggestions([]); return; }
      try {
        const { data } = await productService.search(q, { limit: 6 });
        setSuggestions(data.data?.products || []);
      } catch { setSuggestions([]); }
    }, 300),
    []
  );

  useEffect(() => { fetchSuggestions(query); }, [query, fetchSuggestions]);

  // ── Close dropdowns on outside click ────────────────────────────────────
  useEffect(() => {
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountMenu(false);
      if (searchRef.current  && !searchRef.current.contains(e.target))  setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    setAccountMenu(false);
    await logout();
    navigate('/');
  };

  const dashboardLink = isAdmin   ? '/admin/dashboard'  :
                        isSeller  ? '/seller/dashboard' :
                                    '/account';

  const cartCount      = totals.itemCount || 0;
  const wishlistCount  = wishlistItems.length || 0;

  const TRENDING_KEYWORDS = [
    'Zebronics Headphones',
    'iPhone 16 Pro',
    'boAt Rockerz',
    'Philips Air Fryer',
    'Puma Running Shoes',
    'Smart Watch',
  ];

  // ── Search bar (shared markup) ─────────────────────────────────────────
  const SearchBar = ({ mobile = false }) => (
    <form
      onSubmit={handleSearch}
      className={mobile ? 'px-4 pb-3' : 'flex-1 max-w-2xl'}
      role="search"
    >
      <div ref={mobile ? undefined : searchRef} className="relative">
        <label htmlFor={mobile ? 'search-mobile' : 'search-desktop'} className="sr-only">
          Search products
        </label>
        <input
          id={mobile ? 'search-mobile' : 'search-desktop'}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search products, brands & categories…"
          autoComplete="off"
          className="w-full pl-4 pr-20 py-2.5 text-sm text-text-primary bg-white
                     border border-surface-border rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     placeholder:text-text-muted shadow-2xs"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="p-1 text-text-muted hover:text-text-primary rounded-md"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-2xs"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Interactive Suggestions & Trending Dropdown */}
        {!mobile && showSuggestions && (
          <div
            className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-surface-border
                       rounded-2xl shadow-2xl z-[1000] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
          >
            {/* Case 1: Empty Query - Show Trending Searches */}
            {query.trim().length === 0 && (
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-wider mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-primary-600" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        setQuery(kw);
                        setShowSuggestions(false);
                        navigate(`/search?q=${encodeURIComponent(kw)}`);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-primary-50 hover:text-primary-600 transition-colors border border-transparent hover:border-primary-200"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Case 2: Matching Product Results */}
            {query.trim().length > 0 && suggestions.length > 0 && (
              <ul role="listbox" className="divide-y divide-gray-100">
                {suggestions.map((p) => {
                  const title = p.title || p.name || 'Product';
                  const rawImg = p.images?.[0];
                  const imgUrl = typeof rawImg === 'string' ? rawImg : rawImg?.url;
                  return (
                    <li key={p._id} role="option">
                      <button
                        type="button"
                        className="flex items-center justify-between gap-3 w-full px-4 py-2.5 text-left
                                   hover:bg-primary-50/50 transition-colors text-sm group"
                        onClick={() => {
                          setShowSuggestions(false);
                          setQuery(title);
                          navigate(`/products/${p.slug || p._id}`);
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border border-surface-border shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <Search className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-text-primary group-hover:text-primary-600 line-clamp-1 transition-colors">
                              {title}
                            </p>
                            {p.brand && (
                              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                                {p.brand}
                              </p>
                            )}
                          </div>
                        </div>

                        {p.price && (
                          <div className="text-right shrink-0">
                            <span className="font-bold text-xs text-text-primary">
                              {formatCurrency(p.price)}
                            </span>
                            {p.mrp > p.price && (
                              <span className="block text-[10px] text-text-muted line-through">
                                {formatCurrency(p.mrp)}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full px-4 py-2.5 text-center text-xs text-primary-600 font-bold
                               hover:bg-primary-50 bg-gray-50/60 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View all matching results for &ldquo;{query}&rdquo;</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </li>
              </ul>
            )}

            {/* Case 3: Typed query with no suggestions yet */}
            {query.trim().length > 1 && suggestions.length === 0 && (
              <div className="p-4 text-center text-xs text-text-muted">
                <p>Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border font-mono">Enter</kbd> to search for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );

  return (
    <header className="sticky top-0 z-[1030] bg-[#0c1626] shadow-lg border-b border-white/10">
      {/* Main header row */}
      <div className="container-main">
        <div className="flex items-center gap-3 py-2.5">

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand logo (Amazon/Flipkart style) */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0 group py-0.5"
            aria-label="JPP Mart – Home"
          >
            <img
              src="/jpp-mart-logo.jpg"
              alt="JPP Mart"
              className="h-9 sm:h-11 w-auto max-w-[140px] sm:max-w-[170px] object-contain rounded-md transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Delivery location (interactive map trigger) */}
          <button
            type="button"
            onClick={() => openLocationModal('select')}
            className="hidden sm:flex items-center gap-2 text-white hover:text-blue-100 transition-all px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex-shrink-0 group max-w-[210px] text-left border border-white/10 hover:border-white/20 shadow-xs"
            title={deliveryInfo.fullAddress || 'Click to select delivery location on interactive map'}
          >
            <div className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-primary-500/20 flex items-center justify-center shrink-0 transition-colors">
              <MapPin className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-[10px] text-blue-300 font-medium leading-none mb-0.5">
                {deliveryInfo.line1}
              </p>
              <p className="text-xs font-bold text-white truncate max-w-[130px] group-hover:text-blue-200 transition-colors">
                {deliveryInfo.line2}
              </p>
            </div>
          </button>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1">
            <SearchBar />
          </div>

          {/* Mobile search toggle */}
          <button
            type="button"
            className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto"
            onClick={() => setMobileSearchOpen(v => !v)}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">

            {/* Sell on JPP Market */}
            <Link
              to="/seller/register"
              className="hidden xl:flex items-center gap-1.5 text-white hover:text-blue-200 transition-colors text-xs px-2 py-1.5 flex-shrink-0"
            >
              <Store className="w-4 h-4" aria-hidden="true" />
              <span>Sell</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
            >
              <Heart className="w-5 h-5" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ', empty'}`}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-warning-500 text-navy-900 text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountMenu(v => !v)}
                aria-haspopup="true"
                aria-expanded={accountMenu}
                aria-label="Account menu"
                className="flex items-center gap-1.5 text-white hover:text-blue-200 transition-colors
                           p-1.5 rounded-lg hover:bg-white/10"
              >
                {isAuthenticated && user ? (
                  <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {getInitials(user.name)}
                  </div>
                ) : (
                  <User className="w-5 h-5" aria-hidden="true" />
                )}
                <ChevronDown className="w-3.5 h-3.5 hidden sm:block" aria-hidden="true" />
              </button>

              {/* Account dropdown */}
              {accountMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl
                              border border-surface-border animate-fade-in z-[1040] overflow-hidden"
                  role="menu"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-surface-border">
                        <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                      <nav className="py-1">
                        <Link to={dashboardLink} onClick={() => setAccountMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bg transition-colors"
                          role="menuitem">
                          <User className="w-4 h-4 text-text-muted" /> My Account
                        </Link>
                        <Link to="/account/orders" onClick={() => setAccountMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bg transition-colors"
                          role="menuitem">
                          <Package className="w-4 h-4 text-text-muted" /> My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setAccountMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bg transition-colors"
                          role="menuitem">
                          <Heart className="w-4 h-4 text-text-muted" /> Wishlist
                        </Link>
                        {(isAdmin || isSeller) && (
                          <Link
                            to={dashboardLink}
                            onClick={() => setAccountMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                            role="menuitem"
                          >
                            {isAdmin ? <Shield className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                            {isAdmin ? 'Admin Panel' : 'Seller Dashboard'}
                          </Link>
                        )}
                        <div className="border-t border-surface-border mt-1" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </nav>
                    </>
                  ) : (
                    <nav className="py-1">
                      <Link to="/login" onClick={() => setAccountMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                        role="menuitem">
                        <User className="w-4 h-4" /> Sign In
                      </Link>
                      <Link to="/register" onClick={() => setAccountMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-surface-bg transition-colors border-t border-surface-border"
                        role="menuitem">
                        Create Account
                      </Link>
                      <div className="border-t border-surface-border px-4 py-3">
                        <Link to="/seller/register" onClick={() => setAccountMenu(false)}
                          className="flex items-center gap-2 text-xs text-text-secondary hover:text-primary-600 transition-colors"
                          role="menuitem">
                          <Store className="w-3.5 h-3.5" /> Become a Seller
                        </Link>
                      </div>
                    </nav>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 animate-slide-down">
            <SearchBar mobile />
          </div>
        )}
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-800 border-t border-white/10 px-4 py-4 space-y-2 animate-slide-down">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openLocationModal('select');
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 text-left border border-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-[10px] text-blue-300 font-medium">{deliveryInfo.line1}</p>
              <p className="text-xs font-bold text-white truncate">{deliveryInfo.line2}</p>
            </div>
            <span className="text-[10px] font-bold text-primary-300 bg-primary-900/60 px-2 py-0.5 rounded-md">
              Change
            </span>
          </button>
          <MobileNavLinks onClose={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

function MobileNavLinks({ onClose }) {
  const links = [
    { to: '/categories', label: 'All Categories' },
    { to: '/category/electronics', label: 'Electronics' },
    { to: '/category/fashion', label: 'Fashion' },
    { to: '/category/home-kitchen', label: 'Home & Kitchen' },
    { to: '/category/beauty', label: 'Beauty & Care' },
    { to: '/category/sports', label: 'Sports & Fitness' },
    { to: '/category/books', label: 'Books' },
    { to: '/category/footwear', label: 'Footwear' },
    { to: '/deals', label: '🔥 Deals & Offers' },
    { to: '/seller/register', label: 'Sell on JPP Market' },
  ];
  return (
    <>
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          onClick={onClose}
          className="block px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {label}
        </Link>
      ))}
    </>
  );
}
