import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Search, Navigation, X, Check, Home, Briefcase, Tag,
  AlertCircle, Loader2, Plus, ArrowLeft, ExternalLink, CheckCircle2,
} from 'lucide-react';
import MapView from './MapView';
import { locationService } from '../../services/locationService';
import { userService } from '../../services';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LocationPickerModal() {
  const {
    isLocationModalOpen,
    closeLocationModal,
    modalMode,
    editAddress,
    selectedLocation,
    setSelectedLocation,
    savedAddresses,
    refreshAddresses,
  } = useLocationContext();

  const { isAuthenticated, user } = useAuth();

  // Mode: 'list' (if saved addresses exist) or 'map'
  const [view, setView] = useState('list'); // 'list' | 'map'

  // Map state coordinates [lat, lon]
  const [coordinates, setCoordinates] = useState([11.0168, 76.9558]); // Coimbatore default
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [locatingUser, setLocatingUser] = useState(false);

  // Search input and autocomplete suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Form data for confirmed address
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    houseNumber: '',
    buildingName: '',
    street: '',
    locality: '',
    landmark: '',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641001',
    type: 'home',
    isDefault: false,
    formattedAddress: '',
  });

  const [saving, setSaving] = useState(false);

  // Initialize modal state on open
  useEffect(() => {
    if (!isLocationModalOpen) return;

    if (modalMode === 'map-edit' && editAddress) {
      setView('map');
      const lat = editAddress.latitude || 11.0168;
      const lon = editAddress.longitude || 76.9558;
      setCoordinates([lat, lon]);
      setFormData({
        fullName: editAddress.fullName || user?.name || '',
        phone: editAddress.phone || user?.phone || '',
        houseNumber: editAddress.houseNumber || '',
        buildingName: editAddress.buildingName || '',
        street: editAddress.street || '',
        locality: editAddress.locality || '',
        landmark: editAddress.landmark || '',
        city: editAddress.city || '',
        state: editAddress.state || '',
        pincode: editAddress.pincode || '',
        type: editAddress.type || 'home',
        isDefault: editAddress.isDefault || false,
        formattedAddress: editAddress.formattedAddress || editAddress.addressLine1 || '',
      });
    } else if (modalMode === 'map-add') {
      setView('map');
      initNewMapLocation();
    } else {
      // 'select' mode: show list if saved addresses exist, otherwise map
      if (savedAddresses && savedAddresses.length > 0) {
        setView('list');
      } else {
        setView('map');
        initNewMapLocation();
      }
    }
  }, [isLocationModalOpen, modalMode, editAddress, savedAddresses.length]);

  const initNewMapLocation = () => {
    // If we already have selected coordinates, center on them
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      setCoordinates([selectedLocation.latitude, selectedLocation.longitude]);
      fetchReverseGeocode(selectedLocation.latitude, selectedLocation.longitude);
    } else {
      // Default center
      setCoordinates([11.0168, 76.9558]);
      fetchReverseGeocode(11.0168, 76.9558);
    }

    setFormData((prev) => ({
      ...prev,
      fullName: user?.name || prev.fullName || '',
      phone: user?.phone || prev.phone || '',
      isDefault: savedAddresses.length === 0,
    }));
  };

  // Perform reverse geocode when coordinates change
  const fetchReverseGeocode = useCallback(async (lat, lon) => {
    setIsReverseGeocoding(true);
    setGeoError('');
    try {
      const res = await locationService.reverseGeocode(lat, lon);
      if (res?.address) {
        const a = res.address;
        setFormData((prev) => ({
          ...prev,
          houseNumber: prev.houseNumber || a.houseNumber || '',
          buildingName: prev.buildingName || a.buildingName || '',
          street: a.street || prev.street || '',
          locality: a.locality || prev.locality || '',
          city: a.city || prev.city || '',
          state: a.state || prev.state || '',
          pincode: a.pincode || prev.pincode || '',
          formattedAddress: res.formattedAddress || '',
        }));
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  // Handler when map pin moves (drag or tap)
  const handleMapLocationChange = (lat, lon) => {
    setCoordinates([lat, lon]);
    fetchReverseGeocode(lat, lon);
  };

  // Search input handler with debouncing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await locationService.searchPlaces(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  // Select place suggestion
  const handleSelectSuggestion = (item) => {
    setSearchQuery(item.displayName);
    setShowSuggestions(false);
    setSuggestions([]);

    const lat = item.latitude;
    const lon = item.longitude;
    setCoordinates([lat, lon]);

    if (item.address) {
      const a = item.address;
      setFormData((prev) => ({
        ...prev,
        street: a.street || prev.street || '',
        locality: a.locality || prev.locality || '',
        city: a.city || prev.city || '',
        state: a.state || prev.state || '',
        pincode: a.pincode || prev.pincode || '',
        formattedAddress: item.cleanFormatted || item.displayName,
      }));
    }
  };

  // GPS Current Location handler
  const handleUseCurrentLocation = async () => {
    setLocatingUser(true);
    setGeoError('');
    try {
      const pos = await locationService.getCurrentPosition();
      setCoordinates([pos.latitude, pos.longitude]);
      fetchReverseGeocode(pos.latitude, pos.longitude);
      toast.success('Found your location!');
    } catch (err) {
      setGeoError(err.message || 'Could not fetch current location.');
      toast.error(err.message || 'Could not access location');
    } finally {
      setLocatingUser(false);
    }
  };

  // Select existing address from list
  const handleSelectExistingAddress = (addr) => {
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
    toast.success(`Delivering to ${addr.city} ${addr.pincode}`);
    closeLocationModal();
  };

  // Submit confirmed address from map
  const handleSaveAndConfirm = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Please enter recipient full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      toast.error('City, State, and PIN code are required');
      return;
    }

    const [lat, lon] = coordinates;

    // Compose addressLine1 & addressLine2
    const line1Parts = [formData.houseNumber, formData.buildingName, formData.street].filter(Boolean);
    const addressLine1 = line1Parts.length > 0 ? line1Parts.join(', ') : formData.formattedAddress || `${formData.city}, ${formData.state}`;
    const addressLine2 = [formData.locality, formData.landmark].filter(Boolean).join(', ');

    const payload = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      houseNumber: formData.houseNumber.trim(),
      buildingName: formData.buildingName.trim(),
      street: formData.street.trim(),
      locality: formData.locality.trim(),
      landmark: formData.landmark.trim(),
      addressLine1,
      addressLine2,
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      country: 'India',
      latitude: lat,
      longitude: lon,
      formattedAddress: formData.formattedAddress || `${addressLine1}, ${formData.city} - ${formData.pincode}`,
      type: formData.type || 'home',
      isDefault: formData.isDefault || false,
    };

    setSaving(true);
    try {
      if (isAuthenticated) {
        let savedAddrId = null;
        if (modalMode === 'map-edit' && editAddress?._id) {
          await userService.updateAddress(editAddress._id, payload);
          savedAddrId = editAddress._id;
          toast.success('Address updated successfully!');
        } else {
          const res = await userService.addAddress(payload);
          const list = res.data?.data || [];
          const newest = list[list.length - 1];
          savedAddrId = newest?._id || null;
          toast.success('Address saved successfully!');
        }

        await refreshAddresses();

        // Update active selection
        setSelectedLocation({
          ...payload,
          addressId: savedAddrId,
        });
      } else {
        // Guest mode: update active delivery location in localStorage
        setSelectedLocation({
          ...payload,
          addressId: null,
        });
        toast.success(`Delivery location set to ${payload.city} ${payload.pincode}`);
      }

      closeLocationModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  if (!isLocationModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-surface-border w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            {view === 'map' && savedAddresses.length > 0 && modalMode === 'select' && (
              <button
                type="button"
                onClick={() => setView('list')}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-gray-200 transition-colors mr-1"
                aria-label="Back to saved addresses"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 id="location-modal-title" className="text-base font-bold text-text-primary">
                {view === 'list'
                  ? 'Choose Delivery Location'
                  : modalMode === 'map-edit'
                  ? 'Edit Delivery Location'
                  : 'Pin Delivery Location on Map'}
              </h2>
              <p className="text-xs text-text-muted">
                {view === 'list'
                  ? 'Select a saved address or add a new one with GPS map'
                  : 'Search for place or tap on the map to place your pin'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLocationModal}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close location modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ======================================================== */}
          {/* VIEW 1: Saved Addresses List                            */}
          {/* ======================================================== */}
          {view === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Saved Delivery Addresses ({savedAddresses.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setView('map');
                    initNewMapLocation();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New with Map</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedLocation?.addressId === addr._id;
                  return (
                    <div
                      key={addr._id}
                      onClick={() => handleSelectExistingAddress(addr)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3
                        ${isSelected
                          ? 'border-primary-500 bg-primary-50/40 shadow-xs'
                          : 'border-surface-border bg-white hover:border-primary-300 hover:bg-gray-50/60'}`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors
                            ${isSelected ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'}`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-text-primary truncate">
                              {addr.fullName}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-text-secondary px-2 py-0.5 rounded">
                              {addr.type || 'home'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                            {addr.houseNumber ? `${addr.houseNumber}, ` : ''}
                            {addr.buildingName ? `${addr.buildingName}, ` : ''}
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                          </p>
                          <p className="text-xs font-semibold text-text-primary mt-1">
                            {addr.city}, {addr.state} – {addr.pincode}
                          </p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            Phone: {addr.phone}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectExistingAddress(addr);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0
                          ${isSelected
                            ? 'bg-primary-600 text-white shadow-2xs'
                            : 'bg-gray-100 hover:bg-primary-600 hover:text-white text-text-secondary'}`}
                      >
                        {isSelected ? 'Delivering Here' : 'Deliver Here'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => {
                    setView('map');
                    initNewMapLocation();
                  }}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-text-primary font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors border border-surface-border"
                >
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>Choose Another Location via Interactive Map</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: Interactive Map Picker & Address Form           */}
          {/* ======================================================== */}
          {view === 'map' && (
            <div className="space-y-4">
              {/* Search Bar & Suggestion Dropdown */}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      placeholder="Search apartment, street, area, city, or PIN code..."
                      className="w-full pl-9 pr-8 py-2.5 text-xs text-text-primary bg-white border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-2xs"
                    />
                    {searching && (
                      <Loader2 className="w-3.5 h-3.5 text-primary-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>

                  {/* Use Current GPS Location */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locatingUser}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors shadow-2xs shrink-0 disabled:opacity-50"
                    title="Detect device GPS location"
                  >
                    {locatingUser ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Navigation className="w-3.5 h-3.5 text-primary-600" />
                    )}
                    <span className="hidden sm:inline">Use Current Location</span>
                    <span className="sm:hidden">Current</span>
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-border rounded-2xl shadow-xl z-[500] max-h-56 overflow-y-auto divide-y divide-surface-border">
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full px-4 py-2.5 text-left hover:bg-primary-50 flex items-start gap-2.5 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-text-primary line-clamp-1">
                            {item.cleanFormatted}
                          </p>
                          <p className="text-[10px] text-text-muted line-clamp-1">
                            {item.displayName}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Geo Error Warning */}
              {geoError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{geoError}</span>
                </div>
              )}

              {/* Interactive Map View */}
              <div className="relative">
                <MapView
                  center={coordinates}
                  onLocationChange={handleMapLocationChange}
                  className="h-64 sm:h-72 w-full"
                />

                {/* Geocoding Loading Indicator */}
                {isReverseGeocoding && (
                  <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-surface-border shadow-md flex items-center gap-2 text-xs font-medium text-text-primary">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600" />
                    <span>Detecting address...</span>
                  </div>
                )}
              </div>

              {/* Detected Address Summary Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-surface-border flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Selected Pin Location
                  </p>
                  <p className="text-xs font-medium text-text-primary line-clamp-2 mt-0.5">
                    {formData.formattedAddress || 'Move marker to choose point'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Coordinates: {coordinates[0].toFixed(5)}, {coordinates[1].toFixed(5)}
                  </p>
                </div>
              </div>

              {/* Detailed Address Form */}
              <form onSubmit={handleSaveAndConfirm} className="space-y-3 pt-1">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Complete Address Details
                </p>

                {/* Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rajan Pandit"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                {/* Flat / House No / Building */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Flat / House No. / Floor
                    </label>
                    <input
                      type="text"
                      value={formData.houseNumber}
                      onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                      placeholder="e.g. Flat 302, 3rd Floor"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Building / Apartment Name
                    </label>
                    <input
                      type="text"
                      value={formData.buildingName}
                      onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                      placeholder="e.g. Skyline Residency"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                {/* Street / Area / Locality */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Street / Road
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      placeholder="e.g. Avinashi Road"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      placeholder="e.g. Arasur"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                {/* Landmark, City, State, PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="e.g. Near Toll Gate"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Coimbatore"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Tamil Nadu"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="e.g. 641407"
                      className="w-full px-3 py-2 text-xs border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Address Type Selection Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-secondary">Type:</span>
                    {[
                      { id: 'home', label: 'Home', icon: Home },
                      { id: 'work', label: 'Work', icon: Briefcase },
                      { id: 'other', label: 'Other', icon: Tag },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: id })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                          ${formData.type === id
                            ? 'bg-primary-600 text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-text-secondary'}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  {isAuthenticated && (
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary font-medium">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>Make this my default address</span>
                    </label>
                  )}
                </div>

                {/* Submit & Cancel Actions */}
                <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeLocationModal}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{modalMode === 'map-edit' ? 'Update Location' : 'Confirm & Save Address'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
