import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Plus, Trash2, Edit3, CheckCircle2, ChevronRight, Home, Briefcase, Tag,
  ExternalLink,
} from 'lucide-react';
import { userService } from '../../services';
import { useLocationContext } from '../../context/LocationContext';
import toast from 'react-hot-toast';

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    openLocationModal,
    selectedLocation,
    setSelectedLocation,
    refreshAddresses,
  } = useLocationContext();

  const loadAddresses = () => {
    setLoading(true);
    userService.getAddresses()
      .then((res) => setAddresses(res.data?.data || []))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleOpenAdd = () => {
    openLocationModal('map-add');
  };

  const handleOpenEdit = (addr) => {
    openLocationModal('map-edit', addr);
  };

  const handleDelete = async (id) => {
    if (addresses.length === 1) {
      if (!window.confirm('This is your only saved delivery address. Are you sure you want to remove it?')) {
        return;
      }
    } else {
      if (!window.confirm('Are you sure you want to delete this address?')) return;
    }

    try {
      await userService.deleteAddress(id);
      toast.success('Address removed');
      loadAddresses();
      refreshAddresses();

      // Clear if deleted address was active
      if (selectedLocation?.addressId === id) {
        setSelectedLocation(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userService.setDefault(id);
      toast.success('Default delivery address updated');
      loadAddresses();
      refreshAddresses();
    } catch {
      toast.error('Failed to set default address');
    }
  };

  const handleSelectDelivery = (addr) => {
    const mapped = {
      addressId: addr._id,
      fullName: addr.fullName,
      phone: addr.phone,
      houseNumber: addr.houseNumber || '',
      buildingName: addr.buildingName || '',
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      street: addr.street || '',
      locality: addr.locality || '',
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country || 'India',
      latitude: addr.latitude || null,
      longitude: addr.longitude || null,
      formattedAddress: addr.formattedAddress || `${addr.addressLine1}, ${addr.city} ${addr.pincode}`,
      type: addr.type || 'home',
      isDefault: addr.isDefault || false,
    };

    setSelectedLocation(mapped);
    toast.success(`Active delivery address set to ${addr.city} ${addr.pincode}`);
  };

  // Helper to format address lines without duplicate words
  const formatAddressLines = (addr) => {
    const parts = [];
    const seen = new Set();

    const addPart = (str) => {
      if (!str || typeof str !== 'string') return;
      const clean = str.trim();
      const lower = clean.toLowerCase();
      if (clean && !seen.has(lower)) {
        parts.push(clean);
        seen.add(lower);
      }
    };

    if (addr.houseNumber || addr.buildingName) {
      addPart([addr.houseNumber, addr.buildingName].filter(Boolean).join(', '));
    }
    addPart(addr.addressLine1);
    if (addr.addressLine2 && addr.addressLine2 !== addr.addressLine1) {
      addPart(addr.addressLine2);
    }
    addPart(addr.street);
    addPart(addr.locality);

    return parts.join(', ');
  };

  return (
    <div className="bg-surface-bg min-h-screen py-8">
      <div className="container-main space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/account" className="hover:text-primary-600 transition-colors">Account</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary font-medium">Delivery Addresses</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-surface-border p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary flex items-center gap-2.5">
              <MapPin className="w-6 h-6 text-primary-600" />
              <span>Saved Delivery Addresses</span>
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Select, pinpoint on interactive GPS map, or update your delivery destinations.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-sm text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address with Map</span>
          </button>
        </div>

        {/* Address Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 bg-white rounded-2xl border border-surface-border p-5 animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-8 bg-gray-200 rounded w-full mt-6" />
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white border border-surface-border rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-1">No Saved Addresses Found</h2>
            <p className="text-xs sm:text-sm text-text-muted mb-6">
              Pin your location on our interactive map to enjoy fast, accurate delivery across India.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {addresses.map((addr) => {
              const isSelected = selectedLocation?.addressId === addr._id;
              const lineContent = formatAddressLines(addr);

              return (
                <div
                  key={addr._id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all
                    ${isSelected ? 'border-primary-500 ring-2 ring-primary-500/10' : 'border-surface-border'}`}
                >
                  <div>
                    {/* Header: Name & Type Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm text-text-primary">{addr.fullName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-text-secondary px-2 py-0.5 rounded">
                          {addr.type || 'home'}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-primary-50 text-primary-700 border border-primary-200 px-2 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Address Text (cleanly deduplicated) */}
                    <p className="text-xs text-text-secondary leading-relaxed mb-1">
                      {lineContent || addr.addressLine1}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {addr.city}, {addr.state} – <strong className="text-text-primary">{addr.pincode}</strong>
                    </p>
                    {addr.landmark && (
                      <p className="text-[11px] text-text-muted mt-1">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                    <p className="text-xs text-text-muted mt-2 font-medium">
                      Mobile: {addr.phone}
                    </p>

                    {/* GPS Coordinates & Map Link Badge */}
                    {addr.latitude && addr.longitude ? (
                      <div className="mt-3 pt-2 border-t border-dashed border-surface-border">
                        <a
                          href={`https://www.google.com/maps?q=${addr.latitude},${addr.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>Pinned at {addr.latitude.toFixed(4)}, {addr.longitude.toFixed(4)}</span>
                          <ExternalLink className="w-3 h-3 text-text-muted" />
                        </a>
                      </div>
                    ) : null}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 mt-4 border-t border-surface-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      {!isSelected ? (
                        <button
                          type="button"
                          onClick={() => handleSelectDelivery(addr)}
                          className="text-primary-600 hover:text-primary-800 font-semibold"
                        >
                          Deliver Here
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Currently Delivering</span>
                        </span>
                      )}

                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(addr._id)}
                          className="text-text-muted hover:text-text-primary text-[11px]"
                        >
                          Make Default
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1 border-t border-surface-border text-xs">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(addr)}
                        className="text-text-muted hover:text-primary-600 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit on Map</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(addr._id)}
                        className="text-error-500 hover:text-error-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}