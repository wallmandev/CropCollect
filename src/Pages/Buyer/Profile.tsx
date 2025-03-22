import { useState } from "react";
import { FaUser, FaBox, FaHeart, FaCog, FaSignOutAlt, FaMapMarkerAlt, FaCreditCard, FaBell } from "react-icons/fa";
import Button from "../../components/Button";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("account");

  const menuItems = [
    { id: "account", label: "Account", icon: <FaUser /> },
    { id: "orders", label: "Orders", icon: <FaBox /> },
    { id: "address", label: "Address", icon: <FaMapMarkerAlt /> },
    { id: "payment", label: "Payment", icon: <FaCreditCard /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center mb-4">My Profile</h2>

      {/* Menu */}
      <div className="bg-white shadow rounded-lg p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg text-lg font-semibold transition-all ${
              activeTab === item.id ? "bg-green-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 p-4 bg-white shadow rounded-lg">
        {activeTab === "account" && <p>Update your account details here...</p>}
        {activeTab === "orders" && <p>View your order history...</p>}
        {activeTab === "wishlist" && <p>See your saved items...</p>}
        {activeTab === "address" && <p>Manage your shipping addresses...</p>}
        {activeTab === "payment" && <p>Manage payment methods...</p>}
        {activeTab === "notifications" && <p>Customize your notification settings...</p>}
        {activeTab === "settings" && <p>Adjust general account settings...</p>}
      </div>

      {/* Logout Button */}
      <div className="mt-6 text-center">
        <Button className="bg-red-500 text-white w-full flex items-center justify-center gap-2">
          <FaSignOutAlt /> Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;