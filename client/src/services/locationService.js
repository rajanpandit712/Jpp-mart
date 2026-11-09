import api from './api';

/**
 * Location Service for JPP Market
 * Provides geocoding, reverse geocoding, and browser GPS positioning
 * with graceful fallbacks and error handling.
 */
export const locationService = {
  /**
   * Search addresses & places using backend proxy (or fallback to public OSM)
   */
  async searchPlaces(query) {
    if (!query || query.trim().length < 2) return [];

    try {
      const res = await api.get('/location/search', {
        params: { q: query.trim() },
        timeout: 8000,
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch {
      // Graceful client-side fallback directly to Nominatim
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&addressdetails=1&limit=5&countrycodes=in`;
        const fallbackRes = await fetch(url, {
          headers: { 'Accept-Language': 'en-IN,en;q=0.9' },
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          return data.map((item) => {
            const a = item.address || {};
            return {
              id: String(item.osm_id || Math.random()),
              displayName: item.display_name,
              cleanFormatted: item.display_name,
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lon),
              address: {
                houseNumber: a.house_number || a.building || '',
                buildingName: a.building || '',
                street: a.road || a.pedestrian || '',
                locality: a.suburb || a.neighbourhood || a.village || '',
                city: a.city || a.town || a.county || '',
                state: a.state || '',
                pincode: a.postcode || '',
                country: a.country || 'India',
              },
            };
          });
        }
      } catch (clientErr) {
        console.warn('Geocoding fallback error:', clientErr);
      }
    }
    return [];
  },

  /**
   * Reverse geocode coordinates to structured address
   */
  async reverseGeocode(lat, lon) {
    try {
      const res = await api.get('/location/reverse', {
        params: { lat, lon },
        timeout: 8000,
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch {
      // Fallback directly to Nominatim
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
        const fallbackRes = await fetch(url);
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          const a = data.address || {};
          return {
            latitude: lat,
            longitude: lon,
            displayName: data.display_name,
            formattedAddress: data.display_name,
            address: {
              houseNumber: a.house_number || a.building || '',
              buildingName: a.building || '',
              street: a.road || a.pedestrian || '',
              locality: a.suburb || a.neighbourhood || a.village || '',
              city: a.city || a.town || a.county || '',
              state: a.state || '',
              pincode: a.postcode || '',
              country: a.country || 'India',
            },
          };
        }
      } catch (err) {
        console.warn('Reverse geocoding fallback error:', err);
      }
    }

    return {
      latitude: lat,
      longitude: lon,
      formattedAddress: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      address: {
        houseNumber: '',
        buildingName: '',
        street: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      },
    };
  },

  /**
   * Request user's device geolocation via browser API with comprehensive error handling
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported by your browser. Please search or pick on map.'));
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          let msg = 'Unable to retrieve your location.';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              msg = 'Location permission was denied. You can still search your address or click on the map.';
              break;
            case err.POSITION_UNAVAILABLE:
              msg = 'Location information is currently unavailable. Please pick your location on the map.';
              break;
            case err.TIMEOUT:
              msg = 'Location request timed out. Please try again or use the search box.';
              break;
          }
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  },

  /**
   * Validate PIN code serviceability
   */
  async validatePincode(pincode) {
    try {
      const res = await api.get(`/location/validate-pincode/${pincode}`);
      return res.data?.data || { isValid: /^[1-9][0-9]{5}$/.test(pincode), isServiceable: true };
    } catch {
      return { isValid: /^[1-9][0-9]{5}$/.test(pincode), isServiceable: true };
    }
  },

  /**
   * Format address cleanly to avoid duplicates
   */
  formatAddress(addr) {
    if (!addr) return '';
    const parts = [];
    const seen = new Set();

    const pushPart = (val) => {
      if (!val || typeof val !== 'string') return;
      const clean = val.trim();
      const lower = clean.toLowerCase();
      if (clean && !seen.has(lower)) {
        parts.push(clean);
        seen.add(lower);
      }
    };

    if (addr.houseNumber || addr.buildingName) {
      pushPart([addr.houseNumber, addr.buildingName].filter(Boolean).join(', '));
    }
    pushPart(addr.addressLine1);
    if (addr.addressLine2 && addr.addressLine2 !== addr.addressLine1) {
      pushPart(addr.addressLine2);
    }
    pushPart(addr.street);
    pushPart(addr.locality);
    pushPart(addr.city);
    pushPart(addr.state);
    if (addr.pincode) pushPart(addr.pincode);

    return parts.join(', ');
  },
};
