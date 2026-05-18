import { createContext, useContext, useState, useEffect } from 'react';
import type { User, Product, CartItem, Transaction, Order } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { API_BASE_URL } from '../config';

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

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [clientCart, setClientCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingProducts(true);
        setIsLoadingUsers(true);
        setIsLoadingOrders(true);
        
        const prodRes = await fetch(`${API_BASE_URL}/products/get.php`);
        if (prodRes.ok) setProducts(await prodRes.json());
        setIsLoadingProducts(false);
        
        const userRes = await fetch(`${API_BASE_URL}/users/get.php`);
        if (userRes.ok) setUsers(await userRes.json());
        setIsLoadingUsers(false);

        const orderRes = await fetch(`${API_BASE_URL}/orders/get.php`);
        if (orderRes.ok) setOrders(await orderRes.json());
        setIsLoadingOrders(false);
      } catch {
        console.error("Initial fetch failed.");
        setIsLoadingProducts(false);
        setIsLoadingUsers(false);
        setIsLoadingOrders(false);
      }
    };
    fetchData();
  }, []);

  const logout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setUser(null);
      setIsLoggingOut(false);
    }, 1500);
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      users, setUsers,
      logout,
      isLoggingOut,
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
