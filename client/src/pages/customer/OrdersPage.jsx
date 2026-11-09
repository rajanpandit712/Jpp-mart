import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ChevronRight, Clock, CheckCircle2, XCircle, Truck,
  AlertCircle, ArrowRight, ShoppingBag, Eye,
} from 'lucide-react';
import { orderService } from '../../services';
import { formatCurrency } from '../../utils/helpers';
import Pagination from '../../components/common/Pagination';

const STATUS_BADGES = {
  placed: { label: 'Order Placed', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: CheckCircle2 },
  processing: { label: 'Processing', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchOrders = (page = 1) => {
    setLoading(true);
    orderService.getMyOrders({ page, limit: 10 })
      .then((res) => {
        const data = res.data;
        setOrders(data.data || []);
        if (data.pagination) setPagination(data.pagination);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-surface-border py-4">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-1" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/account" className="hover:text-primary-600">Account</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-primary font-medium">My Orders</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Order History
          </h1>
        </div>
      </div>

      <div className="container-main pt-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-surface-border animate-pulse h-32" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-surface-border rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">No Orders Found</h2>
            <p className="text-sm text-text-muted mb-6">
              You haven't placed any orders yet. Discover our latest collections and best sellers today!
            </p>
            <Link
              to="/products"
              className="inline-flex px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusCfg = STATUS_BADGES[order.orderStatus] || STATUS_BADGES.placed;
              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white border border-surface-border rounded-2xl p-5 sm:p-6 shadow-xs hover:border-gray-300 transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-border">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-text-primary">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-text-muted">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusCfg.label}</span>
                      </span>
                      <Link
                        to={`/account/orders/${order._id}`}
                        className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Snapshot */}
                  <div className="py-4 divide-y divide-surface-border/50">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-surface-border shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <ShoppingBag className="w-5 h-5 text-text-muted" />
                            </div>
                          )}
                          <div className="truncate">
                            <p className="font-semibold text-text-primary truncate text-sm">{item.title}</p>
                            <p className="text-text-muted">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-text-primary shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                    <span className="text-text-muted">
                      Paid via <strong className="uppercase text-text-secondary">{order.payment?.method || 'COD'}</strong>
                    </span>
                    <div className="text-right">
                      <span className="text-text-muted mr-2">Total Amount:</span>
                      <span className="text-base font-extrabold text-text-primary">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={fetchOrders}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}