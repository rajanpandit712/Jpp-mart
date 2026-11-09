import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Store, Package, ShoppingBag, DollarSign, TrendingUp, ChevronRight,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/helpers';

const STATUS_BADGE = {
  pending:    'bg-amber-900/40 text-amber-300 border border-amber-700/50',
  processing: 'bg-blue-900/40 text-blue-300 border border-blue-700/50',
  shipped:    'bg-purple-900/40 text-purple-300 border border-purple-700/50',
  delivered:  'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
  cancelled:  'bg-red-900/40 text-red-300 border border-red-700/50',
};

export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(r => setData(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), icon: DollarSign,  color: 'text-emerald-400', bg: 'from-emerald-900/20' },
    { label: 'Customers',     value: stats.totalCustomers || 0,               icon: Users,        color: 'text-sky-400',     bg: 'from-sky-900/20' },
    { label: 'Sellers',       value: stats.totalSellers   || 0,               icon: Store,        color: 'text-violet-400',  bg: 'from-violet-900/20' },
    { label: 'Products',      value: stats.totalProducts  || 0,               icon: Package,      color: 'text-amber-400',   bg: 'from-amber-900/20' },
    { label: 'Orders',        value: stats.totalOrders    || 0,               icon: ShoppingBag,  color: 'text-rose-400',    bg: 'from-rose-900/20' },
  ];

  return (
    <AdminLayout title="Dashboard Overview" subtitle="Platform-wide metrics and recent activity">
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-28 bg-slate-800 rounded-2xl animate-pulse" />)}
          </div>
          <div className="h-64 bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`bg-gradient-to-br ${bg} to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Recent Orders
              </h2>
              <Link to="/admin/orders" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {recentOrders.map(o => (
                      <tr key={o._id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 font-mono text-indigo-400 font-bold">{o.orderNumber}</td>
                        <td className="py-3">{o.customer?.name || '—'}</td>
                        <td className="py-3 font-semibold">{formatCurrency(o.total || 0)}</td>
                        <td className="py-3">
                          <span className={`capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_BADGE[o.orderStatus] || 'bg-slate-800 text-slate-300'}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{formatDate(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}