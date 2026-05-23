import React, { useState } from 'react';
import { Truck, MapPin, Phone, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '../../config';
import type { Order } from '../../types';

interface CheckoutProps {
  onBackToCart: () => void;
  onOrderComplete: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBackToCart, onOrderComplete }) => {
  const { user, clientCart, setClientCart, orders, setOrders, setProducts } = useAppContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'GCash' | 'Bank Transfer'>('Cash on Delivery');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const subtotal = clientCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("Image is too large. Please upload a file smaller than 2MB.");
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !contact || clientCart.length === 0) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      customerName: name,
      address,
      contactNumber: contact,
      username: user?.username,
      items: [...clientCart],
      total,
      status: 'pending',
      date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      paymentMethod,
      receiptImage: receiptImage || undefined
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (response.ok) {
        // Refresh products to get updated stock
        const prodRes = await fetch(`${API_BASE_URL}/products/get.php`);
        if (prodRes.ok) setProducts(await prodRes.json());
        
        // Refresh orders
        const orderRes = await fetch(`${API_BASE_URL}/orders/get.php`);
        if (orderRes.ok) setOrders(await orderRes.json());
        else setOrders([newOrder, ...orders]); // fallback

        setClientCart([]);
        onOrderComplete();
      } else {
        const result = await response.json();
        alert(result.error || "Order failed.");
      }
    } catch {
      alert("Connection error. Order not placed.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Checkout Form */}
      <div className="flex-[2] flex flex-col">
        <button 
          onClick={onBackToCart} 
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bag
        </button>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-gray-900">Delivery Information</h2>
               <p className="text-sm text-gray-500">Please provide your details for shipping.</p>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                 <User className="w-4 h-4 text-gray-400" /> Full Name
               </label>
               <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-gray-400" /> Delivery Address
               </label>
               <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="123 Main Street, City, Country"
                  required
                />
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                 <Phone className="w-4 h-4 text-gray-400" /> Contact Number
               </label>
               <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="input-field"
                  placeholder="+1 (555) 000-0000"
                  required
                />
            </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'Cash on Delivery', label: 'Cash on Delivery', disabled: false },
                    { id: 'GCash', label: 'GCash', disabled: false },
                    { id: 'Bank Transfer', label: 'Bank Transfer', disabled: true }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      disabled={method.disabled}
                      onClick={() => !method.disabled && setPaymentMethod(method.id as any)}
                      className={`p-4 rounded-xl border-2 text-sm font-bold transition-all relative ${
                        method.disabled 
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                          : paymentMethod === method.id
                            ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {method.label}
                      {method.disabled && (
                        <span className="absolute -top-2 -right-1 px-2 py-0.5 bg-gray-200 text-gray-500 text-[9px] rounded-md uppercase tracking-wider">
                          Unavailable
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'GCash' && (
                  <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-4">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                       <div className="w-32 h-32 bg-white p-2 rounded-xl border-2 border-dashed border-blue-200 flex-shrink-0 flex items-center justify-center relative group">
                          {/* Demo QR Placeholder */}
                          <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center gap-1">
                            <div className="text-blue-400 text-[9px] font-bold uppercase tracking-widest">QR Code</div>
                            <div className="text-blue-600 text-[10px] font-black uppercase tracking-widest border border-dashed border-blue-300 px-2 py-1 rounded">Demo Mode</div>
                          </div>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-800 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">DEMO</span>
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-blue-900 mb-1">GCash Payment</h4>
                          <p className="text-sm text-blue-700 leading-relaxed mb-3">
                            Please scan the QR code and send exactly ₱{total.toFixed(2)} to <strong>09XX-XXX-XXXX (IAN L.)</strong>.
                          </p>
                          <div className="flex flex-col gap-2">
                             <label className="text-xs font-bold text-blue-600 uppercase">Upload Receipt Screenshot</label>
                             <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"
                                required={paymentMethod === 'GCash'}
                             />
                          </div>
                       </div>
                    </div>
                    {receiptImage && (
                      <div className="relative w-full max-w-[200px] aspect-[9/16] rounded-xl overflow-hidden border-4 border-white shadow-lg mx-auto">
                        <img src={receiptImage} alt="Receipt Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setReceiptImage(null)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-4 text-xs text-gray-400 italic">
                  * {paymentMethod === 'Cash on Delivery' ? 'Pay upon receiving your items.' : 'Payment must be verified before processing.'}
                </p>
             </div>

            <div className="pt-6 border-t border-gray-100 mt-8">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isUploading ? 'Processing...' : 'Place Order Securely'}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 font-medium">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 Safe and secure checkout
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="flex-1">
        <div className="card p-6 lg:sticky lg:top-8 bg-gray-50/50">
           <h3 className="font-bold text-lg text-gray-900 mb-6 border-b border-gray-200 pb-4">Order Summary</h3>
           
           <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {clientCart.map(item => (
                <div key={item.id} className="flex justify-between items-start text-sm pb-4 border-b border-gray-100 shadow-none hover:shadow-none bg-transparent">
                   <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 mb-1">{item.name}</span>
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                   </div>
                   <div className="font-medium text-gray-900 font-mono">
                     ₱{(item.price * item.quantity).toFixed(2)}
                   </div>
                </div>
              ))}
           </div>

           <div className="space-y-3 font-medium text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-gray-900">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-900 font-bold">Total</span>
              <span className="text-2xl font-bold text-gray-900 font-mono">₱{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
