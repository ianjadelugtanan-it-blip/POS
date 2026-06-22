import React, { useState } from 'react';
import { Package, Clock, RotateCw, CheckCircle, MapPin, Calendar as CalendarIcon, X, Trash2 } from 'lucide-react';
import { CalendarPicker } from '../ui/CalendarPicker';
import type { OrderStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '../../config';

export const OrderManagement: React.FC = () => {
  const { orders, setOrders } = useAppContext();
  const [activeOrderForETA, setActiveOrderForETA] = useState<string | null>(null);
  const [etaDate, setEtaDate] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleDeleteOrder = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== id));
        setOrderToDelete(null);
      }
    } catch {
      alert("Error deleting order.");
    }
  };

  const handleProcessClick = (id: string) => {
    setActiveOrderForETA(id);
    setEtaDate('');
  };

  const confirmProcessOrder = async () => {
    if (activeOrderForETA && etaDate) {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/update.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: activeOrderForETA, status: 'processing', estimatedArrival: etaDate })
        });
        if (response.ok) {
          setOrders(orders.map(o => o.id === activeOrderForETA ? { ...o, status: 'processing', estimatedArrival: etaDate } : o));
          setActiveOrderForETA(null);
        }
      } catch {
        alert("Error updating order.");
      }
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (response.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch {
      alert("Error updating status.");
    }
  };

  const statusConfig: Record<OrderStatus, { text: string, bg: string, icon: React.ComponentType<{ className?: string }> }> = {
    pending: { text: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: Clock },
    processing: { text: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: RotateCw },
    completed: { text: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h2>
           <p className="text-gray-500 mt-1">Process and track customer delivery logistics.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm text-sm font-medium">
          {orders.length} Active Orders
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order, index) => {
           const StatusIcon = statusConfig[order.status].icon;
           return (
             <div key={order.id} className="card p-6 flex flex-col group animate-cascade" style={{ animationDelay: `${index * 75}ms` }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {order.customerName}
                    </h3>
                    <p className="text-sm font-mono text-gray-500">
                      #{order.id} • {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 border shadow-sm ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                    {order.status}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-6 border border-gray-100">
                   <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                   <p className="leading-snug">{order.address}</p>
                </div>

                {order.estimatedArrival && (
                  <div className="flex items-start gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg mb-6 border border-blue-100 font-medium">
                    <Clock className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                    <p className="leading-snug">ETA: {order.estimatedArrival}</p>
                  </div>
                )}

                <div className="mb-6 flex-1">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Items</h4>
                  <ul className="space-y-3">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{item.quantity}</span>
                          <span className="font-medium text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-mono text-gray-900 font-medium">₱{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-100">
                  <div className="flex flex-col">
                     <span className="text-xs font-semibold text-gray-400 uppercase">Total Amount</span>
                     <span className="text-xl font-bold text-gray-900">₱{order.total.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2">
                     {order.status === 'pending' && (
                       <button 
                         onClick={() => handleProcessClick(order.id)}
                         className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                       >
                         Process
                       </button>
                     )}
                     {order.status === 'processing' && (
                       <button 
                         onClick={() => updateOrderStatus(order.id, 'completed')}
                         className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                       >
                         Complete
                       </button>
                     )}
                     {order.status === 'completed' && (
                       <button 
                         onClick={() => setOrderToDelete(order.id)}
                         className="px-4 py-2 bg-white text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-200 shadow-sm transition-all flex items-center gap-2"
                       >
                         <Trash2 className="w-4 h-4" />
                         Delete Record
                       </button>
                     )}
                  </div>
                </div>
             </div>
           );
        })}
        {orders.length === 0 && (
          <div className="col-span-full card p-12 text-center text-gray-500 flex flex-col items-center">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">No active orders</p>
            <p className="text-sm">When customers place orders, they will appear here.</p>
          </div>
        )}
      </div>

      {/* Custom ETA Modal */}
      {activeOrderForETA && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setActiveOrderForETA(null)}>
          <div 
            className="bg-white rounded-2xl p-6 max-w-[400px] w-full shadow-2xl transform transition-all border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <button onClick={() => setActiveOrderForETA(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Set Estimated Arrival</h3>
            <p className="text-sm text-gray-500 mb-5">
              Select the estimated delivery date for this order before processing it.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Arrival Date
              </label>
              <CalendarPicker 
                value={etaDate}
                onChange={setEtaDate}
                minDate={new Date().toISOString().split("T")[0]}
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveOrderForETA(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmProcessOrder}
                disabled={!etaDate}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-colors shadow-sm text-sm ${
                  !etaDate ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setOrderToDelete(null)}>
          <div 
            className="bg-white rounded-2xl p-6 max-w-[360px] w-full shadow-2xl transform transition-all border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <button onClick={() => setOrderToDelete(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Delete Order Record?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              This will permanently remove the record for order <span className="font-mono font-bold text-gray-700">#{orderToDelete}</span>. This action is irreversible.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteOrder(orderToDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
