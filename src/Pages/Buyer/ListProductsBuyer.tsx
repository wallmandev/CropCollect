import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Back from '../../components/Back';
import MapButton from '../../components/MapButton';

interface Seller {
  userId: string; // Uppdaterad från user_id
  name: string;   // Uppdaterad från businessName
  businessAddress: string;
}

function ListProductsBuyer() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [radius, setRadius] = useState<number>(3000);
  const navigate = useNavigate();

  const fetchSellers = async (lat: number, lng: number, radius: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");
  
      // 🔹 Hämta säljarnas platser från usergeo
      const geoUrl = `${import.meta.env.VITE_API_SAVE_LOCATION_URL}?lat=${lat}&lng=${lng}&radius=${radius}`;
      console.log("📡 Fetching seller locations:", geoUrl);
      
      const geoResponse = await fetch(geoUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!geoResponse.ok) throw new Error(`Failed to fetch sellers: ${geoResponse.status}`);
      const geoData = await geoResponse.json();
      console.log("✅ Sellers from geo:", geoData);
  
      // 🔹 Hämta namn från user-tabellen för varje seller
      const sellersWithName = await Promise.all(
        geoData.data.map(async (seller: { user_id: string; businessAddress: string }) => {
          try {
            const userUrl = `${import.meta.env.VITE_API_GET_SELLER_URL}?userId=${seller.user_id}`; // ⬅️ Skickar userId som query-param
            console.log("📡 Fetching user data from:", userUrl);
  
            const userResponse = await fetch(userUrl, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
  
            if (!userResponse.ok) {
              console.error(`❌ Failed to fetch user data for ${seller.user_id}:`, await userResponse.text());
              return { ...seller, name: "Unknown Store" };
            }
  
            const userData = await userResponse.json();
            console.log(`✅ User data for ${seller.user_id}:`, userData);
  
            return { ...seller, name: userData.name || "Unknown Store", userId: userData.userId };
          } catch (error) {
            console.error(`❌ Error fetching user data for ${seller.user_id}:`, error);
            return { ...seller, name: "Unknown Store" };
          }
        })
      );
  
      setSellers(sellersWithName);
      console.log("✅ Sellers with names:", sellersWithName);
    } catch (error: any) {
      console.error("❌ Error in fetchSellers:", error);
      setErrorMessage(error.message);
    }
};

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude < 50 || latitude > 70 || longitude < -30 || longitude > 50) {
            fetchSellers(55.25941109999999, 14.7757544, radius);
          } else {
            fetchSellers(latitude, longitude, radius);
          }
        },
        () => {
          setErrorMessage("Platsdata kunde inte hämtas. Aktivera platsåtkomst i webbläsaren.");
          fetchSellers(55.25941109999999, 14.7757544, radius);
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
      fetchSellers(55.25941109999999, 14.7757544, radius);
    }
  }, [radius]);

  // 🆕 Navigera till butikssidan med `userId`
  const handleSellerClick = (seller: Seller) => {
    navigate(`/store/${seller.userId}`); // 🏪 Använd `userId` istället för `businessName`
  };

  return (
    <section className="flex h-full flex-col items-center mt-10">
      <div className="flex h-24 w-full mb-4 gap-16 justify-center items-center">
        <h1 className="text-3xl font-bold">Shops near you</h1>
      </div>

      {/* Radie slider */}
      <div className="mb-4">
        <label htmlFor="radiusSlider" className="mr-2">
          Radius: {radius} meters
        </label>
        <input
          id="radiusSlider"
          type="range"
          min="1000"
          max="15000"
          step="500"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
          className="cursor-pointer"
        />
      </div>

      {/* Error message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Seller list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-11/12">
        {sellers.map((seller, index) => (
          <div
            key={seller.userId || index}
            onClick={() => handleSellerClick(seller)}
            className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <h2 className="text-xl text-center font-semibold mb-2 text-gray-800">
              {seller.name || "Unnamed Store"}
            </h2>
            <p className="text-lg text-center font-medium text-gray-600 mb-2">
              {seller.businessAddress}
            </p>
            <div className="w-full flex justify-center">
              <Link
                to={seller.userId ? `/store/${seller.userId}` : "#"}
                state={seller.userId ? { seller } : undefined}
                className="px-4 py-2 flex w-1/2 justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Go to store
              </Link>
            </div>

          </div>

))}
      </div>
      <MapButton className="w-14 border bg-myColor rounded-full right-10 p-2 h-14 absolute bottom-10" />
    </section>
  );
}

export default ListProductsBuyer;

