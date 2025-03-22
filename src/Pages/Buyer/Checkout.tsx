import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import './Checkout.css'; // Import the new CSS file
import { useCurrency } from '../../context/CurrencyContext';

const Checkout: React.FC = () => {
  const { cartItems, totalAmount } = useCart();
  const { currency } = useCurrency();
  const [conversionRate, setConversionRate] = useState<number>(1);

  useEffect(() => {
    const getConversionRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        const data = await response.json();
        setConversionRate(data.rates.SEK);
        console.log('Fetched conversion rate:', data.rates.SEK); // Log the fetched conversion rate
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    getConversionRate();
  }, [currency]);

  const handleBooking = async () => {
    try {
        if (cartItems.length === 0) {
            console.error("Cart is empty");
            return;
        }

        const seller_id = localStorage.getItem("sellerId");
        const buyer_id = localStorage.getItem("userId");
        console.log("seller_id:", seller_id);
        console.log("buyer_id:", buyer_id);
        if (!seller_id) {
            console.error("seller_id is missing");
            return;
        }
        if (!buyer_id) {
            console.error("buyer_id is missing");
            return;
        }

        const orderDetails = cartItems.map((item) => ({
            id: item.id,
            created_at: new Date().toISOString(),
            buyer_id,
            seller_id,
            product_name: item.name,
            price: item.price,
            description: item.description || '',
            quantity: item.quantity.toString() // Ensure quantity is a string
        }));

        const payload = orderDetails[0]; // Send only the first item in the orderDetails array
        console.log("Request payload:", payload);

        const postResponse = await fetch(`${import.meta.env.VITE_API_POST_PRODUCTS_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!postResponse.ok) {
            const errorText = await postResponse.text();
            console.error("Failed to create order:", errorText);
            return;
        }

        const postData = await postResponse.json();
        const id = postData.product.id;

        console.log("✅ Order skapad med ID:", id);

    } catch (error) {
        console.error("❌ Error booking order:", error);
    }
};

return (
    <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="flex items-center justify-center">
            {cartItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-center gap-5">
                    <img className="w-1/3" src={item.image}></img>
                    <p className="item-name">{item.name}</p>
                    <p className="">Quantity: {item.quantity}</p>
                    <p className="item-price">{(item.price / conversionRate).toFixed(2)} {currency}</p>
                </div>
            ))}
        </div>
        <h2 className="checkout-total">Total: {(totalAmount / conversionRate).toFixed(2)} {currency}</h2>
        <button onClick={handleBooking} className="book-button">Boka</button>
    </div>
);
};

export default Checkout;