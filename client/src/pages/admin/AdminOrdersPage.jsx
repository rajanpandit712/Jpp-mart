import { useState, useEffect, useCallback } from 'react';
import {
  Search, ChevronLeft, ChevronRight, MapPin, Eye, X, ExternalLink,
  User, Phone, Package, Calendar, CreditCard,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_BADGE = {
  pending:    'bg-amber-900/40 text-amber-300 border border-amber-700/50',
  processing: 'bg-blue-900/40 text-blue-300 border border-blue-700/50',
  shipped:    'bg-purple-900/40 text-purple-300 border border-purple-700/50',
  delivered:  'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
  cancelled:  'bg-red-900/40 text-red-400 border border-red-700/50',
};

export default function AdminOrdersPage() {
  const [orders,   setOrders]   = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const limit = 15;

  const load = useCallback(() => {
    setLoading(true);
    adminService.getOrders({ page, limit })
      .then(r => {
        const d = r.data?.data;
        const p = r.data?.pagination;
        setOrders(Array.isArray(d) ? d : (d?.items || []));
        setTotal(p?.total ?? d?.total ?? (Array.isArray(d) ? d.length : 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await adminService.updateOrderStatus(id, status);
      toast.success('Order status updated');
      load();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(o =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingAddress?.city?.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingAddress?.pincode?.includes(search)
  );

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <AdminLayout title="Orders" subtitle={`${total} total orders on the platform`}>
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search order #, customer, city, PIN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Order #</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Delivery Location</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-500">No orders found.</td>
                    </tr>
                  ) : filtered.map(o => {
                    const s = o.shippingAddress || {};
                    return (
                      <tr key={o._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-indigo-400">{o.orderNumber}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-white font-medium">{o.customer?.name || s.fullName || '—'}</p>
                          <p className="text-xs text-slate-500">{o.customer?.email || s.phone}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {s.city ? `${s.city} (${s.pincode})` : s.pincode || '—'}
                            </span>
                          </div>
                          {s.latitude && s.longitude && (
                            <span className="text-[10px] text-emerald-400 font-mono">
                              GPS: {s.latitude.toFixed(2)}, {s.longitude.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-white">{formatCurrency(o.total || 0)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`capitalize px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[o.orderStatus] || 'bg-slate-800 text-slate-300'}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">{formatDate(o.createdAt)}</td>
                        <td className="px-5 py-3.5 text-right flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewOrder(o)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View full order details & delivery map"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            disabled={updating === o._id}
                            defaultValue={o.orderStatus}
                            onChange={e => updateStatus(o._id, e.target.value)}
                            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map(status => (
                              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
              <span className="text-xs text-slate-500">Page {page} of {totalPages} · {total} orders</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details & Delivery Location Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="font-bold text-base text-white">Order {viewOrder.orderNumber}</h3>
                <p className="text-xs text-slate-400">Placed on {formatDate(viewOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => setViewOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Address & GPS Coordinates */}
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>Shipping Destination</span>
                  </div>
                  {viewOrder.shippingAddress?.type && (
                    <span className="text-[10px] font-bold uppercase bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                      {viewOrder.shippingAddress.type}
                    </span>
                  )}
                </div>

                <div className="pt-1 text-xs space-y-1">
                  <p className="font-bold text-sm text-white">
                    {viewOrder.shippingAddress?.fullName || viewOrder.customer?.name}
                  </p>
                  <p className="text-slate-300">
                    {viewOrder.shippingAddress?.houseNumber ? `${viewOrder.shippingAddress.houseNumber}, ` : ''}
                    {viewOrder.shippingAddress?.buildingName ? `${viewOrder.shippingAddress.buildingName}, ` : ''}
                    {viewOrder.shippingAddress?.addressLine1}
                    {viewOrder.shippingAddress?.addressLine2 ? `, ${viewOrder.shippingAddress.addressLine2}` : ''}
                  </p>
                  <p className="text-slate-300">
                    {viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.state} – <span className="font-bold text-white">{viewOrder.shippingAddress?.pincode}</span>
                  </p>
                  {viewOrder.shippingAddress?.landmark && (
                    <p className="text-slate-400 text-[11px]">
                      Landmark: {viewOrder.shippingAddress.landmark}
                    </p>
                  )}
                  <p className="text-slate-400 pt-1">
                    Phone: {viewOrder.shippingAddress?.phone}
                  </p>

                  {/* Coordinates & Map Link */}
                  {viewOrder.shippingAddress?.latitude && viewOrder.shippingAddress?.longitude ? (
                    <div className="pt-2 mt-2 border-t border-slate-700/50 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400">
                        GPS: {viewOrder.shippingAddress.latitude.toFixed(5)}, {viewOrder.shippingAddress.longitude.toFixed(5)}
                      </span>
                      <a
                        href={`https://www.google.com/maps?q=${viewOrder.shippingAddress.latitude},${viewOrder.shippingAddress.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold border border-indigo-500/40 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>Open Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Items</p>
                <div className="divide-y divide-slate-800 text-xs">
                  {viewOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="min-w-0 pr-3">
                        <p className="font-medium text-white line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-slate-200 shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between font-bold text-sm text-white">
                  <span>Grand Total</span>
                  <span className="text-emerald-400">{formatCurrency(viewOrder.total || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}