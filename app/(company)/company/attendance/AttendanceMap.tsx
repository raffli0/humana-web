import { useEffect, useRef, useCallback } from "react";
import { MapPin } from "lucide-react";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  employees?: {
    name: string;
    avatar: string;
    department: string;
  };
}

interface AttendanceMapProps {
  attendance: AttendanceRecord[];
  selectedAttendance: AttendanceRecord | null;
  onSelectAttendance: (attendance: AttendanceRecord) => void;
  officeLocation?: {
    lat: number;
    lng: number;
    radius: number;
    address?: string | null;
  } | null;
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
            border-radius: 8px;
            border: 3px solid white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            z-index: 1000;
          ">
            🏢
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
              <span style="color: #666;">Check In: ${record.checkIn || '-'}</span><br/>
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
  }, [attendance, selectedAttendance, onSelectAttendance, officeLocation]);

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Initialize map centered on Jakarta
    const map = L.map(mapRef.current).setView([-6.2088, 106.8456], 12);

    // Use CartoDB Positron tiles for better aesthetics and reliability
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

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
    </div>
  );
}
