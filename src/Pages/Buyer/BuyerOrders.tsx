import { useEffect, useState } from "react";

interface OrderDetails {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: string;
  orderDetails: OrderDetails[];
  status: string;
}

const BuyerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const buyerId = localStorage.getItem("userId");
        if (!buyerId) {
          throw new Error("No buyerId found in localStorage");
        }
        const response = await fetch(`${import.meta.env.VITE_API_GET_BUYER_ORDERS_URL}?buyer_id=${buyerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Order[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError((error as Error).message);
      }
    };
    fetchOrders();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Mina Beställningar</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id} className="border-b p-2">
            <p>📦 <strong>{order.orderDetails[0].name}</strong></p>
            <p>🔢 Quantity: {order.orderDetails[0].quantity}</p>
            <p>💰 Total: {order.orderDetails[0].price} SEK</p> 
            <p className="text-xs text-gray-500">Status: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerOrders;
