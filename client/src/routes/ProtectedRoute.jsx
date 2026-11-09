import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute – redirects unauthenticated users to login.
 * @param {string} role - 'customer' | 'seller' | 'admin' | null (any auth)
 * @param {string} redirectTo - path to redirect to if not authorized
 */
export default function ProtectedRoute({
  role = null,
  redirectTo = '/login',
}) {
  const { isAuthenticated, isAdmin, isSeller, isCustomer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (role === 'admin'  && !isAdmin)    return <Navigate to="/"              replace />;
  if (role === 'seller' && !isSeller)   return <Navigate to="/seller/login"  replace />;
  if (role === 'customer' && !isCustomer) return <Navigate to="/"            replace />;

  return <Outlet />;
}
