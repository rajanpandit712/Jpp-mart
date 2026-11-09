import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronRight, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/products/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton';

export default function WishlistPage() {
  const { wishlistProducts, loading, reload } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    reload();
  }, [reload]);

  if (!isAuthenticated) {
    return (
      <div className="bg-surface-bg min-h-screen py-16">
        <div className="container-main max-w-md mx-auto text-center bg-white border border-surface-border rounded-3xl p-10 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary mb-2">Save Your Favorite Items</h1>
          <p className="text-sm text-text-muted mb-6">
            Sign in to track your saved items and access your wishlist across all your devices.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-surface-border py-4">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-1" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-primary font-medium">My Wishlist</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              My Wishlist ({wishlistProducts.length})
            </h1>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
            >
              <span>Explore More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container-main pt-8">
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-white border border-surface-border rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Your Wishlist is Empty</h2>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Explore our trending collections and tap the heart icon on any product to save it here for later.
            </p>
            <Link
              to="/products"
              className="inline-flex px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm text-sm"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((p) => (
              <ProductCard key={p._id} product={p} className="bg-white border border-surface-border shadow-xs" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}