import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck,
  ChevronRight, ArrowLeft,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    totals,
    coupon,
    discountAmount,
    finalTotal,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const shippingFee = totals.subtotal >= 499 || totals.subtotal === 0 ? 0 : 49;
  const grandTotal = finalTotal + shippingFee;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    const result = await applyCoupon(couponCode.trim().toUpperCase());
    setApplyingCoupon(false);

    if (result.success) {
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } else {
      toast.error(result.error || 'Invalid coupon code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-surface-bg min-h-screen py-16">
        <div className="container-main max-w-xl mx-auto text-center bg-white border border-surface-border rounded-3xl p-10 sm:p-14 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary mb-2">Your Shopping Cart is Empty</h1>
          <p className="text-sm text-text-muted mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore thousands of handpicked products with exclusive deals!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-all"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-border py-4">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-1" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-primary font-medium">Shopping Cart</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Shopping Cart ({totals.itemCount} items)
          </h1>
        </div>
      </div>

      <div className="container-main pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-surface-border rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary">Cart Items</span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-error-600 hover:text-error-700 font-semibold transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-surface-border">
                {items.map((item) => {
                  const p = item.product || item;
                  const itemId = item._id || item.productId;
                  const itemTitle = p.title || p.name || item.name || 'Product';
                  const itemSlug = p.slug || item.slug;
                  const rawImg = p.images?.[0] || item.image || item.images?.[0];
                  const itemImg = typeof rawImg === 'string' ? rawImg : rawImg?.url;
                  const itemPrice = item.price ?? p.price ?? 0;
                  const itemMrp = item.mrp ?? p.mrp ?? itemPrice;
                  const itemStock = p.stock ?? item.stock ?? 10;

                  return (
                    <div key={itemId} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex gap-4 items-center flex-1 min-w-0">
                        {/* Thumbnail */}
                        <Link
                          to={itemSlug ? `/products/${itemSlug}` : '#'}
                          className="w-20 h-20 bg-gray-50 border border-surface-border rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
                        >
                          {itemImg ? (
                            <img src={itemImg} alt={itemTitle} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-8 h-8 text-text-muted" />
                          )}
                        </Link>

                        {/* Title & Price */}
                        <div className="min-w-0 flex-1">
                          <Link
                            to={itemSlug ? `/products/${itemSlug}` : '#'}
                            className="text-sm font-semibold text-text-primary hover:text-primary-600 line-clamp-2 leading-snug transition-colors"
                          >
                            {itemTitle}
                          </Link>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-base font-bold text-text-primary">
                              {formatCurrency(itemPrice)}
                            </span>
                            {itemMrp > itemPrice && (
                              <span className="text-xs text-text-muted line-through">
                                {formatCurrency(itemMrp)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls (Qty & Remove) */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-surface-border">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-surface-border rounded-lg bg-surface-bg p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 text-text-muted hover:text-text-primary disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-text-primary">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            disabled={item.quantity >= itemStock}
                            className="p-1.5 text-text-muted hover:text-text-primary disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subtotal & Delete */}
                        <div className="text-right min-w-[80px]">
                          <span className="text-sm font-bold text-text-primary block">
                            {formatCurrency(itemPrice * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(itemId)}
                            className="text-xs text-error-500 hover:text-error-700 font-medium inline-flex items-center gap-1 mt-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Right (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs sticky top-24">
              <h2 className="text-base font-extrabold text-text-primary pb-4 border-b border-surface-border">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div className="py-4 border-b border-surface-border">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-2 py-2 text-xs uppercase font-semibold tracking-wider rounded-xl border border-surface-border outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-surface-bg hover:bg-gray-200 border border-surface-border text-xs font-bold text-text-primary rounded-xl transition-colors disabled:opacity-40"
                  >
                    Apply
                  </button>
                </form>

                {coupon && (
                  <div className="mt-3 flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{coupon.code} applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-error-600 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 text-sm border-b border-surface-border">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-primary">{formatCurrency(totals.subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-text-secondary">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(shippingFee)}</span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex items-baseline justify-between py-4">
                <div>
                  <span className="text-base font-extrabold text-text-primary block">Total</span>
                  <span className="text-[11px] text-text-muted">Includes applicable taxes</span>
                </div>
                <span className="text-2xl font-black text-text-primary">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Secured Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}