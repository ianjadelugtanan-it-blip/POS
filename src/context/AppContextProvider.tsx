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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Fetch initial data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      // Initialize loading states
      setIsLoadingProducts(true);
      setIsLoadingUsers(true);
      setIsLoadingOrders(true);

      // 1. Fetch Products
      try {
        const prodRes = await fetch(`${API_BASE_URL}/products/get.php`);
        if (prodRes.ok) setProducts(await prodRes.json());
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoadingProducts(false);
      }

      // 2. Fetch Users (if admin)
      if (user?.role === 'admin') {
        try {
          const userRes = await fetch(`${API_BASE_URL}/users/get.php`);
          if (userRes.ok) setUsers(await userRes.json());
        } catch (error) {
          console.error("Failed to fetch users:", error);
        } finally {
          setIsLoadingUsers(false);
        }
      } else {
        setIsLoadingUsers(false);
      }

      // 3. Fetch Orders
      if (user) {
        try {
          const url = user.role === 'admin' 
            ? `${API_BASE_URL}/orders/get.php` 
            : `${API_BASE_URL}/orders/get.php?username=${encodeURIComponent(user.username)}`;
            
          const orderRes = await fetch(url);
          if (orderRes.ok) setOrders(await orderRes.json());
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoadingOrders(false);
        }
      } else {
        setIsLoadingOrders(false);
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
    setIsLoggingOut(true);
    setTimeout(() => {
      setUser(null);
      setIsLoggingOut(false);
    }, 1500);
  };

  return (
    <AppContext.Provider value={{
      user, setUser, users, setUsers, logout, isLoggingOut,
      products, setProducts,
      posCart, setPosCart,
      clientCart, setClientCart,
      transactions, setTransactions,
      orders, setOrders,
      isLoadingProducts,
      isLoadingUsers,
      isLoadingOrders
    }}>
      {children}
    </AppContext.Provider>
  );
};
