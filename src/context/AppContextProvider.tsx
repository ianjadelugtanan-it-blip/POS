import React, { useState, useEffect } from 'react';
import type { User, Product, Transaction, Order, CartItem } from '../types';
import { AppContext } from './AppContext';

import { API_BASE_URL } from '../config';

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We keep the logged-in user in localStorage for session persistence
  const [user, setUserState] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('pos_user');
    return saved ? JSON.parse(saved) : null;
  });

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) sessionStorage.setItem('pos_user', JSON.stringify(user));
    else sessionStorage.removeItem('pos_user');
  };

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posCart, setPosCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pos_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [clientCart, setClientCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('client_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch initial data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch Products
        const prodRes = await fetch(`${API_BASE_URL}/products/get.php`);
        if (prodRes.ok) setProducts(await prodRes.json());

        // Fetch Users (if admin)
        if (user?.role === 'admin') {
          const userRes = await fetch(`${API_BASE_URL}/users/get.php`);
          if (userRes.ok) setUsers(await userRes.json());
        }

        // Fetch Orders
        if (user) {
          const url = user.role === 'admin' 
            ? `${API_BASE_URL}/orders/get.php` 
            : `${API_BASE_URL}/orders/get.php?username=${encodeURIComponent(user.username)}`;
            
          const orderRes = await fetch(url);
          if (orderRes.ok) setOrders(await orderRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, [user?.role]);

  // Sync carts to localStorage
  useEffect(() => {
    localStorage.setItem('pos_cart', JSON.stringify(posCart));
  }, [posCart]);

  useEffect(() => {
    localStorage.setItem('client_cart', JSON.stringify(clientCart));
  }, [clientCart]);

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      user, setUser, users, setUsers, logout,
      products, setProducts,
      posCart, setPosCart,
      clientCart, setClientCart,
      transactions, setTransactions,
      orders, setOrders
    }}>
      {children}
    </AppContext.Provider>
  );
};
