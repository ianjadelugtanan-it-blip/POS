import React from 'react';
import { Info } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  variant?: 'shop' | 'pos';
  onAddToCart?: (product: Product, quantity: number) => void;
  onClick?: (e?: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'shop', onAddToCart, onClick }) => {
  const isOutOfStock = product.stock === 0;

  const handlePosQuickAdd = () => {
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(product, 1);
    }
  };

  if (variant === 'shop') {
    return (
      <div 
        onClick={onClick}
        className="group cursor-pointer flex flex-col h-full bg-white transition-all duration-300 relative"
      >
        {/* Image container */}
        <div className="w-full relative bg-gray-100 overflow-hidden rounded-xl aspect-[4/5] mb-3">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className={`w-full h-full object-cover bg-gray-50 ease-out transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100/50">
              <span className="text-gray-400 font-medium text-xs flex flex-col items-center gap-1">
                 <PackageIcon className="w-6 h-6 opacity-20" />
                 No Image
              </span>
            </div>
          )}
          


          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
               <span className="bg-white text-gray-900 shadow-md px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                 Sold Out
               </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 relative bg-white px-1">
          <p className="text-xs text-gray-500 mb-1">The Find</p>
          <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:underline decoration-1 underline-offset-2">
            {product.name}
          </h3>
          
          
          <p className="text-base font-bold text-gray-900 mt-auto">
            ₱{product.price.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  // POS Variant
  return (
    <div 
      onClick={handlePosQuickAdd}
      className={`card overflow-hidden group flex flex-col h-full bg-white transition-all duration-300 relative ${
        !isOutOfStock 
          ? 'cursor-pointer hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]' 
          : 'opacity-70 cursor-not-allowed'
      }`}
    >
      <div className="w-full relative bg-gray-100 overflow-hidden aspect-video">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className={`w-full h-full object-cover bg-gray-50 ease-out transition-all duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100/50">
            <span className="text-gray-400 font-medium text-xs flex flex-col items-center gap-1">
               <PackageIcon className="w-6 h-6 opacity-20" />
               No Image
            </span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
             <span className="bg-white text-gray-900 border border-gray-200 shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
               <Info className="w-3 h-3 text-red-500" />
               Out of Stock
             </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 relative bg-white p-4">
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-lg font-bold text-blue-600 mb-1">₱{product.price.toFixed(2)}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
          <span>{product.stock} in stock</span>
          {!isOutOfStock && (
            <span className="font-semibold text-gray-300 border border-gray-100 rounded-md px-1 bg-gray-50">TAP</span>
          )}
        </div>
      </div>
    </div>
  );
};

const PackageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);
