import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Context Providers
import { AuthProvider }     from './context/AuthContext';
import { CartProvider }     from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LocationProvider } from './context/LocationContext';
import LocationPickerModal from './components/location/LocationPickerModal';

// Layouts
import MainLayout    from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Eagerly loaded pages (small, needed immediately)
import HomePage from './pages/HomePage';

// Lazily loaded pages (code-split by route)
const LoginPage             = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage          = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage    = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage     = lazy(() => import('./pages/auth/ResetPasswordPage'));
const SellerLoginPage       = lazy(() => import('./pages/auth/SellerLoginPage'));
const SellerRegisterPage    = lazy(() => import('./pages/auth/SellerRegisterPage'));
const AdminLoginPage        = lazy(() => import('./pages/auth/AdminLoginPage'));

const ProductListPage       = lazy(() => import('./pages/customer/ProductListPage'));
const ProductDetailPage     = lazy(() => import('./pages/customer/ProductDetailPage'));
const SearchResultsPage     = lazy(() => import('./pages/customer/SearchResultsPage'));
const CategoryPage          = lazy(() => import('./pages/customer/CategoryPage'));
const CartPage              = lazy(() => import('./pages/customer/CartPage'));
const CheckoutPage          = lazy(() => import('./pages/customer/CheckoutPage'));
const WishlistPage          = lazy(() => import('./pages/customer/WishlistPage'));
const DealsPage             = lazy(() => import('./pages/customer/DealsPage'));

// Customer account (protected)
const AccountPage           = lazy(() => import('./pages/customer/AccountPage'));
const OrdersPage            = lazy(() => import('./pages/customer/OrdersPage'));
const OrderDetailPage       = lazy(() => import('./pages/customer/OrderDetailPage'));
const AddressPage           = lazy(() => import('./pages/customer/AddressPage'));

// Seller dashboard (protected – seller role)
const SellerDashboard       = lazy(() => import('./pages/seller/SellerDashboard'));
const SellerProductsPage    = lazy(() => import('./pages/seller/SellerProductsPage'));
const SellerAddProductPage  = lazy(() => import('./pages/seller/SellerAddProductPage'));
const SellerOrdersPage      = lazy(() => import('./pages/seller/SellerOrdersPage'));
const SellerProfilePage     = lazy(() => import('./pages/seller/SellerProfilePage'));

// Admin dashboard (protected – admin role)
const AdminDashboard        = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCustomersPage    = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminSellersPage      = lazy(() => import('./pages/admin/AdminSellersPage'));
const AdminProductsPage     = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminOrdersPage       = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCategoriesPage   = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminCouponsPage      = lazy(() => import('./pages/admin/AdminCouponsPage'));

// Misc
const NotFoundPage          = lazy(() => import('./pages/NotFoundPage'));

// ─── Suspense fallback ────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" aria-label="Loading page" />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <LocationProvider>
              <LocationPickerModal />
              <Suspense fallback={<PageLoader />}>
                <Routes>

                {/* ── Public routes with main layout ── */}
                <Route element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products"             element={<ProductListPage />} />
                  <Route path="products/:slug"       element={<ProductDetailPage />} />
                  <Route path="product/:slug"        element={<ProductDetailPage />} />
                  <Route path="search"               element={<SearchResultsPage />} />
                  <Route path="category/:slug"       element={<CategoryPage />} />
                  <Route path="categories"           element={<CategoryPage />} />
                  <Route path="cart"                 element={<CartPage />} />
                  <Route path="wishlist"             element={<WishlistPage />} />
                  <Route path="deals"                element={<DealsPage />} />

                  {/* Auth pages (no redirect if already logged in – handled inside each page) */}
                  <Route path="login"                element={<LoginPage />} />
                  <Route path="register"             element={<RegisterPage />} />
                  <Route path="forgot-password"      element={<ForgotPasswordPage />} />
                  <Route path="reset-password"       element={<ResetPasswordPage />} />

                  {/* Customer protected pages */}
                  <Route element={<ProtectedRoute redirectTo="/login" />}>
                    <Route path="checkout"           element={<CheckoutPage />} />
                    <Route path="account"            element={<AccountPage />} />
                    <Route path="account/orders"     element={<OrdersPage />} />
                    <Route path="account/orders/:id" element={<OrderDetailPage />} />
                    <Route path="account/addresses"  element={<AddressPage />} />
                  </Route>
                </Route>

                {/* ── Seller auth (standalone, no main layout) ── */}
                <Route path="seller/login"           element={<SellerLoginPage />} />
                <Route path="seller/register"        element={<SellerRegisterPage />} />

                {/* ── Seller dashboard (protected) ── */}
                <Route element={<ProtectedRoute role="seller" redirectTo="/seller/login" />}>
                  <Route path="seller/dashboard"      element={<SellerDashboard />} />
                  <Route path="seller/products"       element={<SellerProductsPage />} />
                  <Route path="seller/products/add"   element={<SellerAddProductPage />} />
                  <Route path="seller/products/:id/edit" element={<SellerAddProductPage />} />
                  <Route path="seller/orders"         element={<SellerOrdersPage />} />
                  <Route path="seller/profile"        element={<SellerProfilePage />} />
                </Route>

                {/* ── Admin auth ── */}
                <Route path="admin/login"            element={<AdminLoginPage />} />

                {/* ── Admin dashboard (protected) ── */}
                <Route element={<ProtectedRoute role="admin" redirectTo="/admin/login" />}>
                  <Route path="admin/dashboard"        element={<AdminDashboard />} />
                  <Route path="admin/customers"        element={<AdminCustomersPage />} />
                  <Route path="admin/sellers"          element={<AdminSellersPage />} />
                  <Route path="admin/products"         element={<AdminProductsPage />} />
                  <Route path="admin/orders"           element={<AdminOrdersPage />} />
                  <Route path="admin/categories"       element={<AdminCategoriesPage />} />
                  <Route path="admin/coupons"          element={<AdminCouponsPage />} />
                </Route>

                {/* ── 404 ── */}
                <Route path="*" element={<NotFoundPage />} />

              </Routes>
            </Suspense>
          </LocationProvider>
        </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
