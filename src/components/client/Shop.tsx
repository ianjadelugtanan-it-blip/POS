import React, { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '../ProductCard';
import { ProductDetails } from './ProductDetails';
import type { Product } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { ShoppingBag, Tag } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { SkeletonProductCard } from '../ui/Skeleton';


export const Shop: React.FC = () => {
  const { user, products, setProducts, setClientCart, isLoadingProducts } = useAppContext();
  
  useEffect(() => {
    const refetchProducts = async () => {
      try {
        const prodRes = await fetch(`${API_BASE_URL}/products/get.php`);
        if (prodRes.ok) setProducts(await prodRes.json());
      } catch (err) {
        console.error("Failed to refetch products:", err);
      }
    };
    refetchProducts();
  }, [setProducts]);
  
  const [toastItem, setToastItem] = useState<{ id: number; name: string, status: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const activeProducts = products.filter(p => p.stock > 0);
    return ['All', ...Array.from(new Set(activeProducts.map(p => p.category)))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const activeProducts = products.filter(p => p.stock > 0);
    return selectedCategory === 'All' 
      ? activeProducts 
      : activeProducts.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleAddToCart = (product: Product, quantity: number) => {
    if (!user) {
      alert("Please Sign In first to add items to your cart!");
      return;
    }
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
        <div key={toastItem.id} className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-12 fade-in duration-300">
          <div className="bg-gray-900 drop-shadow-2xl text-white px-6 py-4 rounded-full shadow-lg border border-gray-700 font-bold flex items-center gap-3">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toastItem.status === 'removed' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
               <ShoppingBag className="w-4 h-4" />
             </div>
             <span>{toastItem.name} {toastItem.status === 'removed' ? 'removed from' : 'cart updated in'} bag.</span>
          </div>
        </div>
      )}

      {selectedProduct ? (
        <ProductDetails 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart} 
          onSelectProduct={setSelectedProduct}
        />
      ) : (
        <>
          {/* Header & Categories Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-2 border-b border-gray-200 pb-6 gap-6">
             <div>
               <h3 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Discover</h3>
               {isLoadingProducts ? (
                 <div className="h-4 w-16 skeleton-shimmer mt-1 rounded" />
               ) : (
                 <span className="text-sm font-medium text-gray-500">{filteredProducts.length} Items</span>
               )}
             </div>
             
             {/* Category Selector */}
             <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                <Tag className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                {isLoadingProducts ? (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-16 h-8 rounded-full skeleton-shimmer flex-shrink-0" />
                  ))
                ) : (
                  categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        selectedCategory === category
                          ? 'bg-black text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-900 hover:text-gray-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))
                )}
             </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full">
            {isLoadingProducts ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div 
                  key={i} 
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.5rem)] xl:w-[calc(20%-1.6rem)]" 
                >
                  <SkeletonProductCard variant="shop" />
                </div>
              ))
            ) : (
              filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-cascade w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.5rem)] xl:w-[calc(20%-1.6rem)]" 
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard 
                    product={product} 
                    onClick={() => setSelectedProduct(product)}
                  />
                </div>
              ))
            )}
          </div>
          
          {!isLoadingProducts && filteredProducts.length === 0 && (
             <div className="card p-16 flex flex-col items-center justify-center text-gray-400 mt-8 border border-dashed border-gray-300 bg-white/50">
               <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
               <p className="font-bold text-gray-900 text-lg mb-1">No Items Found</p>
               <p className="text-sm font-medium">Try selecting a different category.</p>
             </div>
          )}
        </>
      )}
    </div>
  );
};
