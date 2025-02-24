import { useEffect, useState } from "react";
import { Products } from "../../Interface/Products";
import { useCart } from "../../context/CartContext";
import MenuButton from "../../components/Button";

function ListProductsBuyer() {
  const [products, setProducts] = useState<Products[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  // Nytt state för radien (i meter)
  const [radius, setRadius] = useState<number>(3000);
  const { addToCart } = useCart();

  const fetchProducts = async (lat: number, lng: number, radius: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const url = `${import.meta.env.VITE_API_SAVE_LOCATION_URL}?lat=${lat}&lng=${lng}&radius=${radius}`;
      console.log(`Sending with: ${url}`);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched products:", data);
      const fetchedProducts = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setProducts(fetchedProducts);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setErrorMessage(error.message);
    }
  };

  // Hämta position och produkter när komponenten mountas
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User's location:", latitude, longitude);
          fetchProducts(latitude, longitude, radius);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setErrorMessage("Unable to retrieve your location. Please allow location access in your browser.");
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
    }
    // Kör om radien ändras
  }, [radius]);

  // Hantera ändring av radien via slider
  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value, 10);
    setRadius(newRadius);
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleCardClick = (product: Products) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="flex flex-col items-center mt-16">
      <h1 className="text-3xl font-bold mb-8">Produkter</h1>
      
      {/* Slider för att ändra radien */}
      <div className="mb-4">
        <label htmlFor="radiusSlider" className="mr-2">
          Radie: {radius} meter
        </label>
        <input
          id="radiusSlider"
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={radius}
          onChange={handleRadiusChange}
        />
      </div>
      
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-11/12">
      {products.map((product, index) => (
          <div key={product.product_id || index}
            onClick={() => handleCardClick(product)}
            className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <img
              src={product.imageUrl || "/default-placeholder.png"}
              alt={product.product_name}
              className="w-full h-32 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {product.product_name}
            </h2>
            <p className="text-lg font-medium text-green-600 mb-2">
              {product.price} kr
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(product.product_id, -1);
                  }}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{quantities[product.product_id] || 1}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(product.product_id, 1);
                  }}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
            >
              &times;
            </button>
            <img
              src={selectedProduct.imageUrl || "/default-placeholder.png"}
              alt={selectedProduct.product_name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.product_name}</h2>
            <p className="text-lg text-gray-700 mb-4">{selectedProduct.description}</p>
            <p className="text-lg text-gray-700 mb-4">
              Price:{" "}
              <span className="text-green-600 font-semibold">
                {selectedProduct.price} kr
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ListProductsBuyer;