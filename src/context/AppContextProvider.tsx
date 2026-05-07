import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { User, Product, Transaction, Order, CartItem } from '../types';
import { sampleProducts } from '../data/sampleProducts';
import { AppContext } from './AppContext';

const initialOrders: Order[] = [
  {
    id: 'ORD-1004',
    customerName: 'Eve Cybernetics',
    items: [{ ...sampleProducts[0], quantity: 1 }],
    total: 1250,
    status: 'pending',
    date: new Date().toISOString()
  }
];

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultUsers: User[] = [
    { username: 'admin', role: 'admin', password: '123' },
    { username: 'client', role: 'client', password: '123' }
  ];

  // Final Production Keys V9
  const [user, setUser] = useLocalStorage<User | null>('thrift_prod_v9_user', null);
  const [users, setUsers] = useLocalStorage<User[]>('thrift_prod_v9_users', defaultUsers);
  const [products, setProducts] = useLocalStorage<Product[]>('thrift_prod_v9_products', sampleProducts);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('thrift_prod_v9_transactions', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('thrift_prod_v9_orders', initialOrders);
  const [posCart, setPosCart] = useLocalStorage<CartItem[]>('thrift_prod_v9_pos_cart', []);
  const [clientCart, setClientCart] = useLocalStorage<CartItem[]>('thrift_prod_v9_client_cart', []);

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
