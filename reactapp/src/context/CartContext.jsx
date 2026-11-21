import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const auth = useAuth();
  const isAuthenticated = auth ? auth.isAuthenticated : false;

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [cartRes, menuRes] = await Promise.all([
        api.get('/carts'),
        api.get('/menus')
      ]);
      const backendCarts = cartRes.data || [];
      const menus = menuRes.data || [];
      
      const mapped = backendCarts.map(cartRecord => {
        const menuItem = menus.find(m => m.id === cartRecord.menuItemId);
        if (!menuItem) return null;
        return {
          ...menuItem,
          cartRecordId: cartRecord.id,
          quantity: cartRecord.quantity,
          specialInstructions: cartRecord.specialInstructions
        };
      }).filter(Boolean);
      
      setCartItems(mapped);
    } catch (e) {
      console.error("Failed to load cart items from backend", e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (item, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }
    try {
      await api.post('/carts', {
        menuItemId: item.id,
        quantity: quantity,
        specialInstructions: ''
      });
      await fetchCart();
      toast.success(`${item.itemName} added to cart`);
    } catch (e) {
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (menuItemId) => {
    const item = cartItems.find((ci) => ci.id === menuItemId);
    if (!item) return;
    try {
      await api.delete(`/carts/${item.cartRecordId}`);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (e) {
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    const item = cartItems.find((ci) => ci.id === menuItemId);
    if (!item) return;

    if (quantity <= 0) {
      await removeFromCart(menuItemId);
      return;
    }

    try {
      await api.put(`/carts/${item.cartRecordId}`, {
        menuItemId: menuItemId,
        quantity: quantity,
        specialInstructions: item.specialInstructions || ''
      });
      await fetchCart();
    } catch (e) {
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      await Promise.all(cartItems.map((item) => api.delete(`/carts/${item.cartRecordId}`)));
      await fetchCart();
    } catch (e) {
      toast.error('Failed to clear cart');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
