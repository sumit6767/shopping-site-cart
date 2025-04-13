import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (product, action) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === product.id) {
            const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            if (newQuantity <= 0) return null; // Mark for removal
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean); // Remove nulls
    });
  };
  const getTotalItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const removeFromCart = (product) => {
    setCart(prev => prev.filter(item => item.id !== product.id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total, getTotalItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
