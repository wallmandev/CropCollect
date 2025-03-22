import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  planId: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ planId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleCheckout = async () => {
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lookup_key: planId,
      }),
    });
    const session = await response.json();

    if (stripe && elements) {
      const result = await stripe.confirmCardPayment(session.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        console.error(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        window.location.href = '/subscription-complete';
      }
    }
  };

  return (
    <div>
      <CardElement />
      <button onClick={handleCheckout} className="px-4 py-2 bg-blue-500 text-white rounded">
        Prenumerera
      </button>
    </div>
  );
};

export default PaymentForm;