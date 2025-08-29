import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      return;
    }
    
    try {
      const response = await api.get("/cart/count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);