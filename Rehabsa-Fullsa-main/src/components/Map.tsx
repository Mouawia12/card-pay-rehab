import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export const Map = ({ 
  center, 
  zoom = 15, 
  height = '400px',
  className = ''
}: MapProps) => {
  useEffect(() => {
    // Ensure the map container is properly sized
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        <Marker position={center}>
          <Popup>
            <div className="text-center p-2">
              <h3 className="font-bold text-lg mb-2">مكة المكرمة</h3>
              <p className="text-sm text-gray-600 mb-2">
                المملكة العربية السعودية
              </p>
              <p className="text-xs text-gray-500">
                مكتبنا الرئيسي
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 shadow-sm">
        &copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Maps</a>
      </div>
    </div>
  );
};
