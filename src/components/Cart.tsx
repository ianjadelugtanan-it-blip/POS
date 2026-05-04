import React from 'react';
import { ShoppingBag, X, Minus, Plus, CreditCard } from 'lucide-react';
import type { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCompleteSale: () => void;
}

export const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemoveItem, onCompleteSale }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="w-full h-[calc(100vh-140px)] sticky top-8 flex flex-col card overflow-hidden">
      <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Current Cart
          </h2>
          <p className="text-xs text-gray-500 font-medium">Terminal transaction</p>
        </div>
        <span className="bg-white text-gray-700 text-xs py-1.5 px-3 rounded-full font-bold shadow-sm border border-gray-200">
          {items.length} Items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-white">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
            <ShoppingBag className="w-10 h-10 text-gray-200" />
            <p className="text-sm font-medium">Cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">₱{item.price.toFixed(2)} each</p>
                </div>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-gray-500 hover:text-gray-900 transition-colors bg-white rounded shadow-sm"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-gray-500 hover:text-gray-900 transition-colors bg-white rounded shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="font-mono text-sm font-bold text-gray-900">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <div className="space-y-3 mb-5 text-sm font-medium">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span className="font-mono text-gray-700">₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Tax (10%)</span>
            <span className="font-mono text-gray-700">₱{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200 mt-2">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCompleteSale}
          disabled={items.length === 0}
          className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold tracking-wide transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
            ${items.length === 0 
              ? 'bg-white text-gray-400 border border-gray-200 cursor-not-allowed' 
              : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5'
            }`}
        >
          <CreditCard className="w-4 h-4" />
          {items.length === 0 ? 'Cart Empty' : 'Complete Sale'}
        </button>
      </div>
    </div>
  );
};
