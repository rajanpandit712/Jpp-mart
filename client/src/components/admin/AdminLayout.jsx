import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, Package, ShoppingBag,
  Tag, Ticket, ShieldCheck, LogOut, ArrowLeft, Menu, X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/customers',  icon: Users,            label: 'Customers' },
  { to: '/admin/sellers',    icon: Store,            label: 'Sellers' },
  { to: '/admin/products',   icon: Package,          label: 'Products' },
  { to: '/admin/orders',     icon: ShoppingBag,      label: 'Orders' },
  { to: '/admin/categories', icon: Tag,              label: 'Categories' },
  { to: '/admin/coupons',    icon: Ticket,           label: 'Coupons' },
];

export default function AdminLayout({ children, title, subtitle }) {
  const { logout, user } = useAuth();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open admin navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm text-white tracking-tight">Admin Panel</span>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-all shadow-xs"
          title="Return to customer homepage"
        >
          <Store className="w-3.5 h-3.5 text-indigo-400" />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Fixed on Desktop, Slide-over Drawer on Mobile) */}
      <aside
        className={`w-64 md:w-60 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-50 md:z-20 transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/jpp-mart-logo.jpg" alt="JPP Mart" className="h-9 w-auto object-contain" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Back to Store Primary Action Button */}
        <div className="px-3 pt-3 pb-2 border-b border-slate-800/80 shrink-0">
          <Link
            to="/"
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/70 hover:bg-slate-800 hover:text-white border border-slate-700/60 hover:border-indigo-500/50 transition-all duration-200 shadow-xs"
            title="Exit admin panel and return to JPP Mart homepage"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/25 group-hover:text-indigo-300 transition-colors shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1 text-xs font-medium text-slate-300 group-hover:text-white">
              Back to Store
            </span>
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <div className="px-3 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Management
          </div>
          {NAV.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Sign Out Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-tight truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-60 flex-1 min-h-screen flex flex-col">
        {/* Page Header */}
        {(title || subtitle) && (
          <div className="bg-slate-900/50 border-b border-slate-800 px-6 sm:px-8 py-5 flex items-center justify-between gap-4">
            <div>
              {title && <h1 className="text-xl font-black text-white">{title}</h1>}
              {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
            </div>
            {/* Header 'View Store' Button */}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 hover:border-indigo-500/50 transition-all shadow-xs shrink-0"
              title="Return to customer homepage"
            >
              <Store className="w-4 h-4 text-indigo-400" />
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        )}
        <div className="p-6 sm:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
