import { useEffect, useState } from "react";
import MenuButton from "../../components/Button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  timestamp: number;
  productId: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hämtar kundvagnsdata
  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      console.log("Token used:", token);

      if (!userId || !token) {
        throw new Error("UserId or token is missing");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_GET_CART_URL}?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }

      const data = await response.json();
      setCartItems(data);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tar bort en produkt från kundvagnen
  const handleRemove = async (timestamp: number) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("UserId or token is missing");
      }

      const response = await fetch(`${import.meta.env.VITE_API_DELETE_CART_URL}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, timestamp }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setCartItems((prev) => prev.filter((item) => item.timestamp !== timestamp));
    } catch (err: any) {
      console.error("Error deleting item:", err);
      setError(err.message);
    }
  };

  // Uppdaterar kvantitet för en produkt
  const updateQuantity = async (timestamp: number, delta: number) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("UserId or token is missing");
      }

      const response = await fetch(`${import.meta.env.VITE_API_PATCH_CART_URL}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, timestamp, quantityChange: delta }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const { updatedItem } = await response.json();
      setCartItems((prev) =>
        prev.map((item) =>
          item.timestamp === updatedItem.timestamp
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message);
    }
  };

  // Hämtar kundvagnsdata vid första renderingen
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <section className="flex flex-col items-center mt-16">
      <h1 className="text-3xl font-bold mb-8">Din Kundvagn</h1>

      {loading && <p>Laddar...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-3/4 bg-white shadow-lg rounded-lg p-6">
        {cartItems.length === 0 && !loading ? (
          <p>Din kundvagn är tom.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li
                key={`${item.timestamp}-${item.productId}`}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    {item.price} kr x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.timestamp, -1)}
                    className="px-2 bg-gray-200 rounded"
                    disabled={loading}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.timestamp, 1)}
                    className="px-2 bg-gray-200 rounded"
                    disabled={loading}
                  >
                    +
                  </button>
                  <MenuButton
                    onClick={() => handleRemove(item.timestamp)}
                    className="bg-red-500 text-white"
                  >
                    Ta bort
                  </MenuButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Cart;

