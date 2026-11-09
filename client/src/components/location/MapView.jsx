import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Modern animated SVG marker pin for crisp rendering at all screen pixel densities
const createCustomPinIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 36px; height: 46px; transform: translate(-18px, -46px); pointer-events: auto;">
        <svg viewBox="0 0 384 512" width="36" height="46" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35)); fill: #EF4444;">
          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
        </svg>
        <div style="position: absolute; top: 11px; left: 11px; width: 14px; height: 14px; background: white; border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -2px; left: 10px; width: 16px; height: 5px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(1px);"></div>
      </div>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46],
  });
};

/**
 * Interactive Leaflet Map Component
 * Props:
 *  - center: [lat, lon]
 *  - zoom: number (default 15)
 *  - onLocationChange: (lat, lon) => void
 *  - className: string
 */
export default function MapView({
  center = [11.0168, 76.9558], // Default Coimbatore, Tamil Nadu
  zoom = 15,
  onLocationChange,
  className = 'h-72 w-full',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isInternalMoveRef = useRef(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const [initLat, initLon] = center;

    const map = L.map(mapContainerRef.current, {
      center: [initLat, initLon],
      zoom,
      zoomControl: false, // will add customized zoom control in top-right
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in top right so it doesn't overlap search bar
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Create marker
    const pinIcon = createCustomPinIcon();
    const marker = L.marker([initLat, initLon], {
      icon: pinIcon,
      draggable: true,
      autoPan: true,
    }).addTo(map);

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Handle marker dragend
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      isInternalMoveRef.current = true;
      if (onLocationChange) {
        onLocationChange(pos.lat, pos.lng);
      }
    });

    // Handle click on map to reposition pin
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      isInternalMoveRef.current = true;
      if (onLocationChange) {
        onLocationChange(lat, lng);
      }
    });

    // Invalidate map size after DOM mount
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync external center updates (e.g. from search selection or GPS geolocation)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    if (!map || !marker || !center) return;

    const [lat, lon] = center;
    if (isNaN(lat) || isNaN(lon)) return;

    // Avoid infinite feedback loop when change originated from map drag/click
    if (isInternalMoveRef.current) {
      isInternalMoveRef.current = false;
      return;
    }

    const currentLatLng = marker.getLatLng();
    const dist = Math.hypot(currentLatLng.lat - lat, currentLatLng.lng - lon);

    if (dist > 0.0001) {
      marker.setLatLng([lat, lon]);
      map.flyTo([lat, lon], Math.max(map.getZoom(), 15), {
        animate: true,
        duration: 0.8,
      });
    }
  }, [center]);

  // Periodic invalidateSize check for modal animation/resizing
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(t);
  });

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-surface-border shadow-inner">
      <div ref={mapContainerRef} className={className} />

      {/* Map helper guide badge */}
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-surface-border text-[11px] font-semibold text-text-secondary shadow-sm pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Tap map or drag pin to adjust exact point</span>
      </div>
    </div>
  );
}
