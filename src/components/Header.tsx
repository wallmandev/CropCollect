import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import HeaderPic from '../assets/images/pexels-pixabay-259280.jpg'
import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

const Header = () => {
  const { totalItems, checkoutCart } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCartClick = () => {
    checkoutCart();
    navigate("/Cart");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Ta bort JWT-token
    localStorage.removeItem("userId"); // Ta bort userId
    navigate("/"); // Navigera till login-sidan
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <header className="top-0 left-0 h-28 right-0 z-50 w-full flex justify-between items-center p-4 lg:h-24">
      <div className="absolute h-28 inset-0 bg-cover bg-center lg:hidden" style={{ backgroundImage: `url(${HeaderPic})` }}></div>
      <div className="relative z-10 flex justify-between items-center w-full">
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-2xl font-secondary text-white relative">
            <div className="space-y-1">
              <span className={`block w-8 h-1 bg-white transform transition duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-9 h-1 bg-white transition duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-8 h-1 bg-white transform transition duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>
        <a href="/" className="text-3xl font-extrabold text-white drop-shadow-lg ml-auto">CropCollect</a>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed top-0 mt-28 left-0 h-5/6 w-1/3 border-r-2 border-b-2 border-secondary justify-between bg-myColor shadow-md rounded-r-lg rounded-t-none p-4 z-50 lg:hidden">
            <div className="flex flex-col items-center gap-4 justify-between h-full">
              <div className="flex flex-col mt-44 items-center gap-5 justify-between">
                <a href="/" className="text-2xl font-bold font-secondary hover:text-gray-300 transition duration-300">Home</a>
                <a href="/about" className="text-2xl font-bold font-secondary hover:text-gray-300 transition duration-300">About</a>
                <a href="/products" className="text-2xl font-bold font-secondary hover:text-gray-300 transition duration-300">Services</a>
                <a href="/contact" className="text-2xl font-bold font-secondary hover:text-gray-300 transition duration-300">Contact</a>
              </div>
              <div className="flex flex-col gap-4 items-center">
                <Button className="w-40"><a href="/login" className="bottom-0 text-lg font-bold font-secondary hover:text-gray-300 transition duration-300">Login</a></Button>
                <Button className="w-40"><a href="/register" className="bottom-0 text-lg font-bold font-secondary hover:text-gray-300 transition duration-300">Register</a></Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>
  );
};

export default Header;