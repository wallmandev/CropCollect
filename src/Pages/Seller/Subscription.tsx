import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import SubscriptionCarousel from "../../components/Subscription-carusell";
import { Route, Routes, Navigate } from "react-router-dom";
import Square from "../../components/Square-animation";

const stripePromise = loadStripe("pk_test_51R3h6KCI58R9VXqMZOOILWsGqyWzRj3uav7q4B2002BsXXe54ywqKV1J7vH16pX6kIw58fPJHsbe0nyWdErLpJTe00sDGqCxPN");

const SubscriptionForm = () => {
  useEffect(() => {
    console.log('SubscriptionForm component mounted');
  }, []);

  const fetchClientSecret = useCallback(() => {
    console.log('fetchClientSecret called');
    return fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        line_items: [
          {
            price_data: {
              currency: "sek",
              product_data: { name: "Subscription for CropCollect" },
              unit_amount: 5900, // 59 SEK in öre
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Client secret received:', data.clientSecret);
        return data.clientSecret;
      })
      .catch((error) => {
        console.error('Error fetching client secret:', error);
      });
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <h1>Subscription for CropCollect</h1>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
        <p>If you see this message, the EmbeddedCheckout component did not render.</p>
      </EmbeddedCheckoutProvider>
    </div>
  );
};

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return <Navigate to="/subscription" />;
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          Thank you for subscribing to CropCollect! A confirmation email will be sent to {customerEmail}.
          If you have any questions, please email <a href="mailto:support@cropcollect.com">support@cropcollect.com</a>.
        </p>
      </section>
    );
  }

  return null;
};

const Subscription = () => {
  return (
    <div className="flex mt-16 flex-col items-center">
      <h1 className="font-semibold mx-4 mb-4 font-primary text-4xl">Prova gratis i 14 dagar.</h1>
      <h2 className="font-semibold mx-4 mb-16 font-secondary text-2xl">Ge din försäljning en boost!</h2>

      <SubscriptionCarousel />
      
      <Routes>
        <Route path="/subscription" element={<SubscriptionForm />} />
        <Route path="/return" element={<Return />} />
      </Routes>
    </div>
  );
};

export default Subscription;