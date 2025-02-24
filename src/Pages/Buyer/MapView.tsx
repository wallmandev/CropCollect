import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import storeLocatorIcon from '../../assets/images/store-locator-icon.svg';

// Ta bort Leaflets standard-url-hämtare
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Använd samma ikon för både vanlig och retina
L.Icon.Default.mergeOptions({
  iconRetinaUrl: storeLocatorIcon,
  iconUrl: storeLocatorIcon,
  // Om du inte vill använda någon skugga, kan du ta bort denna rad
  // eller sätta shadowUrl till null eller samma ikon om du vill.
  // shadowUrl: storeLocatorIcon, 
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

  return (
    <div>
      <MapContainer
        center={[57.7005, 16.3443]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
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
          <Marker key={data.user_id} position={[data.latitude, data.longitude]} />
        ))}
      </MapContainer>
      <button onClick={handleSearch} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Sök här
      </button>
    </div>
  );
};

export default MapView;