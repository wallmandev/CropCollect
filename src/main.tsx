import React from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './stripeConfig';
import App from './App';
import './index.css';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';

ReactDOM.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <CurrencyProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CurrencyProvider>
    </Elements>
  </React.StrictMode>,
  document.getElementById('root')
);