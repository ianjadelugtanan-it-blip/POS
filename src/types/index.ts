export type UserRole = 'admin' | 'client';

export interface User {
  username: string;
  role: UserRole;
  password?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed';

export interface Order {
  id: string;
  customerName: string;
  address?: string;
  contactNumber?: string;
  username?: string; // used to link to the client who placed it
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  estimatedArrival?: string;
  paymentMethod?: string;
  receiptImage?: string;
}

