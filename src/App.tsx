import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./Pages/Landing";
import LoginBuyer from "./Pages/Buyer/LoginBuyer";
import LoginSeller from "./Pages/Seller/LoginSeller";
import RegisterBuyer from "./Pages/Buyer/RegisterBuyer";
import ListProductsBuyer from "./Pages/Buyer/ListProductsBuyer";
import SellerLandingPage from "./Pages/Seller/SellerLanding";
import AddProduct from "./Pages/Seller/AddProducts";
import ConfirmationPage from "./Pages/Seller/ConfirmationPage";
import MapView from "./Pages/Buyer/MapView";
import Cart from "./Pages/Buyer/Cart";
import Orders from "./Pages/Seller/Orders";
import Inventory from "./Pages/Seller/Inventory";
import PrivateRoute from "./Interface/PrivateRoute";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { GeoData } from "./Interface/GeoData";
import L from "leaflet";

const App: React.FC = () => {
  // State för att lagra geo-data (affärer/säljare)
  const [geoData, setGeoData] = useState<GeoData[]>([]);

  // onSearch-funktionen tar emot bounding boxen från MapView
  const onSearch = async (bounds: L.LatLngBounds) => {
    // Extrahera min och max för lat och lng från bounding boxen
    const minLat = bounds.getSouth();
    const maxLat = bounds.getNorth();
    const minLng = bounds.getWest();
    const maxLng = bounds.getEast();
    console.log("Sökområde:", { minLat, maxLat, minLng, maxLng });

    // Bygg din URL med dessa query-parametrar – anpassa endpointen efter din backend
    const url = `${import.meta.env.VITE_API_SAVE_LOCATION_URL}?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch geo data: ${response.status}`);
      }
      const data = await response.json();
      console.log("Hämtad geo-data:", data);
      // Förvänta att data returneras som { data: [...] }
      setGeoData(data.data || []);
    } catch (error: any) {
      console.error("Error fetching geo data:", error);
    }
  };

  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          {/* Publika Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterBuyer />} />
          <Route path="/LoginBuyer" element={<LoginBuyer />} />
          <Route path="/LoginSeller" element={<LoginSeller />} />

          {/* Privata Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/ListProductsBuyer" element={<ListProductsBuyer />} />
            <Route path="/seller/add-product" element={<AddProduct />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            {/* Route för kartan */}
            <Route path="/map" element={<MapView geoData={geoData} onSearch={onSearch} />} />
            <Route path="/seller/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/seller" element={<SellerLandingPage />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>
        </Routes>
        {/* En fast knapp för att navigera till kartvyn */}
        <div className="fixed bottom-4 right-4">
          <Link to="/map">
            <button className="px-4 hidden py-2 bg-green-500 text-white rounded">
              Visa karta
            </button>
          </Link>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;