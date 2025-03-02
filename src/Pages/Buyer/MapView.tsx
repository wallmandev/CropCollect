import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import storeLocatorIcon from '../../assets/images/store-locator-icon.svg';

// Ta bort Leaflets standard-url-hämtare
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Använd samma ikon för både vanlig och retina
L.Icon.Default.mergeOptions({
  iconRetinaUrl: storeLocatorIcon,
  iconUrl: storeLocatorIcon,
  shadowUrl: null,
});

const MapEvents = ({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) => {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      onBoundsChange(map.getBounds());
    },
  });
  return null;
};

interface GeoData {
  user_id: string;
  latitude: number;
  longitude: number;
  businessAddress: string;
}

interface MapViewProps {
  geoData: GeoData[];
  onSearch: (bounds: L.LatLngBounds) => void;
}

const MapView: React.FC<MapViewProps> = ({ geoData, onSearch }) => {
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const mapRef = useRef<any>(null);

  const handleSearch = () => {
    if (bounds) {
      onSearch(bounds);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={[57.7005, 16.3443]}
        zoom={13}
        style={{ height: "600px", width: "100%", position: "relative" }}
        whenReady={() => {
          const mapInstance = mapRef.current;
          if (mapInstance) {
            mapRef.current = mapInstance;
          }
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onBoundsChange={(newBounds: L.LatLngBounds) => setBounds(newBounds)} />
        {geoData.map((data) => (
          <Marker key={data.user_id} position={[data.latitude, data.longitude]}>
            <Popup>
              <div>
                <h3>{data.businessAddress}</h3>
                <p>
                  Distance: {calculateDistance(57.7005, 16.3443, data.latitude, data.longitude)} km
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button onClick={handleSearch} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        Sök här
      </button>
    </div>
  );
};

export default MapView;