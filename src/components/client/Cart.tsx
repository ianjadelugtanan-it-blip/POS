import React from 'react';
import { ShoppingBag, X, Minus, Plus, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface CartProps {
  onProceedToCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ onProceedToCheckout }) => {
  const { clientCart, setClientCart, products } = useAppContext();

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
  };

  const subtotal = clientCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
             <ShoppingBag className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Shopping Bag</h2>
        </div>
        <span className="bg-white text-gray-700 text-sm py-1.5 px-4 rounded-full font-bold shadow-sm border border-gray-200">
          {clientCart.length} Items
        </span>
      </div>

      <div className="flex-1 p-6 md:p-8 space-y-4">
        {clientCart.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-500">Your bag is empty</p>
          </div>
        ) : (
          clientCart.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex-1 mb-4 md:mb-0">
                <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                <p className="text-sm font-medium text-gray-500 mt-1">₱{item.price.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors bg-white rounded shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-base w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors bg-white rounded shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-24 text-right">
                  <span className="font-bold text-lg text-gray-900">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                  aria-label="Remove item"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="w-full md:w-1/2 space-y-3 font-medium text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-gray-900">₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span>Estimated Tax (10%)</span>
            <span className="font-mono text-gray-900">₱{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-900 font-bold">Total</span>
            <span className="text-3xl text-gray-900 font-bold tracking-tight">₱{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onProceedToCheckout}
          disabled={clientCart.length === 0}
          className={`w-full md:w-auto px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5
            ${clientCart.length === 0 
              ? 'bg-white text-gray-400 border border-gray-200 cursor-not-allowed' 
              : 'bg-black text-white hover:bg-gray-800'
            }`}
        >
          {clientCart.length === 0 ? 'Bag Empty' : 'Proceed to Checkout'}
          {clientCart.length !== 0 && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
