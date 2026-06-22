import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle } from 'lucide-react';
import type { Product } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '../../config';
import { ProductCard } from '../ProductCard';

export const POSCashier: React.FC = () => {
  const { products, setProducts, posCart, setPosCart, setOrders } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [lastTransaction, setLastTransaction] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      // eslint-disable-next-line react-hooks/purity
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
        // Refresh data
        const [prodRes, orderRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products/get.php`),
          fetch(`${API_BASE_URL}/orders/get.php`)
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (orderRes.ok) setOrders(await orderRes.json());

        setPosCart([]);
        setLastTransaction(orderData);
      } else {
          const result = await response.json();
          setErrorMsg(result.error || "Transaction failed.");
        }
      } catch {
        setErrorMsg("Connection error. Sale not recorded.");
    }
  };

  const filteredProducts = products.filter(p => p.stock > 0 && p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto">
      
      {/* Products Selection Area */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-4">
          <div className="max-w-[1600px] mx-auto">
            <div className="px-4 py-2">
              <div className="w-full px-4 py-3 rounded-xl border bg-red-50 border-red-100 text-red-700">{errorMsg}</div>
            </div>
          </div>
        </div>
      )}
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
           {products.filter(p => p.stock > 0).length === 0 ? (
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

      {/* Receipt Modal */}
      {lastTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 pb-4 flex flex-col items-center border-b border-gray-100 border-dashed">
                 <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">Sale Successful!</h3>
                 <p className="text-sm text-gray-500">Transaction recorded successfully.</p>
              </div>
              
              <div className="p-8 pt-6">
                 <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 font-mono text-xs text-gray-600 space-y-3">
                    <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                       <span className="font-bold">RECEIPT</span>
                       <span>{lastTransaction.id}</span>
                    </div>
                    <div className="space-y-2">
                       {lastTransaction.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between">
                             <span>{item.quantity}x {item.name}</span>
                             <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                       ))}
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 mt-4 text-sm font-bold text-gray-900">
                       <span>Total Amount</span>
                       <span>₱{lastTransaction.total.toFixed(2)}</span>
                    </div>
                    <div className="text-center pt-4 opacity-50">
                       <p>{new Date().toLocaleString()}</p>
                       <p className="mt-1">Thank you for shopping at The Find!</p>
                    </div>
                 </div>
                 
                 <div className="mt-8 grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setLastTransaction(null)}
                      className="py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button 
                      onClick={() => {
                        const printWindow = window.open('', '_blank', 'width=400,height=600');
                        if (!printWindow) return;
                        const itemRows = lastTransaction.items.map((item: any) =>
                          `<div class="row"><span>${item.quantity}x ${item.name}</span><span>₱${(item.price * item.quantity).toFixed(2)}</span></div>`
                        ).join('');
                        printWindow.document.write(`
                          <html><head><title>Receipt ${lastTransaction.id}</title>
                          <style>
                            body{font-family:monospace;font-size:13px;padding:24px;color:#333;}
                            .row{display:flex;justify-content:space-between;margin:6px 0;}
                            .divider{border-top:1px dashed #ccc;margin:10px 0;}
                            .bold{font-weight:bold;font-size:14px;}
                            .center{text-align:center;color:#888;margin-top:16px;font-size:11px;}
                          </style></head><body>
                          <div class="row bold"><span>THE FIND — RECEIPT</span><span>${lastTransaction.id}</span></div>
                          <div class="divider"></div>
                          ${itemRows}
                          <div class="divider"></div>
                          <div class="row bold"><span>TOTAL</span><span>₱${lastTransaction.total.toFixed(2)}</span></div>
                          <div class="center"><p>${new Date().toLocaleString()}</p><p>Thank you for shopping at The Find!</p></div>
                          </body></html>
                        `);
                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                        printWindow.close();
                      }}
                      className="py-3.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                    >
                      Print Receipt
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
