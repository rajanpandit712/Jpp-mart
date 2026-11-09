import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, ArrowLeft, CheckCircle2, Clock, Truck,
  ChevronDown, User, MapPin,
} from 'lucide-react';
import { sellerService } from '../../services';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    sellerService.getOrders()
      .then((res) => setOrders(res.data?.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, itemId, newStatus) => {
    setUpdatingId(itemId);
    try {
      await sellerService.updateOrderStatus(orderId, itemId, { status: newStatus });
      toast.success('Order item status updated!');
      loadOrders();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* Top Bar */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/seller/dashboard" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-extrabold text-lg text-white">Merchant Order Management</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
            <h2 className="text-base font-bold text-white">Incoming Customer Orders ({orders.length})</h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-750 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No incoming orders</h3>
              <p className="text-xs text-slate-400">Orders placed by customers for your catalog will show up here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs">
                    <div>
                      <span className="font-mono font-bold text-teal-400 text-sm block">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-400">
                        {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block">Customer</span>
                      <span className="font-semibold text-white">{order.customer?.name} ({order.customer?.phone})</span>
                    </div>
                  </div>

                  {/* Destination info */}
                  {order.shippingAddress && (
                    <div className="py-3 text-xs text-slate-400 flex items-center gap-2 border-b border-slate-800">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>
                        Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                      </span>
                    </div>
                  )}

                  {/* Items */}
                  <div className="py-4 divide-y divide-slate-800">
                    {order.items?.map((item) => (
                      <div key={item._id} className="py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-800 border border-slate-700" />
                          )}
                          <div>
                            <p className="font-bold text-white text-sm">{item.title}</p>
                            <p className="text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-teal-400 text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </span>

                          {/* Status select */}
                          <select
                            value={item.status || 'placed'}
                            disabled={updatingId === item._id}
                            onChange={(e) => handleStatusUpdate(order._id, item._id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-xl py-1.5 px-3 focus:ring-1 focus:ring-teal-500 outline-none cursor-pointer"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}