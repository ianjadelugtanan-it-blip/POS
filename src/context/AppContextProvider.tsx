import React, { useState, useEffect } from 'react';
import type { User, Product, Transaction, Order, CartItem } from '../types';
import { AppContext } from './AppContext';

export const API_BASE_URL = 'http://localhost/api'; // Reverted to standard port 80

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
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [clientCart, setClientCart] = useState<CartItem[]>([]);

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

          // Fetch Orders
          const orderRes = await fetch(`${API_BASE_URL}/orders/get.php`);
          if (orderRes.ok) setOrders(await orderRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, [user?.role]);

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
