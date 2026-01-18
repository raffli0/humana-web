"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapPin, LocateFixed } from "lucide-react";

interface LocationPickerMapProps {
    lat: number | null;
    lng: number | null;
    radius: number;
    onLocationChange: (lat: number, lng: number) => void;
    onAddressChange: (address: string) => void;
}

export default function LocationPickerMap({ lat, lng, radius, onLocationChange, onAddressChange }: LocationPickerMapProps) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const circleRef = useRef<any>(null);

    const reverseGeocode = useCallback(async (newLat: number, newLng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&addressdetails=1`
            );
            const data = await response.json();
            if (data && data.display_name) {
                onAddressChange(data.display_name);
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
        }
    }, [onAddressChange]);

    const updateMapElements = useCallback((L: any, newLat: number, newLng: number) => {
        if (!mapInstanceRef.current) return;

        if (markerRef.current) {
            markerRef.current.setLatLng([newLat, newLng]);
        } else {
            const officeIcon = L.divIcon({
                className: 'location-picker-marker',
                html: `
          <div style="
            background-color: #4f46e5;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          ">
            📍
          </div>
        `,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            markerRef.current = L.marker([newLat, newLng], { icon: officeIcon, draggable: true })
                .addTo(mapInstanceRef.current);

            markerRef.current.on('dragend', (e: any) => {
                const pos = e.target.getLatLng();
                onLocationChange(pos.lat, pos.lng);
                reverseGeocode(pos.lat, pos.lng);
            });
        }

        if (circleRef.current) {
            circleRef.current.setLatLng([newLat, newLng]);
            circleRef.current.setRadius(radius);
        } else {
            circleRef.current = L.circle([newLat, newLng], {
                color: '#4f46e5',
                fillColor: '#4f46e5',
                fillOpacity: 0.1,
                radius: radius
            }).addTo(mapInstanceRef.current);
        }
    }, [radius, onLocationChange]);

    const initMap = useCallback(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const L = (window as any).L;
        if (!L) return;

        const initialLat = lat || -6.2088;
        const initialLng = lng || 106.8456;

        const map = L.map(mapRef.current).setView([initialLat, initialLng], lat ? 16 : 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;

        map.on('click', (e: any) => {
            onLocationChange(e.latlng.lat, e.latlng.lng);
            reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        if (lat && lng) {
            updateMapElements(L, lat, lng);
        }

        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [lat, lng, updateMapElements, onLocationChange]);

    useEffect(() => {
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
                await new Promise((resolve) => { script.onload = resolve; });
            }
            initMap();
        };

        loadLeaflet();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
                circleRef.current = null;
            }
        };
    }, [initMap]);

    useEffect(() => {
        const L = (window as any).L;
        if (L && mapInstanceRef.current && lat && lng) {
            updateMapElements(L, lat, lng);
        }
    }, [lat, lng, radius, updateMapElements]);

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="w-full h-[400px] rounded-lg border border-gray-200 z-0"
            />
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 p-2 rounded-md shadow-sm border text-xs font-medium">
                Click on map to select office location or drag the marker
            </div>

            {/* Current Location Button */}
            <button
                onClick={() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                            onLocationChange(pos.coords.latitude, pos.coords.longitude);
                            reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                            if (mapInstanceRef.current) {
                                mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 16);
                            }
                        });
                    }
                }}
                className="absolute top-4 right-4 z-[1000] bg-white p-2.5 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors group"
                title="Use My Current Location"
            >
                <LocateFixed className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
            </button>
        </div>
    );
}
