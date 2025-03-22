import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import LandingPage from "./Pages/Landing";
import Login from "./Pages/Login";
import LoginBuyer from "./Pages/Buyer/LoginBuyer";
import LoginSeller from "./Pages/Seller/LoginSeller";
import RegisterBuyer from "./Pages/Buyer/RegisterBuyer";
import ListProductsBuyer from "./Pages/Buyer/ListProductsBuyer";
import SellerLandingPage from "./Pages/Seller/SellerLanding";
import StoreProducts from './Pages/Buyer/StoreProducts';
import AddProduct from "./Pages/Seller/AddProducts";
import ConfirmationPage from "./Pages/Seller/ConfirmationPage";
import Checkout from "./Pages/Buyer/Checkout";
import MapView from "./Pages/Buyer/MapView";
import Cart from "./Pages/Buyer/Cart";
import Orders from "./Pages/Seller/Orders";
import Inventory from "./Pages/Seller/Inventory";
import PrivateRoute from "./Interface/PrivateRoute";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { GeoData } from "./Interface/GeoData";
import L from "leaflet";
import SellerProfile from "./Pages/Seller/SellerProfile";
import CheckoutComplete from './Pages/Buyer/CheckoutComplete';
import OAuthCallback from './Pages/Buyer/OAuthCallback';
import Profile from "./Pages/Buyer/Profile";
import Subscription from "./Pages/Seller/Subscription";
import BuyerOrders from "./Pages/Buyer/BuyerOrders";
import './App.css';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
const stripePromise = loadStripe("pk_test_51R3h6KCI58R9VXqMZOOILWsGqyWzRj3uav7q4B2002BsXXe54ywqKV1J7vH16pX6kIw58fPJHsbe0nyWdErLpJTe00sDGqCxPN");

const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    );
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.

          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};

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
          <Route path="/Login" element={<Login />} />
          <Route path="/LoginBuyer" element={<LoginBuyer />} />
          <Route path="/LoginSeller" element={<LoginSeller />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

          {/* Privata Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/marketplace" element={<ListProductsBuyer />} />
            <Route path="/seller/add-product" element={<AddProduct />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/buyer/checkout" element={<Checkout />} />
            <Route path="/store/:storeId" element={<StoreProducts />} />
            <Route path="/profile/:userId" element={<Profile/>} />
            {/* Route för kartan */}
            <Route path="/map" element={<MapView geoData={geoData} onSearch={onSearch} />} />
            <Route path="/seller/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/seller" element={<SellerLandingPage />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/seller/profile" element={<SellerProfile />} />
            <Route path="/checkout-complete" element={<CheckoutComplete />} />
          </Route>
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route path="/subscription/*" element={<Subscription />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/return" element={<Return />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;