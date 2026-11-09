import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, Star, Heart, ShoppingCart, Zap, CheckCircle2,
  Truck, ShieldCheck, ArrowRight, Eye, Plus, Minus,
} from 'lucide-react';
import { formatCurrency, calcDiscountPct } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';
import toast from 'react-hot-toast';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!isOpen || !product) return null;

  const {
    _id,
    title,
    slug,
    brand,
    mrp,
    price,
    stock = 0,
    ratings = { average: 0, count: 0 },
    highlights = [],
    images = [],
  } = product;

  const displayName = title || product.name || 'Product';
  const discPct = calcDiscountPct(mrp, price);
  const outOfStock = stock <= 0;
  const wishlisted = isWishlisted(_id);

  const imageUrls = (images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'])
    .map((img) => (typeof img === 'string' ? img : img.url));

  const activeImage = imageUrls[selectedImgIdx] || imageUrls[0];

  const handleAddToCart = async () => {
    if (outOfStock) return;
    setAdding(true);
    const result = await addItem(product, qty);
    setAdding(false);
    if (result.success) {
      toast.success(`Added ${qty} item(s) to cart!`);
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (outOfStock) return;
    setAdding(true);
    const result = await addItem(product, qty);
    setAdding(false);
    if (result.success) {
      onClose();
      navigate('/checkout');
    } else {
      toast.error(result.error || 'Failed to proceed');
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast('Sign in to save items to wishlist', { icon: '💡' });
      return;
    }
    const res = await toggle(_id);
    if (res.success) {
      toast.success(res.added ? 'Added to wishlist' : 'Removed from wishlist');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-surface-border text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-text-muted hover:text-text-primary bg-white/80 hover:bg-gray-100 rounded-full transition-colors border shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-surface-border">
              <img
                src={activeImage}
                alt={displayName}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {discPct > 0 && (
                <div className="absolute top-3 left-3">
                  <Badge variant="error" className="font-bold text-xs">
                    -{discPct}% OFF
                  </Badge>
                </div>
              )}

              {/* Wishlist button */}
              <button
                type="button"
                onClick={handleWishlist}
                className={`absolute top-3 right-3 p-2 rounded-full border shadow-xs transition-colors ${
                  wishlisted
                    ? 'bg-error-50 border-error-200 text-error-500'
                    : 'bg-white border-surface-border text-text-muted hover:text-error-500'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
              </button>

              {outOfStock && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <span className="font-bold text-sm bg-white px-3 py-1 rounded-full border shadow-xs text-error-600">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imageUrls.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-14 h-14 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImgIdx === idx
                        ? 'border-primary-600 ring-2 ring-primary-100'
                        : 'border-surface-border hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {brand && (
                <p className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-1">
                  {brand}
                </p>
              )}

              <h2 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug mb-2 line-clamp-2">
                {displayName}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-900">
                    {ratings.average > 0 ? ratings.average.toFixed(1) : 'New'}
                  </span>
                </div>
                {ratings.count > 0 && (
                  <span className="text-xs text-text-muted">
                    ({ratings.count.toLocaleString('en-IN')} ratings)
                  </span>
                )}
                <span className="text-gray-300">•</span>
                <span
                  className={`text-xs font-semibold ${
                    outOfStock
                      ? 'text-error-600'
                      : stock <= 5
                      ? 'text-amber-600'
                      : 'text-success-600'
                  }`}
                >
                  {outOfStock
                    ? 'Out of Stock'
                    : stock <= 5
                    ? `Only ${stock} left in stock!`
                    : 'In Stock'}
                </span>
              </div>

              {/* Price section */}
              <div className="flex items-baseline gap-3 mb-4 bg-surface-bg/60 p-3 rounded-xl border border-surface-border">
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                  {formatCurrency(price)}
                </span>
                {mrp > price && (
                  <>
                    <span className="text-sm text-text-muted line-through">
                      {formatCurrency(mrp)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Save {formatCurrency(mrp - price)}
                    </span>
                  </>
                )}
              </div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Highlights
                  </p>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    {highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Interactive Quantity & Add to Cart Controls */}
            <div className="pt-4 border-t border-surface-border space-y-3">
              {!outOfStock && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-text-secondary">Quantity:</span>
                  <div className="flex items-center border border-surface-border rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      className="p-1.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-semibold">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(stock, q + 1))}
                      disabled={qty >= stock}
                      className="p-1.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock || adding}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-[0.98] disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {adding ? 'Adding…' : 'Add to Cart'}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={outOfStock || adding}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-[0.98] disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buy Now
                </button>
              </div>

              {/* Full Details link */}
              <div className="text-center pt-2">
                <Link
                  to={`/products/${slug || _id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <span>View Full Product Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
