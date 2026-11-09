const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

// In-memory cache to respect OSM rate limits and deliver ultra-fast responses
const geocodeCache = new Map();
const reverseCache = new Map();

// Helper to deduplicate address parts and build a clean string
function buildCleanAddress(addr) {
  const parts = [];
  const added = new Set();

  const candidateParts = [
    addr.house_number,
    addr.building,
    addr.road || addr.pedestrian || addr.street,
    addr.suburb || addr.neighbourhood || addr.residential || addr.locality,
    addr.city || addr.town || addr.village,
    addr.state,
    addr.postcode,
    addr.country,
  ];

  for (const part of candidateParts) {
    if (part && typeof part === 'string') {
      const trimmed = part.trim();
      const lower = trimmed.toLowerCase();
      if (!added.has(lower)) {
        parts.push(trimmed);
        added.add(lower);
      }
    }
  }

  return parts.join(', ');
}

/**
 * Search locations using OpenStreetMap Nominatim Geocoding API
 * GET /api/location/search?q=query
 */
exports.searchPlaces = async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query || query.length < 2) {
    return ApiResponse.success(res, []);
  }

  const cacheKey = query.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return ApiResponse.success(res, geocodeCache.get(cacheKey));
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '6');
    url.searchParams.set('countrycodes', 'in'); // prioritize India

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'JPP-Market-Ecommerce/1.0 (contact@jppmarket.com)',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding service returned status ${response.status}`);
    }

    const data = await response.json();

    const results = (data || []).map((item) => {
      const a = item.address || {};
      const houseNumber = a.house_number || a.building || '';
      const street = a.road || a.pedestrian || a.street || '';
      const locality = a.suburb || a.neighbourhood || a.residential || a.village || a.town || '';
      const city = a.city || a.town || a.county || a.state_district || '';
      const state = a.state || '';
      const pincode = a.postcode || '';
      const country = a.country || 'India';
      const cleanFormatted = buildCleanAddress(a) || item.display_name;

      return {
        id: String(item.osm_id || item.place_id || Math.random()),
        displayName: item.display_name,
        cleanFormatted,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        type: item.type,
        address: {
          houseNumber,
          buildingName: a.building || '',
          street,
          locality,
          landmark: '',
          city,
          state,
          pincode,
          country,
        },
      };
    });

    geocodeCache.set(cacheKey, results);
    // Limit cache size to 200 entries
    if (geocodeCache.size > 200) {
      const firstKey = geocodeCache.keys().next().value;
      geocodeCache.delete(firstKey);
    }

    return ApiResponse.success(res, results);
  } catch (error) {
    logger.error('Geocoding search failed: ' + error.message);
    return ApiResponse.error(res, 'Unable to search location at this moment', 502);
  }
};

/**
 * Reverse geocode coordinates to readable address using Nominatim API
 * GET /api/location/reverse?lat=...&lon=...
 */
exports.reverseGeocode = async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw ApiError.badRequest('Valid latitude and longitude are required');
  }

  // Cache key rounded to 4 decimals (~11 meters resolution)
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (reverseCache.has(cacheKey)) {
    return ApiResponse.success(res, reverseCache.get(cacheKey));
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lon.toString());
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'JPP-Market-Ecommerce/1.0 (contact@jppmarket.com)',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding service returned status ${response.status}`);
    }

    const data = await response.json();
    const a = data.address || {};

    const houseNumber = a.house_number || a.building || '';
    const street = a.road || a.pedestrian || a.street || '';
    const locality = a.suburb || a.neighbourhood || a.residential || a.village || a.town || '';
    const city = a.city || a.town || a.county || a.state_district || '';
    const state = a.state || '';
    const pincode = a.postcode || '';
    const country = a.country || 'India';
    const cleanFormatted = buildCleanAddress(a) || data.display_name;

    const result = {
      latitude: lat,
      longitude: lon,
      displayName: data.display_name,
      formattedAddress: cleanFormatted,
      address: {
        houseNumber,
        buildingName: a.building || '',
        street,
        locality,
        landmark: '',
        city,
        state,
        pincode,
        country,
      },
    };

    reverseCache.set(cacheKey, result);
    if (reverseCache.size > 200) {
      const firstKey = reverseCache.keys().next().value;
      reverseCache.delete(firstKey);
    }

    return ApiResponse.success(res, result);
  } catch (error) {
    logger.error('Reverse geocode failed: ' + error.message);
    return ApiResponse.error(res, 'Unable to detect address for the selected location', 502);
  }
};

/**
 * Validate PIN code and check delivery serviceability
 * GET /api/location/validate-pincode/:pincode
 */
exports.validatePincode = async (req, res) => {
  const pincode = (req.params.pincode || '').trim();
  const isValid = /^[1-9][0-9]{5}$/.test(pincode);

  if (!isValid) {
    return ApiResponse.success(res, {
      pincode,
      isValid: false,
      isServiceable: false,
      message: 'Please enter a valid 6-digit Indian PIN code',
    });
  }

  // JPP Market delivers across all serviceable Indian PIN codes
  return ApiResponse.success(res, {
    pincode,
    isValid: true,
    isServiceable: true,
    estimatedDays: '2 - 4 business days',
    deliveryFee: 0, // Free delivery on orders > ₹499
    message: 'Delivery available to this PIN code',
  });
};
