import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services';
import { useAuth } from './AuthContext';
import { safeJsonParse } from '../utils/helpers';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'jpp_guest_cart';

function calcTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + ((i.price ?? i.product?.price ?? 0) * (i.quantity || 1)), 0);
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  return { subtotal, itemCount };
}

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();

  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [coupon,   setCoupon]   = useState(null);
  const [totals,   setTotals]   = useState({ subtotal: 0, itemCount: 0 });

  // Keep totals in sync
  useEffect(() => {
    setTotals(calcTotals(items));
  }, [items]);

  // ── Load cart ──────────────────────────────────────────────────────────────
  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const { data } = await cartService.get();
        setItems(data.data?.items || []);
        setCoupon(data.data?.coupon || null);
      } catch { setItems([]); }
      finally { setLoading(false); }
    } else {
      // Guest cart from localStorage
      const saved = safeJsonParse(localStorage.getItem(GUEST_CART_KEY), []);
      setItems(Array.isArray(saved) ? saved : []);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadCart(); }, [loadCart]);

  // Persist guest cart
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  // ── Add item ───────────────────────────────────────────────────────────────
  const addItem = useCallback(async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const { data } = await cartService.addItem({ productId: product._id, quantity });
        setItems(data.data?.items || []);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || 'Could not add to cart' };
      }
    } else {
      // Guest cart
      setItems(prev => {
        const existing = prev.find(i => (i.productId || i.product?._id) === product._id);
        if (existing) {
          return prev.map(i =>
            (i.productId || i.product?._id) === product._id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 99) }
              : i
          );
        }
        const rawImg = product.images?.[0];
        const imgUrl = typeof rawImg === 'string' ? rawImg : (rawImg?.url || '');
        const pTitle = product.title || product.name || 'Product';
        return [...prev, {
          _id: product._id,
          productId: product._id,
          title:     pTitle,
          name:      pTitle,
          slug:      product.slug,
          image:     imgUrl,
          images:    product.images || [],
          price:     product.price,
          mrp:       product.mrp || product.price,
          stock:     product.stock ?? 10,
          quantity,
          seller:    product.seller,
        }];
      });
      return { success: true };
    }
  }, [isAuthenticated]);

  // ── Update quantity ────────────────────────────────────────────────────────
  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return;
    if (isAuthenticated) {
      try {
        const { data } = await cartService.updateItem(itemId, { quantity });
        setItems(data.data?.items || []);
      } catch {}
    } else {
      setItems(prev => prev.map(i =>
        (i.productId === itemId || i._id === itemId)
          ? { ...i, quantity }
          : i
      ));
    }
  }, [isAuthenticated]);

  // ── Remove item ────────────────────────────────────────────────────────────
  const removeItem = useCallback(async (itemId) => {
    if (isAuthenticated) {
      try {
        const { data } = await cartService.removeItem(itemId);
        setItems(data.data?.items || []);
      } catch {}
    } else {
      setItems(prev => prev.filter(i => i.productId !== itemId && i._id !== itemId));
    }
  }, [isAuthenticated]);

  // ── Clear cart ─────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try { await cartService.clear(); } catch {}
    }
    setItems([]);
    setCoupon(null);
  }, [isAuthenticated]);

  // ── Apply coupon ───────────────────────────────────────────────────────────
  const applyCoupon = useCallback(async (code) => {
    if (!isAuthenticated) return { success: false, error: 'Sign in to use coupons' };
    try {
      const { data } = await cartService.applyCoupon(code);
      setCoupon(data.data?.coupon || null);
      return { success: true, coupon: data.data?.coupon };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Invalid coupon' };
    }
  }, [isAuthenticated]);

  const removeCoupon = useCallback(async () => {
    if (isAuthenticated) { try { await cartService.removeCoupon(); } catch {} }
    setCoupon(null);
  }, [isAuthenticated]);

  // Discount amount
  const discountAmount = coupon
    ? coupon.type === 'percentage'
      ? Math.min(totals.subtotal * coupon.value / 100, coupon.maxDiscount || Infinity)
      : coupon.value
    : 0;

  const finalTotal = Math.max(totals.subtotal - discountAmount, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      coupon,
      totals,
      discountAmount,
      finalTotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      loadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  return ctx || {};
}

export default CartContext;
