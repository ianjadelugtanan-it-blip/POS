import React, { useState, useEffect } from 'react';
import { ProductCard } from '../ProductCard';
import type { Product } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { ShoppingBag } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, setClientCart } = useAppContext();
  
  const [toastItem, setToastItem] = useState<{ id: number; name: string, status: string } | null>(null);

  const handleAddToCart = (product: Product, quantity: number) => {
    setClientCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, product.stock);
        setToastItem({ id: Date.now(), name: product.name, status: 'added' });
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
      }
      
      setToastItem({ id: Date.now(), name: product.name, status: 'added' });
      return [...prev, { ...product, quantity }];
    });
  };

  useEffect(() => {
    if (toastItem) {
      const timer = setTimeout(() => setToastItem(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastItem]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full relative">
      
      {toastItem && (
        <div key={toastItem.id} className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-12 fade-in duration-300">
          <div className="bg-gray-900 drop-shadow-2xl text-white px-6 py-4 rounded-full shadow-lg border border-gray-700 font-bold flex items-center gap-3">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toastItem.status === 'removed' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
               <ShoppingBag className="w-4 h-4" />
             </div>
             <span>{toastItem.name} {toastItem.status === 'removed' ? 'removed from' : 'cart updated in'} bag.</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 px-2 border-b border-gray-200 pb-4">
         <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Available Items</h3>
         <span className="text-sm font-bold text-gray-500">{products.length} Items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
        {products.map((product, index) => (
          <div key={product.id} className="animate-cascade" style={{ animationDelay: `${index * 75}ms` }}>
            <ProductCard 
              product={product} 
              onAddToCart={handleAddToCart} 
            />
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
         <div className="card p-16 flex flex-col items-center justify-center text-gray-400 mt-8 border border-dashed border-gray-300 bg-white/50">
           <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
           <p className="font-bold text-gray-900 text-lg mb-1">Catalog Empty</p>
           <p className="text-sm font-medium">The system currently holds no physical products.</p>
         </div>
      )}
    </div>
  );
};
