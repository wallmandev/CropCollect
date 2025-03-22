import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";

interface Seller {
  userId: string;
  name: string;
  businessAddress: string;
  openHours?: Record<string, string>;
}

interface Product {
  product_id: string;
  product_name: string;
  price: string;
  category: string;
  unit: string;
  imageUrl?: string;
}

function StoreProducts() {
  const { storeId } = useParams<{ storeId: string }>();
  console.log("🔍 storeId från URL:", storeId);
  const location = useLocation();
  const [seller, setSeller] = useState<Seller | null>(location.state?.seller || null);
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { currency } = useCurrency();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prevQuantity) => Math.max(prevQuantity + delta, 1));
  };

  useEffect(() => {
    if (!storeId) return;
    const fetchSeller = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");
        const url = `${import.meta.env.VITE_API_GET_SELLER_URL}?userId=${storeId}`;
        console.log("📡 Fetching seller:", url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch seller: ${response.status}`);
        const data = await response.json();
        setSeller(data); // ✅ Spara säljardata i state
      } catch (error: any) {
        console.error("❌ Error fetching seller:", error);
        setErrorMessage(error.message);
      }
    };
    if (!seller) {
      fetchSeller(); // 🔹 Endast hämta om `seller` inte finns i `state`
    }
  }, [storeId]); // 🛠 Se till att den uppdateras när `storeId` ändras

  useEffect(() => {
    if (!storeId) return;
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");
        const url = `${import.meta.env.VITE_API_GET_PRODUCTS_URL}?seller_id=${storeId}`;
        console.log("📡 Fetching products:", url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        setProducts(data.data);
        console.log("✅ Products:", data.data);
      } catch (error: any) {
        console.error("❌ Error fetching products:", error);
        setErrorMessage(error.message);
      }
    };
    fetchProducts();
  }, [storeId]); // 🛠 Se till att denna körs när `storeId` ändras

  return (
    <section className="flex flex-col items-center mt-16">
      {seller ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{seller.name}'s Store</h1>
          <p className="text-lg text-gray-700 mb-4">{seller.businessAddress}</p>
        </>
      ) : (
        <h1 className="text-3xl font-bold mb-4">Loading Store...</h1>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-11/12">
        {products.map((product) => (
          <div key={product.product_id} className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white">
            <img src={product.imageUrl || "/default-placeholder.png"} alt={product.product_name} className="w-full h-32 object-cover mb-4 rounded" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.product_name}</h2>
            <p className="text-lg font-medium text-green-600 mb-2">{product.price} {currency} / {product.unit}</p>
            <div className="flex justify-center items-center mb-2">
              <button onClick={() => handleQuantityChange(-1)} className="px-2 py-1 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">-</button>
              <span className="mx-2 text-lg">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="px-2 py-1 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">+</button>
            </div>
            <button 
              onClick={() => {
                addToCart(
                  {
                    id: product.product_id,
                    name: product.product_name,
                    price: parseFloat(product.price),
                    category: product.category,
                    image: product.imageUrl,
                    seller_id: storeId, // Add seller_id to cart item
                  }, 
                  quantity
                );
                localStorage.setItem('sellerId', storeId); // Save seller_id to local storage
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StoreProducts;