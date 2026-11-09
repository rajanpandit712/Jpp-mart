import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);  // true while checking session
  const [error,   setError]   = useState(null);

  // ── Bootstrap: load current user on mount ────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('jpp_access_token');
    if (!token) { setLoading(false); return; }

    authService.me()
      .then(({ data }) => setUser(data.data?.user || null))
      .catch(() => {
        localStorage.removeItem('jpp_access_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials, role = 'customer') => {
    setError(null);
    try {
      const svc = role === 'admin'  ? authService.adminLogin  :
                  role === 'seller' ? authService.sellerLogin  :
                                      authService.login;
      const { data } = await svc(credentials);
      const token = data.data?.accessToken || data.data?.token;
      const userData = data.data?.user;
      if (token) {
        localStorage.setItem('jpp_access_token', token);
      }
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (formData, role = 'customer') => {
    setError(null);
    try {
      const svc = role === 'seller' ? authService.sellerRegister : authService.register;
      const { data } = await svc(formData);
      const token = data.data?.accessToken || data.data?.token;
      const userData = data.data?.user;
      if (token) {
        localStorage.setItem('jpp_access_token', token);
        setUser(userData);
      }
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('jpp_access_token');
    setUser(null);
  }, []);

  // ── Update local user data (after profile edit etc.) ─────────────────────
  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ── Derived helpers ───────────────────────────────────────────────────────
  const isAuthenticated = Boolean(user);
  const isCustomer      = user?.role === 'customer';
  const isSeller        = user?.role === 'seller';
  const isAdmin         = user?.role === 'admin';
  const isApprovedSeller= isSeller && user?.sellerStatus === 'approved';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated,
      isCustomer,
      isSeller,
      isAdmin,
      isApprovedSeller,
      login,
      register,
      logout,
      updateUser,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Named hook for consuming the context ──────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || {};
}

export default AuthContext;
