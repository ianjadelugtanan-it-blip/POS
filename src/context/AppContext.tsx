import { createContext, useContext } from 'react';
import type { User, Product, CartItem, Transaction, Order } from '../types';

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  logout: () => void;
  isLoggingOut: boolean;
  
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

  isLoadingProducts: boolean;
  isLoadingUsers: boolean;
  isLoadingOrders: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
