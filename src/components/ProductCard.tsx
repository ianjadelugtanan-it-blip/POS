import React, { useState } from 'react';
import { Plus, Minus, Info, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  variant?: 'shop' | 'pos';
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'shop', onAddToCart }) => {
  const isOutOfStock = product.stock === 0;
  const [localQuantity, setLocalQuantity] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localQuantity < product.stock) {
      setLocalQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localQuantity > 1) {
      setLocalQuantity(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localQuantity > 0 && localQuantity <= product.stock) {
      setShowConfirmModal(true);
    }
  };

  const confirmAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, localQuantity);
    setLocalQuantity(1);
    setShowConfirmModal(false);
  };

  const cancelAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmModal(false);
  };

  const handlePosQuickAdd = () => {
    if (!isOutOfStock) {
      onAddToCart(product, 1);
    }
  };

  return (
    <div 
      onClick={variant === 'pos' ? handlePosQuickAdd : undefined}
      className={`card overflow-hidden group flex flex-col h-full bg-white transition-all duration-300 relative ${
        variant === 'pos' && !isOutOfStock 
          ? 'cursor-pointer hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]' 
          : variant === 'shop'
          ? 'hover:-translate-y-1'
          : ''
      } ${
        variant === 'pos' && isOutOfStock ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {/* Image container */}
      <div className={`w-full relative bg-gray-100 overflow-hidden ${variant === 'pos' ? 'aspect-video' : 'aspect-square'}`}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className={`w-full h-full object-cover ease-out ${
              variant === 'shop' ? 'transition-transform duration-700 group-hover:scale-105' : ''
            } ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100/50">
            <span className="text-gray-400 font-medium text-xs flex flex-col items-center gap-1">
               <PackageIcon className="w-6 h-6 opacity-20" />
               No Image
            </span>
          </div>
        )}
        
        {variant === 'shop' && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-gray-100">
            {product.category}
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

      <div className={`flex flex-col flex-1 relative bg-white ${variant === 'pos' ? 'p-4' : 'p-5'}`}>
        <h3 className={`${variant === 'pos' ? 'text-base line-clamp-1' : 'text-lg leading-snug'} font-bold text-gray-900 mb-1`}>
          {product.name}
        </h3>
        
        {/* Price Tag */}
        <p className={`${variant === 'pos' ? 'text-lg' : 'text-xl'} font-bold text-blue-600 mb-${variant === 'pos' ? '1' : '4'}`}>
          ₱{product.price.toFixed(2)}
        </p>
        
        {variant === 'shop' && (
          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
             <span className="text-sm text-gray-500 font-medium text-center">
               {product.stock > 0 ? `${product.stock} units available` : 'Currently Unavailable'}
             </span>
             
             {!isOutOfStock && (
               <div className="flex items-center gap-2 mt-1">
                 {/* Pre-purchase Quantity Adjuster */}
                 <div className="flex items-center justify-between bg-gray-50 rounded-xl border border-gray-200 p-1 flex-1">
                   <button
                     onClick={handleDecrease}
                     className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-900 shadow-sm hover:scale-105 active:scale-95 transition-all"
                     aria-label="Decrease quantity"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                   <span className="text-sm font-bold w-6 text-center select-none">{localQuantity}</span>
                   <button
                     onClick={handleIncrease}
                     disabled={localQuantity >= product.stock}
                     className={`w-8 h-8 flex items-center justify-center rounded-lg shadow-sm transition-all ${localQuantity >= product.stock ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed' : 'bg-white text-gray-900 hover:scale-105 active:scale-95'}`}
                     aria-label="Increase quantity"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                 </div>
                 
                 {/* Explicit Add to Cart Confirmation Action */}
                 <button
                   onClick={handleSubmit}
                   className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-black text-white hover:bg-gray-800 hover:shadow-lg active:scale-95 transition-all duration-300 font-bold text-sm shadow-md"
                   aria-label="Confirm Purchase Action"
                 >
                   <ShoppingCart className="w-4 h-4" />
                   Checkout
                 </button>
               </div>
             )}
          </div>
        )}

        {/* POS Minimal Info */}
        {variant === 'pos' && (
          <div className="mt-auto flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
            <span>{product.stock} in stock</span>
            {!isOutOfStock && (
              <span className="font-semibold text-gray-300 border border-gray-100 rounded-md px-1 bg-gray-50">TAP</span>
            )}
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={(e) => { e.stopPropagation(); cancelAddToCart(e); }}>
          <div 
            className="bg-white rounded-2xl p-6 max-w-[320px] w-full shadow-2xl transform transition-all border border-gray-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 mx-auto">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center tracking-tight">Add to Bag?</h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to add <strong className="text-gray-900">{localQuantity}x {product.name}</strong> to your shopping bag?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={cancelAddToCart}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAddToCart}
                className="flex-1 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors shadow-sm text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PackageIcon: React.FC<any> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);
