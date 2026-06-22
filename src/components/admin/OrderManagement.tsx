import React, { useState, useEffect, useRef } from 'react';
import { Package, Clock, RotateCw, CheckCircle, MapPin, Calendar as CalendarIcon, X, Trash2, Search } from 'lucide-react';
import { CalendarPicker } from '../ui/CalendarPicker';
import type { OrderStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '../../config';
<<<<<<< HEAD
=======
import { SkeletonOrderCard } from '../ui/Skeleton';
>>>>>>> 7227ed72a474956bb3eaca7a2ed309bc1ba5c6e0

export const OrderManagement: React.FC = () => {
  const { orders, setOrders, isLoadingOrders, setProducts } = useAppContext();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [activeOrderForETA, setActiveOrderForETA] = useState<string | null>(null);
  const [etaDate, setEtaDate] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptView, setReceiptView] = useState<string | null>(null);
  const [orderToDecline, setOrderToDecline] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmittingDecline, setIsSubmittingDecline] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut '/' to focus Search input (Heuristic 7: Flexibility & Efficiency)
      const isSlash = e.key === '/' || e.code === 'Slash' || e.keyCode === 191;
      
      if (isSlash && 
          document.activeElement !== searchInputRef.current && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();

        searchInputRef.current?.focus();
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 10);
      }
      // Shortcut 'Escape' to dismiss active modals (Heuristic 3: User Control & Freedom)
      if (e.key === 'Escape') {
        setActiveOrderForETA(null);
        setOrderToDelete(null);
        setReceiptView(null);
        setOrderToDecline(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const filteredOrders = orders.filter(o => 
    o.status !== 'cancelled' && (
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
      setGlobalError("Error deleting order.");
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
        setGlobalError("Error updating order.");
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
        if (newStatus === 'declined' || newStatus === 'cancelled') {
          const prodRes = await fetch(`${API_BASE_URL}/products/get.php`);
          if (prodRes.ok) setProducts(await prodRes.json());
        }
      }
    } catch {
      setGlobalError("Error updating status.");
    }
  };

  const handleDeclineOrder = async () => {
    if (!orderToDecline || !declineReason.trim()) return;
    setIsSubmittingDecline(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: orderToDecline, 
          status: 'declined', 
          declineReason: declineReason.trim() 
        })
      });
      if (response.ok) {
        setOrderToDecline(null);
        setDeclineReason('');
        
        // Refresh orders and products to get updated data
        const [ordersRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/orders/get.php`),
          fetch(`${API_BASE_URL}/products/get.php`),
        ]);
        if (ordersRes.ok) {
          setOrders(await ordersRes.json());
        }
        if (prodRes.ok) {
          setProducts(await prodRes.json());
        }
      }
    } catch {
      setGlobalError("Error declining order.");
    } finally {
      setIsSubmittingDecline(false);
    }
  };

  const [globalError, setGlobalError] = useState<string | null>(null);



  const statusConfig: Record<OrderStatus, { text: string, bg: string, icon: React.ComponentType<{ className?: string }> }> = {
    pending: { text: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: Clock },
    processing: { text: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: RotateCw },
    completed: { text: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
    declined: { text: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: X },
    cancelled: { text: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Trash2 },
  };


  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      {globalError && (
        <div className="mb-4 px-4">
          <div className="w-full px-4 py-3 rounded-xl border bg-red-50 border-red-100 text-red-700">{globalError}</div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h2>
           <p className="text-gray-500 mt-1">Process and track customer delivery logistics.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200 rounded shadow-sm select-none pointer-events-none">
               /
             </kbd>
             <input 
                ref={searchInputRef}
               type="text"
               placeholder="Search orders..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="input-field !pl-10 h-10 text-sm bg-white"
             />
           </div>
           <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm text-sm font-medium whitespace-nowrap">
             {orders.filter(o => o.status === 'pending' || o.status === 'processing').length} Active Orders
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoadingOrders ? (
          [1, 2, 3, 4].map((i) => (
            <SkeletonOrderCard key={i} isAdmin={true} />
          ))
        ) : (
          filteredOrders.map((order, index) => {
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

                <div className="flex flex-wrap gap-2 mb-6">
                   <div className="px-3 py-1 bg-parchment border border-sand rounded-lg text-xs font-bold text-brown shadow-sm">
                      {order.paymentMethod || 'Cash on Delivery'}
                   </div>
                   {order.paymentMethod === 'GCash' && order.receiptImage && (
                      <button 
                        onClick={() => setReceiptView(order.receiptImage!)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        View Receipt
                      </button>
                   )}
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
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[8px] font-bold text-gray-400">NO IMG</span>
                            )}
                            <span className="absolute top-0 right-0 bg-gray-900 text-white text-[9px] font-bold w-4 h-4 rounded-bl-lg flex items-center justify-center">
                              {item.quantity}
                            </span>
                          </div>
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

                  <div className="flex gap-2 flex-wrap">
                     {order.status === 'pending' && (
                       <>
                         <button 
                           onClick={() => setOrderToDecline(order.id)}
                           className="px-4 py-2 bg-white text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-200 transition-all"
                         >
                           Decline
                         </button>
                         <button 
                           onClick={() => handleProcessClick(order.id)}
                           className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                         >
                           Process
                         </button>
                       </>
                     )}

                     {order.status === 'processing' && (
                       <button 
                         onClick={() => updateOrderStatus(order.id, 'completed')}
                         className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                       >
                         Complete
                       </button>
                     )}

                      {(order.status === 'completed' || order.status === 'declined') && (
                        <button 
                       onClick={() => setOrderToDelete(order.id)}
                       className="px-4 py-2 bg-red-600 text-white border border-red-200 rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
                     >
                       Delete
                     </button>
                      )}
                  </div>
                </div>
             </div>
           );
          })
        )}
        {!isLoadingOrders && filteredOrders.length === 0 && (
          <div className="col-span-full card p-12 text-center text-gray-500 flex flex-col items-center">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              {searchQuery ? `No results for "${searchQuery}"` : 'No active orders'}
            </p>
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

      {/* Receipt Modal */}
      {receiptView && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setReceiptView(null)}>
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Payment Verification</h3>
              <button onClick={() => setReceiptView(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-gray-900 flex items-center justify-center min-h-[400px]">
              <img src={receiptView} alt="GCash Receipt" className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-sm" />
            </div>
            <div className="p-6 text-center bg-white">
              <p className="text-sm text-gray-500 italic mb-4">Please examine the reference number and amount carefully.</p>
              <button onClick={() => setReceiptView(null)} className="btn-primary w-full py-3">Done Reviewing</button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {orderToDecline && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setOrderToDecline(null)}>
          <div 
            className="bg-white rounded-2xl p-8 max-w-[450px] w-full shadow-2xl transform transition-all border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <X className="w-6 h-6" />
              </div>
              <button onClick={() => setOrderToDecline(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Decline Order</h3>
            <p className="text-sm text-gray-500 mb-6">
              Please provide a reason why this order is being declined. The customer will be notified of this message.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Reason for Declining
              </label>
              <textarea 
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="input-field min-h-[120px] resize-none pt-3"
                placeholder="e.g. Invalid GCash receipt, Out of delivery range, etc."
                autoFocus
              />
            </div>
            
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setOrderToDecline(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={handleDeclineOrder}
                disabled={!declineReason.trim() || isSubmittingDecline}
                className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  !declineReason.trim() || isSubmittingDecline 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-red-100'
                }`}
              >
                {isSubmittingDecline ? 'Declining...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};
