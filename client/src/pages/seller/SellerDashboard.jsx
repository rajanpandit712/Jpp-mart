import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Package, ShoppingBag, AlertTriangle, Plus,
  Store, ChevronRight, DollarSign, Clock, CheckCircle2,
} from 'lucide-react';
import { sellerService } from '../../services';
import { formatCurrency } from '../../utils/helpers';

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      sellerService.getDashboard(),
      sellerService.getOrders(),
    ])
      .then(([dashRes, ordersRes]) => {
        setData(dashRes.data?.data);
        setOrders((ordersRes.data?.data || []).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-28 bg-slate-800 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const profile = data?.profile;
  const stats = data?.stats || {};

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* Top Navigation Bar */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-teal-400" />
            <span className="font-extrabold text-lg text-white">
              Seller Center <span className="text-teal-400 font-normal">| {profile?.storeName || 'My Store'}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/seller/products/add"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg border border-slate-700"
            >
              View Marketplace
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-700 pb-2 text-sm overflow-x-auto">
          <Link to="/seller/dashboard" className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold">
            Dashboard
          </Link>
          <Link to="/seller/products" className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 font-medium transition-colors">
            Products ({stats.totalProducts || 0})
          </Link>
          <Link to="/seller/orders" className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 font-medium transition-colors">
            Orders ({stats.totalOrders || 0})
          </Link>
          <Link to="/seller/profile" className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 font-medium transition-colors">
            Store Profile
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{formatCurrency(stats.totalRevenue || 0)}</p>
            <span className="text-xs text-emerald-400 mt-1 block font-medium">Realized from completed orders</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">{stats.totalOrders || 0}</p>
            <span className="text-xs text-slate-400 mt-1 block">
              {stats.pendingOrders || 0} orders pending dispatch
            </span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Catalog Products</span>
              <Package className="w-5 h-5 text-teal-400" />
            </div>
            <p className="text-2xl font-black text-white">{stats.totalProducts || 0}</p>
            <span className="text-xs text-teal-400 mt-1 block font-medium">{stats.totalItemsSold || 0} total units sold</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Inventory Status</span>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{stats.outOfStock || 0}</p>
            <span className={`text-xs mt-1 block font-medium ${stats.outOfStock > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {stats.outOfStock > 0 ? 'Products out of stock' : 'All products in stock'}
            </span>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
            <h2 className="text-base font-bold text-white tracking-tight">Recent Orders</h2>
            <Link to="/seller/orders" className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1">
              <span>View All Orders</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No orders have been placed yet for your items.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-slate-700 font-semibold">
                  <tr>
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-750">
                      <td className="py-3 font-mono font-bold text-teal-400">{o.orderNumber}</td>
                      <td className="py-3">{o.customer?.name || 'Customer'}</td>
                      <td className="py-3">{o.items?.length || 0} item(s)</td>
                      <td className="py-3">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700 text-slate-200">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}