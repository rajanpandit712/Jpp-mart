import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services';

const LocationContext = createContext(null);
const STORAGE_KEY = 'jpp_delivery_location';

export function LocationProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  // Active delivery location state
  const [selectedLocation, setSelectedLocationState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Modal control state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('select'); // 'select' | 'map-add' | 'map-edit'
  const [editAddress, setEditAddress] = useState(null);

  // Saved user addresses cache
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Fetch user addresses when logged in
  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedAddresses([]);
      return;
    }
    setLoadingAddresses(true);
    try {
      const res = await userService.getAddresses();
      const list = res.data?.data || [];
      setSavedAddresses(list);

      // If user has saved addresses and no location selected yet, auto-select default
      if (list.length > 0) {
        setSelectedLocationState((current) => {
          if (!current || !current.addressId) {
            const def = list.find((a) => a.isDefault) || list[0];
            const mapped = mapAddressToLocation(def);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
            } catch {}
            return mapped;
          }
          return current;
        });
      }
    } catch {
      setSavedAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses, user]);

  const mapAddressToLocation = (addr) => {
    if (!addr) return null;
    return {
      addressId: addr._id || null,
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      houseNumber: addr.houseNumber || '',
      buildingName: addr.buildingName || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      street: addr.street || '',
      locality: addr.locality || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      country: addr.country || 'India',
      latitude: addr.latitude || null,
      longitude: addr.longitude || null,
      formattedAddress: addr.formattedAddress || '',
      type: addr.type || 'home',
      isDefault: addr.isDefault || false,
    };
  };

  const setSelectedLocation = (locationObj) => {
    setSelectedLocationState(locationObj);
    try {
      if (locationObj) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(locationObj));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  };

  const openLocationModal = (mode = 'select', targetAddr = null) => {
    setModalMode(mode);
    setEditAddress(targetAddr);
    setModalOpen(true);
  };

  const closeLocationModal = () => {
    setModalOpen(false);
    setEditAddress(null);
  };

  /**
   * Helper to format human-readable header label
   * e.g. "Rajan — Coimbatore 641407" or "Coimbatore 641407"
   */
  const getHeaderDisplay = () => {
    if (!selectedLocation) {
      return {
        line1: 'Deliver to',
        line2: 'Select Location',
        isSet: false,
      };
    }

    const name = selectedLocation.fullName ? selectedLocation.fullName.split(' ')[0] : '';
    const locality = selectedLocation.locality || selectedLocation.city || '';
    const pin = selectedLocation.pincode ? `${selectedLocation.pincode}` : '';

    let line2 = '';
    if (name && (locality || pin)) {
      line2 = `${name} — ${locality || ''} ${pin}`.trim();
    } else if (locality || pin) {
      line2 = `${locality} ${pin}`.trim();
    } else {
      line2 = selectedLocation.formattedAddress?.slice(0, 24) || 'Selected Location';
    }

    return {
      line1: 'Deliver to',
      line2,
      isSet: true,
      fullAddress: selectedLocation.formattedAddress,
    };
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        savedAddresses,
        loadingAddresses,
        refreshAddresses: fetchAddresses,
        isLocationModalOpen: modalOpen,
        modalMode,
        editAddress,
        openLocationModal,
        closeLocationModal,
        getHeaderDisplay,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  return ctx || {};
}
