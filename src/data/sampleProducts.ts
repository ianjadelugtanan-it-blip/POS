import type { Product } from '../types';

export const sampleProducts: Product[] = [
  {
    id: 'p1',
    name: 'Vintage Denim Jacket',
    price: 1250.00,
    stock: 12,
    category: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'p2',
    name: 'Classic White Tee',
    price: 450.00,
    stock: 35,
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'p3',
    name: 'High-Waisted Trousers',
    price: 850.00,
    stock: 20,
    category: 'Bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=400',
  }
];
