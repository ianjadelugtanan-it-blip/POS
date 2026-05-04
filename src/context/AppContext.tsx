import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { User, Product, CartItem, Transaction, Order } from '../types';
import { sampleProducts } from '../data/sampleProducts';

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

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  logout: () => void;
  
  products: Product[];
  setProducts: (products: Product[]) => void;
  
  posCart: CartItem[];
  setPosCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  
  clientCart: CartItem[];
  setClientCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;

  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('pos_active_user_v3', null);
  
  const defaultUsers: User[] = [
    { username: 'admin', role: 'admin', password: '123' },
    { username: 'client', role: 'client', password: '123' }
  ];
  const [users, setUsers] = useLocalStorage<User[]>('pos_users_v3', defaultUsers);

  // Bumped keys to force a hard cache reset on the client browser 
  const [products, setProducts] = useLocalStorage<Product[]>('pos_products_v3', sampleProducts);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('pos_transactions_v3', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('pos_client_orders_v3', initialOrders);
  
  const [posCart, setPosCart] = useLocalStorage<CartItem[]>('pos_internal_cart_v3', []);
  const [clientCart, setClientCart] = useLocalStorage<CartItem[]>('pos_online_cart_v3', []);

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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
