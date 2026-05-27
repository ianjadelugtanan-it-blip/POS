import React, { useState } from 'react';
import { Truck, MapPin, Phone, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '../../config';
import type { Order } from '../../types';

interface CheckoutProps {
  selectedItemIds: Set<string>;
  onBackToCart: () => void;
  onOrderComplete: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9).toUpperCase();

export const Checkout: React.FC<CheckoutProps> = ({ selectedItemIds, onBackToCart, onOrderComplete }) => {
  const { user, clientCart, setClientCart, orders, setOrders, setProducts } = useAppContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'GCash' | 'Bank Transfer'>('Cash on Delivery');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  const selectedItems = clientCart.filter(item => selectedItemIds.has(item.id));
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    if (!name || !address || !contact || selectedItemIds.size === 0 || clientCart.length === 0) return;

    // Validate Philippine mobile number (starts with 09, followed by 9 digits)
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(contact)) {
      setShowErrorModal(true);
      return;
    }

    const newOrder: Order = {
      id: generateId(),
      customerName: name,
      address,
      contactNumber: contact,
      username: user?.username,
      items: selectedItems,
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

        setClientCart(prev => prev.filter(item => !selectedItemIds.has(item.id)));
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
    <>
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
                     onChange={(e) => {
                       // Enforce only digits
                       const val = e.target.value.replace(/\D/g, '');
                       setContact(val);
                     }}
                     maxLength={11}
                     className="input-field"
                     placeholder="09XXXXXXXXX"
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
                          <div 
                            onClick={() => setIsQrZoomed(true)}
                            className="w-32 h-32 bg-white p-1 rounded-xl border-2 border-dashed border-blue-200 flex-shrink-0 flex items-center justify-center relative group cursor-zoom-in overflow-hidden shadow-sm hover:border-blue-400 transition-colors"
                          >
                             <img src="/gcash_qr.png" alt="GCash QR Code" className="w-full h-full object-cover rounded-lg" />
                             <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">Click to Zoom</span>
                          </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-blue-900 mb-1">GCash Payment</h4>
                            <p className="text-sm text-blue-700 leading-relaxed mb-3">
                              Please scan the QR code and send exactly ₱{total.toFixed(2)} to <strong>09XX-XXX-XXXX (IA*N JA*E L.)</strong>.
                            </p>
                            <div className="flex flex-col gap-2">
                               <label className="text-xs font-bold text-blue-600 uppercase">Upload Receipt Screenshot</label>
                               <div className="flex items-center gap-3 mt-1">
                                 <label className="cursor-pointer py-2 px-4 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm">
                                   {receiptImage ? "Change File" : "Choose File"}
                                   <input 
                                      type="file" 
                                      accept="image/*" 
                                      onChange={handleImageUpload}
                                      className="hidden"
                                      required={paymentMethod === 'GCash' && !receiptImage}
                                   />
                                 </label>
                                 {receiptImage && (
                                   <button 
                                     type="button"
                                     onClick={() => setReceiptImage(null)}
                                     className="py-2 px-4 rounded-full text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200"
                                   >
                                     Remove File
                                   </button>
                                 )}
                               </div>
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

             <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
               <h3 className="font-bold text-lg text-gray-900">Order Summary</h3>
             </div>

             {/* Item List */}
             <div className="space-y-3 mb-5 max-h-[45vh] overflow-y-auto custom-scrollbar pr-1">
               {selectedItems.map(item => {
                 return (
                   <div
                     key={item.id}
                     className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white shadow-sm"
                   >
                     {/* Product Image */}
                     <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100">
                       {item.imageUrl ? (
                         <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-gray-400 uppercase">IMG</div>
                       )}
                     </div>

                     {/* Item Info */}
                     <div className="flex-1 min-w-0 text-left">
                       <span className="font-bold text-gray-900 block text-sm truncate">{item.name}</span>
                       <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                     </div>

                     {/* Price */}
                     <div className="font-bold text-gray-900 font-mono text-sm shrink-0">
                       ₱{(item.price * item.quantity).toFixed(2)}
                     </div>
                   </div>
                 );
               })}
             </div>

             {/* Totals */}
             <div className="space-y-2 font-medium text-sm text-gray-600 border-t border-gray-200 pt-4">
               <div className="flex justify-between">
                 <span>Subtotal ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})</span>
                 <span className="font-mono text-gray-900">₱{subtotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between pt-1">
                 <span className="text-gray-900 font-bold text-base">Total</span>
                 <span className="text-2xl font-bold text-gray-900 font-mono">₱{total.toFixed(2)}</span>
               </div>
             </div>
           </div>
         </div>

      </div>

      {/* Custom Contact Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Invalid Contact Number
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Please input correct number starting with 09.
            </p>
            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all active:scale-[0.98] shadow-md shadow-gray-900/10"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Zoomed QR Code Modal */}
      {isQrZoomed && (
        <div 
          onClick={() => setIsQrZoomed(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 animate-in zoom-in-95 duration-200 text-center relative shadow-2xl animate-duration-200"
          >
            <button 
              onClick={() => setIsQrZoomed(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors font-bold text-lg"
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Scan GCash QR Code
            </h3>
            <p className="text-xs text-gray-500 mb-6 font-medium">
              Scan with your GCash app to send exactly ₱{total.toFixed(2)}
            </p>
            <div className="w-64 h-64 mx-auto mb-6 bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-inner flex items-center justify-center">
              <img src="/gcash_qr.png" alt="GCash QR Code Zoomed" className="w-full h-full object-cover rounded-lg" />
            </div>
            <button
              type="button"
              onClick={() => setIsQrZoomed(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
