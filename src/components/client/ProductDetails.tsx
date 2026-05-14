import React, { useState, useMemo } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart, Star, Share2, ShieldCheck, Truck } from 'lucide-react';
import type { Product } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onAddToCart, onSelectProduct }) => {
  const { products } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const isOutOfStock = product.stock === 0;
  
  const recommendations = useMemo(() => {
    return products.filter(p => p.id !== product.id).slice(0, 4);
  }, [products, product.id]);

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(product, quantity);
      // Optional: Navigate to cart or show success animation
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full relative pb-20">
      
      {/* Breadcrumb / Back Navigation */}
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-gray-50 group-hover:border-gray-300 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Storefront
      </button>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-24">
        
        {/* Left Column: Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100/50">
                <span className="text-gray-400 font-medium">No Image Available</span>
              </div>
            )}
            
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 ${isFavorite ? 'bg-white text-red-500' : 'bg-white/80 text-gray-600 hover:bg-white'}`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          {/* Thumbnails (Mocked) */}
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
             {[1, 2, 3].map((i) => (
                <div key={i} className={`w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 ${i === 1 ? 'border-gray-900' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                   {product.imageUrl ? (
                     <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gray-200" />
                   )}
                </div>
             ))}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-10">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
               <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{product.category}</p>
               <button className="text-gray-400 hover:text-gray-900 transition-colors">
                  <Share2 className="w-5 h-5" />
               </button>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-600">The Find</span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <p className="text-4xl font-bold text-gray-900">₱{product.price.toFixed(2)}</p>
              {product.price > 1000 && (
                 <p className="text-lg text-gray-400 line-through mb-1">₱{(product.price * 1.2).toFixed(2)}</p>
              )}
            </div>

            <p className="text-gray-600 text-base leading-relaxed mb-8">
               Experience the perfect blend of quality and style with this premium offering from The Find. 
               Carefully selected and inspected to meet our high standards, this piece is designed to elevate your everyday life.
               Available in limited quantities.
            </p>
          </div>

          {/* Action Area */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
             <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">Quantity</span>
                <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : product.stock < 5 ? 'text-orange-500' : 'text-green-600'}`}>
                   {isOutOfStock ? 'Out of Stock' : product.stock < 5 ? `Only ${product.stock} left` : 'In Stock'}
                </span>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-2 sm:w-32 flex-shrink-0">
                  <button
                    onClick={handleDecrease}
                    disabled={isOutOfStock}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-900 transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-bold w-8 text-center select-none">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-900 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gray-900 text-white hover:bg-black active:scale-[0.98] transition-all duration-300 font-bold text-lg shadow-xl shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                </button>
             </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-bold text-sm text-gray-900">Secure Checkout</h4>
                   <p className="text-xs text-gray-500 mt-0.5">Your payment is protected.</p>
                </div>
             </div>
             <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white">
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                   <Truck className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-bold text-sm text-gray-900">Fast Shipping</h4>
                   <p className="text-xs text-gray-500 mt-0.5">Dispatched within 24 hours.</p>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Recommended Products */}
      {recommendations.length > 0 && (
        <div className="pt-16 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>You might also like</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
            {recommendations.map((recProduct, index) => (
              <div 
                key={recProduct.id} 
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.5rem)] xl:w-[calc(25%-1.6rem)] animate-cascade"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard 
                  product={recProduct} 
                  onAddToCart={onAddToCart}
                  onClick={() => {
                    if (onSelectProduct) onSelectProduct(recProduct);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
