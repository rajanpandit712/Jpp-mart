import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin, CreditCard, ShieldCheck, CheckCircle2, Plus, ArrowRight,
  ShoppingBag, Truck, Lock, AlertCircle, ChevronRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import { userService, orderService, cartService } from '../../services';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totals, discountAmount, finalTotal, clearCart, loadCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const { openLocationModal, selectedLocation, setSelectedLocation, savedAddresses } = useLocationContext();

  // New address form
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
  });

  // Load saved addresses and ensure backend cart has items
  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0) {
      setAddresses(savedAddresses);
      setLoadingAddresses(false);
      if (selectedLocation?.addressId && savedAddresses.some((a) => a._id === selectedLocation.addressId)) {
        setSelectedAddressId(selectedLocation.addressId);
      } else {
        const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
        setSelectedAddressId(defaultAddr._id);
      }
    } else {
      userService.getAddresses()
        .then((res) => {
          const list = res.data?.data || [];
          setAddresses(list);
          if (list.length > 0) {
            const defaultAddr = list.find((a) => a.isDefault) || list[0];
            setSelectedAddressId(defaultAddr._id);
          } else {
            setShowNewAddressForm(true);
          }
        })
        .catch(() => {
          setAddresses([]);
          setShowNewAddressForm(true);
        })
        .finally(() => setLoadingAddresses(false));
    }
  }, [savedAddresses, selectedLocation]);

  const shippingFee = totals.subtotal >= 499 || totals.subtotal === 0 ? 0 : 49;
  const grandTotal = finalTotal + shippingFee;

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.addAddress(newAddress);
      const updatedList = res.data?.data || [];
      setAddresses(updatedList);
      const newlyAdded = updatedList[updatedList.length - 1];
      if (newlyAdded) setSelectedAddressId(newlyAdded._id);
      setShowNewAddressForm(false);
      toast.success('Address saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    let finalShippingAddress = null;

    if (showNewAddressForm || addresses.length === 0) {
      if (!newAddress.addressLine1 || !newAddress.pincode || !newAddress.fullName || !newAddress.phone) {
        toast.error('Please complete the shipping address fields');
        return;
      }
      finalShippingAddress = newAddress;
    } else {
      const found = addresses.find((a) => a._id === selectedAddressId);
      if (!found) {
        toast.error('Please select a shipping address');
        return;
      }
      finalShippingAddress = found;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    setSubmittingOrder(true);
    try {
      // First ensure backend cart has all current items
      const orderPayload = {
        shippingAddress: {
          fullName: finalShippingAddress.fullName,
          phone: finalShippingAddress.phone,
          houseNumber: finalShippingAddress.houseNumber || '',
          buildingName: finalShippingAddress.buildingName || '',
          street: finalShippingAddress.street || '',
          locality: finalShippingAddress.locality || '',
          landmark: finalShippingAddress.landmark || '',
          addressLine1: finalShippingAddress.addressLine1,
          addressLine2: finalShippingAddress.addressLine2 || '',
          city: finalShippingAddress.city,
          state: finalShippingAddress.state,
          pincode: finalShippingAddress.pincode,
          country: finalShippingAddress.country || 'India',
          latitude: finalShippingAddress.latitude || null,
          longitude: finalShippingAddress.longitude || null,
          formattedAddress: finalShippingAddress.formattedAddress || `${finalShippingAddress.addressLine1}, ${finalShippingAddress.city} - ${finalShippingAddress.pincode}`,
          type: finalShippingAddress.type || 'home',
        },
        paymentMethod,
      };

      const res = await orderService.create(orderPayload);
      const createdOrder = res.data?.data;

      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/account/orders/${createdOrder._id || ''}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-main py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">No Items in Cart</h2>
        <p className="text-text-muted mb-6">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl inline-block"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-surface-border py-4">
        <div className="container-main flex items-center justify-between">
          <div>
            <nav className="flex items-center gap-2 text-xs text-text-muted mb-1" aria-label="Breadcrumb">
              <Link to="/cart" className="hover:text-primary-600">Cart</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-text-primary font-medium">Checkout</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Checkout</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>
      </div>

      <div className="container-main pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Flow (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-text-primary">Delivery Address</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openLocationModal('map-add')}
                    className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-200 transition-colors shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Pick on Map</span>
                  </button>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                      className="text-xs font-semibold text-text-muted hover:text-text-primary px-2 py-1"
                    >
                      {showNewAddressForm ? 'Choose Saved' : 'Manual Form'}
                    </button>
                  )}
                </div>
              </div>

              {!showNewAddressForm && addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;
                    const lineContent = [addr.houseNumber, addr.buildingName, addr.addressLine1].filter(Boolean).join(', ');

                    return (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary-600 bg-primary-50/40 shadow-xs'
                            : 'border-surface-border hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-text-primary">{addr.fullName}</span>
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-text-muted bg-gray-100 px-2 py-0.5 rounded">
                            {addr.type || 'home'}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed mb-1 line-clamp-2">
                          {lineContent || addr.addressLine1}
                          {addr.addressLine2 && addr.addressLine2 !== addr.addressLine1 ? `, ${addr.addressLine2}` : ''}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {addr.city}, {addr.state} – <span className="font-semibold">{addr.pincode}</span>
                        </p>
                        <p className="text-xs text-text-muted mt-1.5 font-medium">Phone: {addr.phone}</p>
                        {addr.latitude && addr.longitude && (
                          <div className="mt-2 text-[10px] text-primary-600 font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>GPS Pinned ({addr.latitude.toFixed(4)}, {addr.longitude.toFixed(4)})</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <form onSubmit={handleAddNewAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Flat, House no., Building, Apartment *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Area, Street, Sector, Village (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">Town / City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">Pincode (6-digit) *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-4 py-2 border border-surface-border rounded-xl text-xs font-bold text-text-secondary hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-surface-border mb-4">
                <span className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-bold text-text-primary">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery (COD)', desc: 'Pay with cash upon delivery at your doorstep.' },
                  { id: 'upi', label: 'UPI / QR Code', desc: 'Instant payment via Google Pay, PhonePe, Paytm, or BHIM.' },
                  { id: 'card', label: 'Credit or Debit Card', desc: 'Visa, MasterCard, RuPay, and American Express accepted.' },
                  { id: 'netbanking', label: 'Net Banking', desc: 'Support for all major Indian banks.' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === opt.id
                        ? 'border-primary-600 bg-primary-50/30'
                        : 'border-surface-border hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-text-primary block">{opt.label}</span>
                      <span className="text-xs text-text-muted mt-0.5 block">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Order Review & Confirmation (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs sticky top-24">
              <h2 className="text-base font-extrabold text-text-primary pb-4 border-b border-surface-border">
                Review Order ({totals.itemCount} items)
              </h2>

              {/* Items scroll */}
              <div className="max-h-56 overflow-y-auto divide-y divide-surface-border py-2">
                {items.map((item) => {
                  const p = item.product || item;
                  const itemTitle = p.title || p.name || item.name || 'Product';
                  const itemPrice = item.price ?? p.price ?? 0;
                  const rawImg = p.images?.[0] || item.image;
                  const itemImg = typeof rawImg === 'string' ? rawImg : rawImg?.url;

                  return (
                    <div key={item._id || item.productId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {itemImg && (
                          <img src={itemImg} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-border shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="font-semibold text-text-primary truncate">{itemTitle}</p>
                          <p className="text-text-muted">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-text-primary shrink-0">
                        {formatCurrency(itemPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Cost summary */}
              <div className="space-y-2.5 py-4 border-t border-b border-surface-border text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-primary">{formatCurrency(totals.subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(shippingFee)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-baseline justify-between py-4">
                <span className="text-base font-extrabold text-text-primary">Total Pay</span>
                <span className="text-2xl font-black text-text-primary">{formatCurrency(grandTotal)}</span>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submittingOrder}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <span>{submittingOrder ? 'Processing Order...' : 'Confirm & Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-text-muted text-center mt-3">
                By placing this order, you agree to JPP Market's Terms of Sale and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}