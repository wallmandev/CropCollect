import React from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutComplete: React.FC = () => {
  const location = useLocation();
  const { items } = location.state || { items: [] };

  return (
    <div>
      <h1>Booking Complete</h1>
      <p>Thank you for your booking! Here are the items you booked:</p>
      <ul>
        {items.map((item: any, index: number) => (
          <li key={index}>{item.name} - {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default CheckoutComplete;