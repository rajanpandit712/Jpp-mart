import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);             // array of product IDs
  const [wishlistProducts, setWishlistProducts] = useState([]); // full populated products
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setWishlistProducts([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await wishlistService.get();
      const rawList = data.data?.products || [];
      const ids = rawList.map(p => (p && p._id ? p._id.toString() : String(p)));
      setItems(ids);
      setWishlistProducts(rawList);
    } catch {
      setItems([]);
      setWishlistProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { load(); }, [load]);

  const isWishlisted = useCallback((productId) => {
    if (!productId) return false;
    const str = String(productId);
    return items.some(id => String(id) === str);
  }, [items]);

  const toggle = useCallback(async (productId) => {
    if (!isAuthenticated) return { success: false, requiresAuth: true };
    const strId = String(productId);
    const inList = items.some(id => String(id) === strId);
    try {
      if (inList) {
        await wishlistService.remove(strId);
        setItems(prev => prev.filter(id => String(id) !== strId));
        setWishlistProducts(prev => prev.filter(p => String(p?._id || p) !== strId));
      } else {
        await wishlistService.add(strId);
        setItems(prev => [...prev, strId]);
      }
      return { success: true, added: !inList };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  }, [isAuthenticated, items]);

  return (
    <WishlistContext.Provider value={{ items, wishlistProducts, loading, isWishlisted, toggle, reload: load }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  return ctx || {};
}

export default WishlistContext;
