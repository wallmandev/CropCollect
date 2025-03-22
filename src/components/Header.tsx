import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import HeaderPic from '../assets/images/pexels-pixabay-259280.jpg';
import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import ShoppingBagIcon from '../assets/images/shopping-bag-svgrepo-com.svg';
import { useCurrency } from "../context/CurrencyContext";

const Header = () => {
  const { totalItems } = useCart();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const loginStatus = localStorage.getItem("loginstatus") === "true";

    setRole(storedRole);
    setIsLoggedIn(loginStatus);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedRole = localStorage.getItem("role");
      const loginStatus = localStorage.getItem("loginstatus") === "true";

      setRole(storedRole);
      setIsLoggedIn(loginStatus);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCartClick = () => navigate("/cart");

  const handleLogin = () => navigate("/login");

  const handleProfileClick = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.setItem("loginstatus", "false");
    setRole(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    console.log("Menu toggled:", !isOpen);
  };

  useEffect(() => {
    console.log("Menu toggled:", isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  return (
    <header className="top-0 z-[1001] bg-transparent left-0 h-28 right-0 w-full flex justify-between items-center p-4 lg:h-24">
      <div className="absolute h-28 inset-0 bg-cover bg-center lg:hidden" style={{ backgroundImage: `url(${HeaderPic})` }}></div>
      <div className="relative z-[1001] flex justify-between items-center w-full">
        <button onClick={toggleMenu} className="lg:hidden flex flex-col gap-2 w-10 cursor-pointer">
          <div className={`rounded-2xl h-[2px] w-full bg-white transition-all duration-500 ${isOpen ? "rotate-45 translate-y-[10px] scale-110" : ""}`} />
          <div className={`rounded-2xl h-[2px] w-full bg-white transition-all duration-500 ${isOpen ? "opacity-0 scale-125 -translate-x-10" : ""}`} />
          <div className={`rounded-2xl h-[2px] w-full bg-white transition-all duration-500 ${isOpen ? "-rotate-45 -translate-y-[10px] scale-110" : ""}`} />
        </button>
        <a href="/" className="text-3xl font-extrabold text-white drop-shadow-lg">CropCollect</a>


        {/* DESKTOP MENU */}

        <div className="hidden lg:flex items-center gap-10 mr-16">
          {!isLoggedIn && (
            <>
              <a href="/" className="text-xl font-bold hover:text-gray-300 transition duration-300">Home</a>
              <a href="/about" className="text-xl font-bold hover:text-gray-300 transition duration-300">About</a>
              <a href="/contact" className="text-xl font-bold hover:text-gray-300 transition duration-300">Contact</a>
              <a href="/subscription" className="text-xl font-bold hover:text-gray-300 transition duration-300">Subscription</a>
            </>
          )}
          {isLoggedIn && role === "buyer" && (
            <>
              <a href="/marketplace" className="text-xl font-bold hover:text-gray-300 transition duration-300">Marketplace</a>
              <a href="/buyer/orders" className="text-xl font-bold hover:text-gray-300 transition duration-300">My Orders</a>
              <a href="/cart" className="text-xl font-bold hover:text-gray-300 transition duration-300">Cart</a>
              <a href="/map" className="text-xl font-bold hover:text-gray-300 transition duration-300">Map</a>
              <a onClick={handleProfileClick} className="text-xl font-bold hover:text-gray-300 transition duration-300">Profile</a>
              <a href="/support" className="text-xl font-bold hover:text-gray-300 transition duration-300">Support</a>
              <Button onClick={handleLogout} className="w-40">Logout</Button>
            </>
          )}
          {isLoggedIn && role === "seller" && (
            <>
              <a href="/dashboard" className="text-xl font-bold hover:text-gray-300 transition duration-300">Dashboard</a>
              <a href="/add-product" className="text-xl font-bold hover:text-gray-300 transition duration-300">Add Product</a>
              <Button onClick={handleLogout} className="w-40">Logout</Button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Button onClick={handleLogin} className="w-40">Login</Button>
              <Button className="w-40"><a href="/register">Register</a></Button>
            </>
          )}
        </div>


        <div className="flex items-center gap-4">
          {isLoggedIn && role === "buyer" && (
            <div className="relative">
              <img src={ShoppingBagIcon} alt="Shopping Bag" className="w-8 h-8 cursor-pointer" onClick={handleCartClick} />
              {totalItems > 0 && (
                <span className="absolute z-[1001] top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </div>
          )}
          <select value={currency} onChange={handleCurrencyChange} className="p-2 bg-transparent rounded text-white">
            <option value="SEK">SEK</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>


          {/* MOBILE MENU */}

          
        <Transition
          show={isOpen}
          enter="transition ease-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed z-[1001] top-28 left-0 w-full h-2/4 bg-[#5d9d67] shadow-lg flex flex-col justify-between items-center p-6 lg:hidden">
            <nav className="mt-10 flex flex-col gap-5 text-center">
              {!isLoggedIn && (
                <>
                  <a href="/" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Home</a>
                  <a href="/about" className="text-2xl font-bold hover:text-gray-300 transition duration-300">About</a>
                  <a href="/contact" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Contact</a>
                  <a href="/subscription" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Subscription</a>
                </>
              )}
              {isLoggedIn && role === "buyer" && (
                <>
                  <a href="/marketplace" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Marketplace</a>
                  <a href="/buyer/orders" className="text-2xl font-bold hover:text-gray-300 transition duration-300">My Orders</a>
                  <a href="/cart" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Cart</a>
                  <a href="/map" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Map</a>
                  <a onClick={handleProfileClick} className="text-2xl font-bold hover:text-gray-300 transition duration-300">Profile</a>
                  <a href="/support" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Support</a>
                  <Button onClick={handleLogout} className="w-40">Logout</Button>
                </>
              )}
              {isLoggedIn && role === "seller" && (
                <>
                  <a href="/dashboard" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Dashboard</a>
                  <a href="/add-product" className="text-2xl font-bold hover:text-gray-300 transition duration-300">Add Product</a>
                  <Button onClick={handleLogout} className="w-40">Logout</Button>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Button onClick={handleLogin} className="w-40">Login</Button>
                  <Button className="w-40"><a href="/register">Register</a></Button>
                </>
              )}
            </nav>
          </div>
        </Transition>
      </div>
    </header>
  );
};

export default Header;