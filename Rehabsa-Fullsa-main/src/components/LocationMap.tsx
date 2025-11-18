import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationMapProps {
  height?: string;
  className?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  initialCenter?: [number, number];
  selectedLocation?: [number, number] | null;
}

function LocationMarker({ onLocationSelect, selectedLocation }: { 
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: [number, number] | null;
}) {
  const [position, setPosition] = useState<[number, number] | null>(selectedLocation || null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPosition: [number, number] = [lat, lng];
      setPosition(newPosition);
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    },
  });

  useEffect(() => {
    if (selectedLocation) {
      setPosition(selectedLocation);
    } else if (!position) {
      // If no selected location and no current position, clear marker
      setPosition(null);
    }
  }, [selectedLocation]);

  if (position === null) return null;

  return (
    <Marker position={position} icon={redIcon}>
    </Marker>
  );
}

export const LocationMap = ({ 
  height = '230px',
  className = '',
  onLocationSelect,
  initialCenter = [24.7136, 46.6753], // Riyadh coordinates
  selectedLocation = null
}: LocationMapProps) => {
  useEffect(() => {
    // Ensure the map container is properly sized
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full ${className} relative`} style={{ height }}>
      <MapContainer
        center={selectedLocation || initialCenter}
        zoom={selectedLocation ? 15 : 10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />
      </MapContainer>
    </div>
  );
};

