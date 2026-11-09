import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package, ChevronRight, CheckCircle2, Clock, Truck, XCircle,
  MapPin, CreditCard, ArrowLeft, AlertCircle, RefreshCcw,
} from 'lucide-react';
import { orderService } from '../../services';
import { formatCurrency } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['placed', 'confirmed', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setLoading(true);
    orderService.getById(id)
      .then((res) => setOrder(res.data?.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    setCancelling(true);
    try {
      const res = await orderService.cancel(id, cancelReason);
      setOrder(res.data?.data);
      setCancelModalOpen(false);
      toast.success('Order has been cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container-main py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-text-muted">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-main py-16 text-center">
        <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-text-primary mb-2">Order Not Found</h2>
        <p className="text-sm text-text-muted mb-6">We couldn't locate this order.</p>
        <Link to="/account/orders" className="px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl text-sm">
          Back to Orders
        </Link>
      </div>
    );
  }

  const {
    orderNumber,
    orderStatus,
    createdAt,
    items = [],
    shippingAddress,
    payment,
    subtotal,
    discount,
    shippingFee,
    total,
  } = order;

  const isCancelled = orderStatus === 'cancelled';
  const currentStepIdx = STATUS_STEPS.indexOf(orderStatus);
  const canCancel = ['placed', 'confirmed'].includes(orderStatus);

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-surface-border py-4">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-1" aria-label="Breadcrumb">
            <Link to="/account/orders" className="hover:text-primary-600">My Orders</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-primary font-medium">{orderNumber}</span>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                Order #{orderNumber}
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                Placed on {new Date(createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-main pt-8 space-y-6">
        {/* Status Timeline Card */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-text-primary mb-6 uppercase tracking-wider text-xs">
            Order Progress
          </h2>

          {isCancelled ? (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
              <XCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">Order Cancelled</p>
                <p className="text-xs text-rose-600">{order.cancelReason || 'This order was cancelled.'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 relative">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        isPassed
                          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                          : 'bg-gray-100 text-text-muted border border-surface-border'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-semibold capitalize ${isPassed ? 'text-text-primary' : 'text-text-muted'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2-Column: Items vs Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order Items (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-surface-border rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-surface-border font-bold text-sm text-text-primary">
              Order Items ({items.length})
            </div>
            <div className="divide-y divide-surface-border p-4 sm:p-5 space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image && (
                      <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-surface-border shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="font-semibold text-text-primary text-sm truncate">{item.title}</p>
                      <p className="text-text-muted mt-0.5">Unit Price: {formatCurrency(item.price)}</p>
                      <p className="text-text-muted">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-text-primary shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span>Shipping Address</span>
              </div>
              {shippingAddress && (
                <div className="text-xs text-text-secondary leading-relaxed">
                  <p className="font-bold text-text-primary mb-0.5">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.addressLine1}</p>
                  {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                  <p>{shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pincode}</p>
                  <p className="text-text-muted mt-2">Mobile: {shippingAddress.phone}</p>
                </div>
              )}
            </div>

            {/* Payment & Totals */}
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                <CreditCard className="w-4 h-4 text-primary-600" />
                <span>Payment & Invoicing</span>
              </div>
              <p className="text-xs text-text-muted mb-4">
                Method: <strong className="uppercase text-text-primary">{payment?.method || 'COD'}</strong>
                <span className="ml-2 font-medium">({payment?.status || 'pending'})</span>
              </p>

              <div className="space-y-2 py-3 border-t border-b border-surface-border text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-primary">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(shippingFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-3">
                <span className="text-sm font-extrabold text-text-primary">Total Paid</span>
                <span className="text-xl font-black text-text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Cancel Order"
        >
          <form onSubmit={handleCancelOrder} className="space-y-4 pt-2">
            <p className="text-xs text-text-muted">
              Are you sure you want to cancel order #{orderNumber}? This action cannot be undone.
            </p>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Reason for Cancellation</label>
              <textarea
                rows={3}
                required
                placeholder="Please tell us why you are cancelling..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-surface-border rounded-xl outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 border border-surface-border rounded-xl text-xs font-semibold text-text-secondary"
              >
                Keep Order
              </button>
              <button
                type="submit"
                disabled={cancelling}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}