import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import cartIcon from "../assets/images/Cart.svg";
import Button from "./Button";

const Header = () => {
  const { totalItems, checkoutCart } = useCart();
  const navigate = useNavigate();


  const handleCartClick = () => {
    checkoutCart();
    navigate("/Cart");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Ta bort JWT-token
    localStorage.removeItem("userId"); // Ta bort userId
    navigate("/"); // Navigera till login-sidan
  };

  return (
    <header className="flex hidden lg:absolute z-50 w-full justify-between items-center p-4">
      <a href="/"><h1 className="text-2xl font-bold">CropCollect</h1></a>
      <div className="relative flex gap-16 items-center">

      <button className="text-lg font-bold font-secondary">
        Home
      </button>

      <button className="text-lg font-bold font-secondary">
        About
      </button>

      <button className="text-lg font-bold font-secondary hover:text-secondary">
        Contact
      </button>
      
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
            {totalItems}
          </span>
        )}
        {/* Checkout-knapp */}
        <Button
        onClick={handleLogout}
        className=""
      >
        Login
      </Button>
          <button
          onClick={handleCartClick} // Gör cartIcon till en klickbar knapp
          className="relative hover:scale-110 transition-transform"
          aria-label="Open Cart and Checkout"
        >
          <img
            src={cartIcon}
            alt="Cart"
            className="w-10 h-10 cursor-pointer"
          />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
              {totalItems}
            </span>
          )}
        </button>

      </div>
    </header>
  );
};

export default Header;