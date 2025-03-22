import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "../../components/Button";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionRate, setConversionRate] = useState<number>(1);
  const navigate = useNavigate();

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

  const handleRemove = async (id: string) => {
    try {
      setLoading(true);
      removeFromCart(id);
    } catch (err: any) {
      console.error("Error deleting item:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id: string, delta: number) => {
    try {
      setLoading(true);
      updateQuantity(id, delta);
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate('/buyer/checkout');
  };

  return (
    <section className="flex flex-col items-center mt-16">
      <h1 className="text-3xl font-bold mb-8">Din Kundvagn</h1>
      {loading && <p>Laddar...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-5/6 bg-white shadow-lg rounded-lg p-6">
        {cartItems.length === 0 && !loading ? (
          <p>Din kundvagn är tom.</p>
        ) : (
          <ul>
            {cartItems.map((item: any) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    {(item.price / conversionRate).toFixed(2)} {currency} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="px-2 bg-gray-200 rounded"
                    disabled={loading}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="px-2 bg-gray-200 rounded"
                    disabled={loading}
                  >
                    +
                  </button>
                  <MenuButton
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-500 text-white"
                  >
                    Remove
                  </MenuButton>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cartItems.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCheckout}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Gå till Checkout
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;