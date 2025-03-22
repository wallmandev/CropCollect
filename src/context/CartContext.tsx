import React, { createContext, useContext, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
  description?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  checkoutCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Lägg till produkt i varukorgen
  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };
  

  // Uppdatera kvantitet
  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0) // Tar bort produkter med 0 kvantitet
    );
  };

  // Ta bort produkt från varukorgen
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Checkout - Skicka varukorgen till backend
  const checkoutCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token"); // Hämta JWT-token

      if (!userId || !token) {
        throw new Error("UserId or token is missing");
      }

      const payload = {
        buyer_id: userId,
        cart: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(`${import.meta.env.VITE_API_POST_CART_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to checkout cart");
      }

      const data = await response.json();
      console.log("Checkout successful:", data);
      setCart([]); // Töm varukorgen efter lyckad checkout
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Totalt antal produkter i varukorgen
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        checkoutCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook för att använda CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartContext };

