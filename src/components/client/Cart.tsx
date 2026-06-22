import React, { useState } from 'react';
import { ShoppingBag, X, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface CartProps {
  onProceedToCheckout: (selectedItemIds: Set<string>) => void;
}

export const Cart: React.FC<CartProps> = ({ onProceedToCheckout }) => {
  const { clientCart, setClientCart, products } = useAppContext();
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => {
    return new Set(clientCart.map(item => item.id));
  });

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    
    setClientCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const maxStock = product ? product.stock : item.quantity;
        return { ...item, quantity: Math.min(quantity, maxStock) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setClientCart(prev => prev.filter(item => item.id !== id));
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(clientCart.map(item => item.id)));
    }
  };

  const selectedItems = clientCart.filter(item => selectedItemIds.has(item.id));
  const allSelected = clientCart.length > 0 && selectedItems.length === clientCart.length;

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 150 : 0; // Flat mock shipping fee
  const total = subtotal + shipping;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Shopping Bag
        </h2>
        <p className="text-gray-500 font-medium mb-4">
          {clientCart.length} {clientCart.length === 1 ? 'item' : 'items'} in your bag
        </p>
        <div className="flex justify-center md:hidden">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-all"
          >
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              allSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-white'
            }`}>
              {allSelected && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            Select All Items
          </button>
        </div>
      </div>

      {clientCart.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-gray-400 space-y-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Your bag is empty</p>
            <p className="text-base text-gray-500">Looks like you haven't added anything yet.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest pb-4 border-b border-gray-100 items-center">
               <div className="col-span-6 flex items-center gap-3">
                 <button
                   type="button"
                   onClick={toggleAll}
                   className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                 >
                   <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                     allSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-white'
                   }`}>
                     {allSelected && (
                       <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                         <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     )}
                   </span>
                   Select All
                 </button>
               </div>
               <div className="col-span-3 text-center">Quantity</div>
               <div className="col-span-3 text-right">Total</div>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              {clientCart.map((item) => {
                const isSelected = selectedItemIds.has(item.id);
                return (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
                    
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex-shrink-0 focus:outline-none"
                      >
                        <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-gray-900 bg-gray-900 shadow-sm' : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                      </button>

                      <div className="w-24 h-32 md:w-28 md:h-36 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100/50">
                             <ShoppingBag className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                        <h4 className="text-lg font-bold text-gray-900 leading-snug mb-1">{item.name}</h4>
                        <p className="text-sm font-medium text-gray-500 mb-3">₱{item.price.toFixed(2)}</p>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider flex items-center gap-1 w-max"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-1 md:col-span-3 flex md:justify-center">
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl border border-gray-200 p-1 w-32">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors bg-white rounded-lg shadow-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-sm w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors bg-white rounded-lg shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="col-span-1 md:col-span-3 text-right hidden md:block">
                      <span className="font-bold text-lg text-gray-900">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-28">
               <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h3>
               
               <div className="space-y-4 mb-6 text-sm font-medium border-b border-gray-200 pb-6">
                 <div className="flex justify-between text-gray-600">
                   <span>Subtotal ({selectedItemIds.size} item{selectedItemIds.size !== 1 ? 's' : ''})</span>
                   <span className="text-gray-900">₱{subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                   <span>Estimated Shipping</span>
                   <span className="text-gray-900">₱{shipping.toFixed(2)}</span>
                 </div>
               </div>
               
               <div className="flex justify-between items-end mb-8">
                 <span className="text-gray-900 font-bold">Total</span>
                 <div className="text-right">
                   <p className="text-xs text-gray-500 font-medium mb-1">PHP</p>
                   <span className="text-3xl text-gray-900 font-bold tracking-tight">₱{total.toFixed(2)}</span>
                 </div>
               </div>

               <button
                 onClick={() => selectedItemIds.size > 0 && onProceedToCheckout(selectedItemIds)}
                 disabled={selectedItemIds.size === 0}
                 className="w-full px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-xl shadow-gray-900/20 bg-gray-900 text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
               >
                 Proceed to Checkout
                 <ArrowRight className="w-5 h-5" />
               </button>
               
               <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Secure SSL Checkout
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
