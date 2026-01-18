import { useEffect, useRef, useCallback } from "react";
import { MapPin, LocateFixed, Building2 } from "lucide-react";


import { AttendanceRecord, OfficeLocation } from "@/src/domain/attendance/attendance";

interface AttendanceMapProps {
  attendance: AttendanceRecord[];
  selectedAttendance: AttendanceRecord | null;
  onSelectAttendance: (attendance: AttendanceRecord) => void;
  officeLocation?: OfficeLocation | null;
}

export default function AttendanceMap({ attendance, selectedAttendance, onSelectAttendance, officeLocation }: AttendanceMapProps) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add office location marker and circle
    if (officeLocation && officeLocation.lat && officeLocation.lng) {
      const officeIcon = L.divIcon({
        className: 'office-marker',
        html: `
          <div style="
            background-color: #4f46e5;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 1000;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M16 18h.01"/></svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const officeMarker = L.marker([officeLocation.lat, officeLocation.lng], { icon: officeIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="padding: 8px;">
            <strong>Office Location</strong><br/>
            <span style="color: #666;">${officeLocation.address || 'Headquarters'}</span><br/>
            <span style="color: #666; font-size: 12px;">Radius: ${officeLocation.radius}m</span>
          </div>
        `);

      markersRef.current.push(officeMarker);

      const circle = L.circle([officeLocation.lat, officeLocation.lng], {
        color: '#4f46e5',
        fillColor: '#4f46e5',
        fillOpacity: 0.1,
        radius: officeLocation.radius
      }).addTo(mapInstanceRef.current);

      markersRef.current.push(circle);
    }

    // Add new markers
    const validAttendance = attendance.filter(a => a.location);

    if (validAttendance.length > 0) {
      validAttendance.forEach(record => {
        if (!record.location) return;

        const isSelected = selectedAttendance?.id === record.id;

        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${record.status === 'Present' ? '#10b981' :
              record.status === 'Late' ? '#f59e0b' :
                '#ef4444'
            };
              width: ${isSelected ? '40px' : '30px'};
              height: ${isSelected ? '40px' : '30px'};
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: ${isSelected ? '18px' : '14px'};
              cursor: pointer;
              transition: all 0.2s;
            ">
              📍
            </div>
          `,
          iconSize: [isSelected ? 40 : 30, isSelected ? 40 : 30],
          iconAnchor: [isSelected ? 20 : 15, isSelected ? 20 : 15] // Center the anchor
        });

        const marker = L.marker([record.location.lat, record.location.lng], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="padding: 8px;">
              <strong>${record.employeeName}</strong><br/>
              <span style="color: #666;">${record.location.address}</span><br/>
              <span style="color: #666;">Check In: ${record.check_in || '-'}</span><br/>
              <span style="color: #666;">Status: ${record.status}</span>
            </div>
          `);

        marker.on('click', () => {
          onSelectAttendance(record);
        });

        markersRef.current.push(marker);
      });
    }

    // Fit bounds to show markers and office
    const points: any[] = validAttendance.map(a => [a.location!.lat, a.location!.lng]);
    if (officeLocation && officeLocation.lat && officeLocation.lng) {
      points.push([officeLocation.lat, officeLocation.lng]);
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Draw connection line if an attendance record is selected AND office location exists
    if (selectedAttendance?.location && officeLocation && officeLocation.lat && officeLocation.lng) {
      const officeLatLng = L.latLng(officeLocation.lat, officeLocation.lng);
      const employeeLatLng = L.latLng(selectedAttendance.location.lat, selectedAttendance.location.lng);

      const distance = officeLatLng.distanceTo(employeeLatLng);
      const isWithinRadius = distance <= officeLocation.radius;

      // Draw dashed line
      const line = L.polyline([officeLatLng, employeeLatLng], {
        color: isWithinRadius ? '#10b981' : '#ef4444',
        weight: 2,
        dashArray: '5, 10',
        opacity: 0.8
      }).addTo(mapInstanceRef.current);

      // Add tooltip with distance info
      const centerPoint = L.latLng(
        (officeLocation.lat + selectedAttendance.location.lat) / 2,
        (officeLocation.lng + selectedAttendance.location.lng) / 2
      );

      L.popup({
        closeButton: false,
        className: 'distance-popup',
        autoClose: false,
        closeOnClick: false
      })
        .setLatLng(centerPoint)
        .setContent(`
          <div style="text-align: center; font-size: 12px; font-weight: 500;">
            <span style="color: ${isWithinRadius ? '#166534' : '#991b1b'}">
              ${Math.round(distance)}m
            </span>
            <br/>
            <span style="font-size: 10px; color: #666;">
              ${isWithinRadius ? 'Within Radius' : 'Outside Range'}
            </span>
          </div>
        `)
        .openOn(mapInstanceRef.current);

      markersRef.current.push(line);
      // We don't push the popup to markersRef because openOn handles it, but maybe we should close previous popups?
      // L.popup removes previous popups by default if using map.openPopup, but here we construct it.
      // Ideally, clearing markersRef should handle it if we added it to layer.
      // But openOn adds to map and closes previous.
    }
  }, [attendance, selectedAttendance, onSelectAttendance, officeLocation]);

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Initialize map centered on Jakarta
    const map = L.map(mapRef.current).setView([-6.2088, 106.8456], 12);

    // Use OpenStreetMap standard tiles for a colorful, familiar look
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
    //     // Use CartoDB Positron tiles for better aesthetics and reliability
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //   subdomains: 'abcd',
    //   maxZoom: 20

    mapInstanceRef.current = map;

    // Force a resize calculation
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    updateMarkers();
  }, [updateMarkers]); // Added updateMarkers as dependency

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadLeaflet = async () => {
      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      initMap();
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      // Ensure map resizes correctly when data changes or container resizes
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
      updateMarkers();
    }
  }, [updateMarkers, attendance]); // Re-run when attendance data changes

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-lg border border-gray-200"
      />
      {attendance.filter(a => a.location).length === 0 && !officeLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No location data available</p>
          </div>
        </div>
      )}

      {/* Center Office Button */}
      {officeLocation && officeLocation.lat && officeLocation.lng && (
        <button
          onClick={() => {
            if (mapInstanceRef.current && officeLocation.lat && officeLocation.lng) {
              mapInstanceRef.current.flyTo([officeLocation.lat, officeLocation.lng], 16, {
                duration: 1.5
              });
            }
          }}
          className="absolute top-4 right-4 z-[1000] bg-white p-2.5 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors group"
          title="Center to Office"
        >
          <LocateFixed className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
        </button>
      )}
    </div>
  );
}
