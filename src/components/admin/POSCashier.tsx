import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import type { Product, Transaction } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '../../context/AppContextProvider';
import { ProductCard } from '../ProductCard';

export const POSCashier: React.FC = () => {
  const { products, setProducts, posCart, setPosCart, setTransactions } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const cartTotal = posCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (product: Product, quantity: number) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (product: Product, delta: number) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) return prev.filter(item => item.id !== product.id);
        if (newQuantity <= product.stock) return prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
      }
      return prev;
    });
  };

  const handleRemoveItem = (productId: string) => {
    setPosCart(posCart.filter(item => item.id !== productId));
  };

  const handleCompleteSale = async () => {
    if (posCart.length === 0) return;

    const orderData = {
      id: `TRX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      customerName: 'Walk-in Customer',
      items: [...posCart],
      total: cartTotal,
      status: 'completed',
      date: new Date().toISOString().slice(0, 19).replace('T', ' ') // SQL Format
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Refresh products to get updated stock
        const prodRes = await fetch(`${API_BASE_URL}/products/get.php`);
        if (prodRes.ok) setProducts(await prodRes.json());

        setPosCart([]);
        alert("Transaction Successful and Stock Updated!");
      } else {
        const result = await response.json();
        alert(result.error || "Transaction failed.");
      }
    } catch (error) {
      alert("Connection error. Sale not recorded.");
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto">
      
      {/* Products Selection Area */}
      <div className="flex-[2] flex flex-col h-full bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Terminal</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Scan or lookup items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 h-11 text-sm bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
           {products.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>No products loaded in system</p>
             </div>
           ) : filteredProducts.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>No products match "{searchQuery}"</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
               {filteredProducts.map((product, index) => {
                 return (
                 <div key={product.id} className="animate-cascade" style={{ animationDelay: `${index * 50}ms` }}>
                   <ProductCard 
                     product={product} 
                     variant="pos"
                     onAddToCart={handleAddToCart} 
                   />
                 </div>
               )})}
             </div>
           )}
        </div>
      </div>

      {/* POS Cart Sidebar Area */}
      <div className="w-full lg:w-96 flex flex-col h-full bg-[#fafafa] rounded-[2rem] shadow-inner border border-gray-100 overflow-hidden relative isolate">
         <div className="p-6 border-b border-gray-200">
           <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <ShoppingCart className="w-5 h-5"/> Current Order
           </h3>
         </div>

         <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
           {posCart.length === 0 ? (
             <p className="text-gray-400 text-center text-sm font-medium pt-12">Register is empty. Tap items to construct order.</p>
           ) : (
             <div className="space-y-4">
               {posCart.map(item => (
                 <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-right flex gap-4 relative group">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {item.imageUrl ? (
                      <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                        IMG
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                       <h4 className="font-bold text-sm text-gray-900 truncate pr-2">{item.name}</h4>
                       <div className="flex items-center justify-between mt-1">
                          <p className="font-bold text-blue-600 text-sm">₱{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-full border border-gray-200 px-1 py-0.5">
                             <button onClick={() => handleUpdateQuantity(item, -1)} className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:shadow-sm"><Minus className="w-3 h-3 text-gray-600"/></button>
                             <span className="font-bold text-gray-800 w-3 text-center">{item.quantity}</span>
                             <button onClick={() => handleUpdateQuantity(item, 1)} disabled={item.quantity >= item.stock} className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:shadow-sm disabled:opacity-50"><Plus className="w-3 h-3 text-gray-600"/></button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
         </div>

         <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
           <div className="space-y-3 mb-6 relative">
              <div className="flex justify-between items-end pt-2">
                <span className="text-gray-900 font-bold">Total Amount</span>
                <span className="text-3xl font-black text-gray-900 tracking-tight">₱{cartTotal.toFixed(2)}</span>
              </div>
           </div>

           <button 
             onClick={handleCompleteSale}
             disabled={posCart.length === 0}
             className="w-full btn-primary py-4 text-lg bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:-translate-y-1 transition-all shadow-xl"
           >
             Complete Transaction
           </button>
         </div>
      </div>

    </div>
  );
};
