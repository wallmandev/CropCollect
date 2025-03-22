import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface orderDetails {
  name: string;
  category: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: string;
  product: string;
  orderDetails: orderDetails[];
  quantity: number;
  total: number;
  status: "New" | "Delivered" | "Accepted" | "Declined";
}

const SellerLandingPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const name = localStorage.getItem("name");

  // ✅ Hämta sellerId från localStorage vid sidladdning
  useEffect(() => {
    const storedSellerId = localStorage.getItem("userId");
    if (storedSellerId) {
      console.log("✅ SellerId hämtad från localStorage:", storedSellerId);
      setSellerId(storedSellerId);
    } else {
      console.error("❌ Ingen sellerId hittades i localStorage");
    }
  }, []);

  // 📦 **Hämta gamla ordrar från DynamoDB vid inloggning**
  useEffect(() => {
    if (!sellerId) return;
  
    const fetchOrders = async () => {
      const url = `${import.meta.env.VITE_API_GET_ORDERS_URL}?seller_id=${sellerId}`;
      console.log("🔍 Fetching orders from:", url);
  
      try {
        const response = await fetch(url);
        const text = await response.text(); // Kolla vad som returneras
        console.log("📝 API Response:", text);
  
        const data: Order[] = JSON.parse(text);
        setOrders(data);
        console.log(data);
      } catch (error) {
        console.error("❌ Fel vid hämtning av ordrar:", error);
      }
    };
  
    fetchOrders();
  }, [sellerId]);
  
  const updateOrderStatus = async (orderId: string, newStatus: "New" | "Accepted" | "Declined" | "Delivered") => {
    try {
      if (!sellerId) {
        console.error("❌ Ingen sellerId hittades i localStorage");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_PATCH_ORDERS_URL}`, { // 🔥 Korrekt URL
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, new_status: newStatus, seller_id: sellerId }), // 🔥 Skicka seller_id i body
      });

      if (!response.ok) throw new Error("Misslyckades att uppdatera order");

      const data = await response.json();
      console.log("✅ Orderstatus uppdaterad:", data);

      // 🔄 Uppdatera frontend genom att modifiera orders-listan
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        ) 
      );
    } catch (error) {
      console.error("❌ Fel vid uppdatering av orderstatus:", error);
    }
  };


  // 🚀 **WebSocket anslutning**
  useEffect(() => {
    if (!sellerId) return;

    let ws: WebSocket;
    const connectWebSocket = () => {
      ws = new WebSocket(`wss://dstqtyvte8.execute-api.eu-north-1.amazonaws.com/production/?seller_id=${sellerId}`);

      ws.onopen = () => {
        console.log("✅ WebSocket Connected!");
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        console.log("🔔 Ny order mottagen via WebSocket:", event.data);
        try {
          const newOrder: Order = JSON.parse(event.data);
          setOrders((prevOrders) => [newOrder, ...prevOrders]); // Lägg till i listan
        } catch (error) {
          console.error("❌ Kunde inte tolka inkommande order:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
      };

      ws.onclose = (event) => {
        console.warn(`⚠️ WebSocket Disconnected: ${event.reason}`);
        setSocket(null);
      };
    };

    connectWebSocket();

    return () => ws?.close();
  }, [sellerId]);

  // 📊 Dummy statistik
  const stats = [
    { category: "Today Sales", sales: 120 },
    { category: "Weekly Sales", sales: 950 },
    { category: "Monthly Sales", sales: 4800 },
  ];

  const pieData = {
    labels: stats.map((stat) => stat.category),
    datasets: [{ data: stats.map((stat) => stat.sales), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
  };

  const barData = {
    labels: stats.map((stat) => stat.category),
    datasets: [{ label: "Sales", data: stats.map((stat) => stat.sales), backgroundColor: "#36A2EB" }],
  };

  return (
    <>
      <div className="flex bg-gray-100 flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome {name || "Seller"}</h1>

        <div className="w-full flex gap-5 px-4 pb-4">
          <a href="#" className="min-w-[250px] max-w-[300px] flex-1 relative" onClick={() => navigate('/orders')}>
            <div className="w-full h-full bg-blue-400 shadow-lg rounded-lg p-6 text-white">
              <h2 className="text-3xl font-bold mb-4">{orders.length}</h2>
              <p className="font-semibold text-s w-full text-center">Orders</p>
            </div>
          </a>
        </div>

        <div className="w-full bg-white/50 backdrop-blur-lg shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Sales Statistics</h2>
          <div className="flex justify-center gap-8 mb-8">
            <div className="w-1/3 bg-white/40 backdrop-blur-md rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Category Distribution</h2>
              <Pie data={pieData} />
            </div>
            <div className="w-2/3 bg-white/40 backdrop-blur-md rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Total Sales</h2>
              <Bar data={barData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerLandingPage;