import React, { useState } from 'react';
import { Truck, MapPin, Phone, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Order } from '../../types';

interface CheckoutProps {
  onBackToCart: () => void;
  onOrderComplete: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBackToCart, onOrderComplete }) => {
  const { user, clientCart, setClientCart, orders, setOrders, products, setProducts } = useAppContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  const subtotal = clientCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !contact || clientCart.length === 0) return;

    // Deduct stock from inventory
    const updatedProducts = products.map(product => {
      const cartItem = clientCart.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: Math.max(0, product.stock - cartItem.quantity) };
      }
      return product;
    });

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      customerName: name,
      address,
      contactNumber: contact,
      username: user?.username,
      items: [...clientCart],
      total,
      status: 'pending',
      date: new Date().toISOString()
    };

    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    setClientCart([]);
    onOrderComplete();
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

            <div className="pt-6 border-t border-gray-100 mt-8">
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Place Order Securely
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
