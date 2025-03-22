import React, { useState, useEffect, useRef } from "react";
import PaymentForm from "../../components/PaymentForm";

const GOOGLE_API_KEY = import.meta.env.VITE_API_GOOGLE_MAPS_KEY;

interface OpenHours {
  [day: string]: { open: string; close: string; isOpen: boolean; isClosed: boolean };
}

interface Suggestion {
  description: string;
  placeId: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  businessAddress: string;
  latitude?: number;
  longitude?: number;
  openHours: OpenHours;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    businessAddress: "",
    latitude: undefined,
    longitude: undefined,
    openHours: daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { open: "", close: "", isOpen: false, isClosed: false },
      }),
      {} as OpenHours
    ),
  });

  const [timePickerVisibility, setTimePickerVisibility] = useState<Record<string, boolean>>(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: true }), {})
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement("div"));
    } else if (!document.querySelector("#google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement("div"));
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "businessAddress" && value.length > 2) {
      autocompleteServiceRef.current?.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.map((p) => ({ description: p.description, placeId: p.place_id })));
          } else {
            setSuggestions([]);
          }
        }
      );
    }
  };

  const handleOpenHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      openHours: {
        ...prev.openHours,
        [day]: { ...prev.openHours[day], [field]: value },
      },
    }));
  };

  const handleTimeChange = (day: string, field: string, value: string) => {
    handleOpenHoursChange(day, field, value);
    const currentDay = formData.openHours[day];
    const openVal = field === "open" ? value : currentDay.open;
    const closeVal = field === "close" ? value : currentDay.close;
    if (openVal && closeVal) {
      setTimePickerVisibility((prev) => ({ ...prev, [day]: false }));
    }
  };

  const handleTimeEdit = (day: string) => {
    setTimePickerVisibility((prev) => ({ ...prev, [day]: true }));
  };

  const handleSuggestionClick = (placeId: string, address: string) => {
    if (!placesServiceRef.current) return;
    placesServiceRef.current.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
        setFormData((prev) => ({
          ...prev,
          businessAddress: address,
          latitude: place.geometry?.location?.lat(),
          longitude: place.geometry?.location?.lng(),
        }));
      }
    });
    setSuggestions([]);
  };

  const getCoordinatesFromAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Misslyckades med att hämta koordinater");
      const data = await response.json();
      if (data.status !== "OK") throw new Error(`Status: ${data.status}`);
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setErrorMessage(""); // Rensa tidigare fel
  
    // Validera lösenord
    if (formData.password.length < 8) {
      setErrorMessage("Lösenordet måste vara minst 8 tecken långt.");
      return;
    }

    // Validera öppettider för säljare
    if (formData.role === "seller") {
      for (const day of daysOfWeek) {
        const { isOpen, isClosed } = formData.openHours[day];
        if (isOpen && isClosed) {
          setErrorMessage(`För ${day} kan du inte ha både 'Open' och 'Closed' markerat.`);
          return;
        }
      }
    }

    if (formData.role === "seller") {
      <PaymentForm planId="planId" />
    }

    try {
      let updatedFormData = { ...formData };

      // Om säljare och koordinater saknas, hämta dem via Google Geocode API
      if (formData.role === "seller" && (!formData.latitude || !formData.longitude)) {
        const coords = await getCoordinatesFromAddress(formData.businessAddress);
        if (coords) {
          updatedFormData = { ...updatedFormData, latitude: coords.latitude, longitude: coords.longitude };
        } else {
          throw new Error("Kunde inte hämta koordinater för adressen");
        }
      }

      // 📝 **1. Registrera användaren via Lambda**
      const registerResponse = await fetch(`${import.meta.env.VITE_API_REGISTER_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (!registerResponse.ok) throw new Error("Failed to register user");
      const registerData = await registerResponse.json();
      const newUserId = registerData.userId;

      if (!newUserId) throw new Error("Backend returnerade inget userId");

      // 📌 **2. Spara användar-ID i LocalStorage**
      localStorage.setItem("userId", newUserId);

      // 📍 **3. Om säljare, skicka geo-data till usergeo**
      if (updatedFormData.role === "seller") {
        const geoData = {
          userId: newUserId,
          businessAddress: updatedFormData.businessAddress,
          latitude: updatedFormData.latitude,
          longitude: updatedFormData.longitude,
        };

        console.log("📡 Sending geo-data to SAVE_LOCATION_URL:", geoData);
  
        const locationResponse = await fetch(`${import.meta.env.VITE_API_SAVE_LOCATION_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geoData),
        });

        if (!locationResponse.ok) throw new Error("Failed to save location");
      }

      // ✅ **4. Registrering klar – visa bekräftelse**
      alert("Account created successfully!");

      // 🚀 **5. Om säljare – Redirect till Stripe**
      if (updatedFormData.role === "seller") {
        handleStripeConnect(newUserId);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
};


  const handleStripeConnect = async (userId: string) => {
    localStorage.setItem("userId", userId); // Spara userId i LocalStorage

    // 🏦 Redirect till Stripe Connect
    window.location.href = `https://connect.stripe.com/oauth/authorize?redirect_uri=${window.location.origin}/oauth-callback&client_id=ca_RtklwgMcbDxvMJgJPUp05UVTJTOjNfu2&state=onbrd_RtkuBMVlcyC3on8V4UpQA2uxxe&response_type=code&scope=read_write&stripe_user[country]=SE`;
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-1xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-2xl bg-white bg-opacity-80 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800 drop-shadow-lg">Create Account</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-gray-100 col-span-1 md:col-span-2"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-gray-100 col-span-1 md:col-span-2"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-gray-100 col-span-1 md:col-span-2"
                required
              />
              <select name="role" value={formData.role} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-gray-100 col-span-1 md:col-span-2">
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
              {formData.role === "seller" && (
                <>
                  <PaymentForm planId="planId" />
                  <input
                    type="text"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    placeholder="Business address"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-gray-100 col-span-1 md:col-span-2"
                    required
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute bg-white border border-gray-300 w-full z-50 rounded-lg shadow-lg col-span-1 md:col-span-2">
                      {suggestions.map((s, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(s.placeId, s.description)}
                          className="p-3 cursor-pointer hover:bg-gray-100"
                        >
                          {s.description}
                        </li>
                      ))}
                    </ul>
                  )}
                  <h3 className="text-lg font-semibold mt-4 text-gray-800 drop-shadow-lg col-span-1 md:col-span-2">Öppettider:</h3>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex flex-col gap-2 col-span-1 md:col-span-2">
                      <div className="flex gap-2 items-center">
                        <label className="w-24 text-gray-800 drop-shadow-lg">{day}</label>
                        <input
                          type="checkbox"
                          checked={formData.openHours[day].isOpen}
                          onChange={(e) => handleOpenHoursChange(day, "isOpen", e.target.checked)}
                          disabled={formData.openHours[day].isClosed}
                        />
                        <label className="text-gray-800 drop-shadow-lg">Open</label>
                        <input
                          type="checkbox"
                          checked={formData.openHours[day].isClosed}
                          onChange={(e) => handleOpenHoursChange(day, "isClosed", e.target.checked)}
                          disabled={formData.openHours[day].isOpen}
                        />
                        <label className="text-gray-800 drop-shadow-lg">Closed</label>
                      </div>
                      {formData.openHours[day].isOpen && !formData.openHours[day].isClosed && (
                        <>
                          {timePickerVisibility[day] ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="time"
                                value={formData.openHours[day].open}
                                onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-gray-100"
                              />
                              <span className="text-gray-800 drop-shadow-lg">-</span>
                              <input
                                type="time"
                                value={formData.openHours[day].close}
                                onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-gray-100"
                              />
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center cursor-pointer" onClick={() => handleTimeEdit(day)}>
                              <span className="text-gray-800 drop-shadow-lg">
                                {formData.openHours[day].open} - {formData.openHours[day].close} (Ändra)
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
              {errorMessage && <p className="text-red-500 col-span-1 md:col-span-2">{errorMessage}</p>}
              <button type="submit" className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 shadow-lg col-span-1 md:col-span-2">
                Create Account
              </button>
            </form>
          </div>
          <div className="hidden md:block w-1/2">
            <img src="/src/assets/images/vegetables_picture.jpg" alt="Vegetables" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;