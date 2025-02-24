import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SellerAside = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Länkar i menyn
  const links = [
    { to: "/seller", label: "Home" },
    { to: "/seller/add-product", label: "Add new product" },
    { to: "/orders", label: "Orders" },
    { to: "/inventory", label: "Inventory" },
    { to: "/seller/profile", label: "Profile" },
    { to: "/logout", label: "Sign Out", red: true },
  ];

  // Variants för animationen
  const menuVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1, // Skapa en "trappa"-effekt
        duration: 0.2,
      },
    }),
  };

  const parentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger för att trigga barnens animation
      },
    },
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-3" : "w-64"
      } h-screen bg-gray-800 text-white fixed -left-2 top-0 shadow-lg transition-all duration-300 z-50`}
    >
      <div className="relative h-full">
        {/* Collapse Button */}
        <button
          onClick={toggleMenu}
          className="absolute top-1/2 h-20 -right-5 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-md shadow-md focus:outline-none"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        {/* Menu Content */}
        <div className={`p-6 ${isCollapsed ? "hidden" : "block"}`}>
          <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
          <motion.nav
            initial={isCollapsed ? "hidden" : "hidden"}
            animate={isCollapsed ? "hidden" : "visible"}
            variants={parentVariants} // Använd parent variants för stagger
            className="flex flex-col gap-4"
          >
            {links.map((link, index) => (
              <motion.a
                key={index} // Ge varje länk en unik nyckel
                custom={index} // Skicka index till varianten
                variants={menuVariants} // Använd barnens animation
                href={link.to}
                className={`hover:bg-gray-700 text-center p-3 rounded-md transition ${
                  link.red ? "hover:bg-red-600" : "hover:bg-gray-700"
                }`}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
        </div>
      </div>
    </aside>
  );
};

export default SellerAside;



