import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Plus, Minus, Check } from 'lucide-react';
import { formatCurrency, calcDiscountPct, truncate } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';
import QuickViewModal from './QuickViewModal';
import toast from 'react-hot-toast';

/**
 * ProductCard – core interactive card used in all product grids.
 */
export default function ProductCard({ product, className = '' }) {
  const { addItem, updateQuantity, items = [] } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  if (!product) return null;

  const {
    _id,
    slug,
    price,
    mrp,
    brand,
    stock = 0,
    isFeatured,
    isBestSeller,
    isDealOfTheDay,
  } = product;

  const displayName = product.title || product.name || 'Product';
  const displayRating = product.ratings?.average ?? product.rating ?? 0;
  const displayReviewCount = product.ratings?.count ?? product.reviewCount ?? 0;

  const discPct = calcDiscountPct(mrp, price);
  const wishlisted = isWishlisted(_id);
  const outOfStock = stock === 0;

  // Check if this item is currently in the shopping cart
  const cartItem = items.find(
    (i) => i.productId === _id || i.product?._id === _id || (i.product && i.product.toString() === _id.toString())
  );
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    setAdding(true);
    const result = await addItem(product, 1);
    setAdding(false);
    if (result.success) {
      toast.success('Added to cart!', { duration: 1500 });
    } else {
      toast.error(result.error || 'Could not add to cart');
    }
  };

  const handleUpdateQty = async (e, newQty) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) return;
    const itemId = cartItem._id || cartItem.productId;
    await updateQuantity(itemId, newQty);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast('Sign in to save to wishlist', { icon: '💡' });
      return;
    }
    const result = await toggle(_id);
    if (result.success) {
      toast.success(result.added ? 'Added to wishlist' : 'Removed from wishlist', { duration: 1200 });
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const rawImage = product.images?.[0];
  const imageUrl =
    !imgError && rawImage
      ? typeof rawImage === 'string'
        ? rawImage
        : rawImage.url
      : null;

  return (
    <>
      <div
        className={`group card-hover relative flex flex-col justify-between overflow-hidden
                    rounded-2xl border border-surface-border bg-white shadow-xs
                    hover:shadow-md transition-all duration-200 ${className}`}
      >
        <Link
          to={`/products/${slug || _id}`}
          className="block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-t-2xl"
          aria-label={`View ${displayName}`}
        >
          {/* Image Container */}
          <div className="relative aspect-square bg-gray-50/70 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <Eye className="w-10 h-10 text-gray-300" aria-hidden="true" />
              </div>
            )}

            {/* Badges Stack */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
              {discPct > 0 && (
                <Badge variant="error" className="text-[11px] font-bold shadow-xs">
                  {discPct}% OFF
                </Badge>
              )}
              {isDealOfTheDay && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-white shadow-xs tracking-wider uppercase">
                  Deal
                </span>
              )}
              {isBestSeller && !isDealOfTheDay && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs tracking-wider uppercase">
                  Top Seller
                </span>
              )}
              {isFeatured && !isBestSeller && !isDealOfTheDay && (
                <Badge variant="teal" className="text-[10px] shadow-xs">
                  Featured
                </Badge>
              )}
            </div>

            {/* Top Right: Wishlist button */}
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={wishlisted}
              className={`absolute top-2 right-2 p-2 rounded-full shadow-sm border z-10
                          transition-all duration-150 active:scale-90
                          ${
                            wishlisted
                              ? 'bg-error-50 border-error-200 text-error-500'
                              : 'bg-white/90 backdrop-blur-xs border-surface-border text-text-muted hover:text-error-500 hover:border-error-200 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100'
                          }`}
            >
              <Heart
                className="w-3.5 h-3.5 transition-transform hover:scale-110"
                fill={wishlisted ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
            </button>

            {/* Quick View Button Hover Overlay */}
            <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 px-3">
              <button
                type="button"
                onClick={handleQuickView}
                className="w-full py-1.5 px-3 bg-white/95 backdrop-blur-xs hover:bg-white text-text-primary text-xs font-semibold rounded-lg shadow-md border border-surface-border flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-primary-600" />
                <span>Quick View</span>
              </button>
            </div>

            {/* Out of stock overlay */}
            {outOfStock && (
              <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
                <span className="text-xs font-bold text-text-secondary bg-white px-2.5 py-1 rounded-full border shadow-xs">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Details info */}
          <div className="p-3 pb-1">
            {brand && (
              <p className="text-[11px] font-bold text-text-muted mb-0.5 uppercase tracking-wide">
                {brand}
              </p>
            )}

            <h3 className="text-sm font-medium text-text-primary leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
              {truncate(displayName, 60)}
            </h3>

            {/* Rating & Urgency (Flipkart Style) */}
            <div className="flex items-center justify-between gap-1 mt-1 mb-1.5">
              {displayRating > 0 ? (
                <div className="flex items-center gap-1.5">
                  <div className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white px-1.5 py-0.5 rounded-sm text-[11px] font-bold shadow-2xs">
                    <span>{displayRating.toFixed(1)}</span>
                    <Star className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
                  </div>
                  {displayReviewCount > 0 && (
                    <span className="text-[11px] text-text-muted">
                      ({displayReviewCount > 999 ? `${(displayReviewCount / 1000).toFixed(1)}k` : displayReviewCount})
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[10px] text-text-muted italic">New Launch</span>
              )}

              {/* Stock urgency indicator */}
              {!outOfStock && stock <= 5 && (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  Only {stock} left
                </span>
              )}
            </div>

            {/* Price Row (Flipkart / Amazon Style) */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base font-extrabold text-text-primary">
                {formatCurrency(price)}
              </span>
              {mrp > price && (
                <>
                  <span className="text-xs text-text-muted line-through">
                    {formatCurrency(mrp)}
                  </span>
                  <span className="text-xs font-bold text-[#388e3c]">
                    {discPct}% off
                  </span>
                </>
              )}
            </div>

            {/* Free Delivery Tag */}
            <div className="mt-1 flex items-center gap-1 text-[11px] text-text-muted">
              <span className="text-gray-600 font-medium">Free delivery</span>
            </div>
          </div>
        </Link>

        {/* Action Button: Add to Cart or Interactive In-Cart Stepper */}
        <div className="p-3 pt-2">
          {inCartQty > 0 ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-1">
              <button
                type="button"
                onClick={(e) => handleUpdateQty(e, inCartQty - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-emerald-800 shadow-2xs hover:bg-emerald-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                {inCartQty} in Cart
              </span>
              <button
                type="button"
                onClick={(e) => handleUpdateQty(e, inCartQty + 1)}
                disabled={inCartQty >= stock}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-emerald-800 shadow-2xs hover:bg-emerald-100 transition-colors disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock || adding}
              aria-label={`Add ${displayName} to cart`}
              className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold
                          rounded-lg border transition-all duration-150 shadow-2xs
                          ${
                            outOfStock
                              ? 'bg-surface-bg text-text-muted border-surface-border cursor-not-allowed'
                              : 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 active:scale-[0.98]'
                          }`}
            >
              {adding ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {outOfStock ? 'Out of Stock' : adding ? 'Adding…' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>

      {/* Quick View Interactive Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
