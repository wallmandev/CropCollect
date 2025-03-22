import { useEffect, useState } from "react";

interface OrderDetails {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: string;
  buyer_id: string;
  orderDetails: OrderDetails[];
  status: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const sellerId = localStorage.getItem("userId");
        if (!sellerId) {
          throw new Error("No sellerId found in localStorage");
        }
        const response = await fetch(`${import.meta.env.VITE_API_GET_ORDERS_URL}?seller_id=${sellerId}`);
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const sellerId = localStorage.getItem("userId");
      if (!sellerId) {
        throw new Error("No sellerId found in localStorage");
      }
      const order = orders.find((order) => order.order_id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      const payload = { order_id: orderId, new_status: newStatus, seller_id: sellerId, buyer_id: order.buyer_id, orderDetails: order.orderDetails };
      console.log("Request payload:", payload);
      const response = await fetch(`${import.meta.env.VITE_API_PATCH_ORDERS_URL}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update order");
      const data = await response.json();
      console.log("Order status updated:", data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Beställningar</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id} className="border-b p-2">
            <p>📦 <strong>{order.orderDetails[0].name}</strong></p>
            <p>🔢 Quantity: {order.orderDetails[0].quantity}</p>
            <p>💰 Total: {order.orderDetails[0].price} SEK</p>
            <p className="text-xs text-gray-500">Status: {order.status}</p>
            {order.status === "pending" && (
              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={() => updateOrderStatus(order.order_id, "Accepted")}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateOrderStatus(order.order_id, "Declined")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Decline
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;