import React from 'react';
import { Clock, RotateCw, CheckCircle, FileText, Trash2, X, Inbox } from 'lucide-react';

import { useAppContext } from '../../context/AppContext';
import type { OrderStatus } from '../../types';
import { API_BASE_URL } from '../../config';
import { SkeletonOrderCard } from '../ui/Skeleton';

export const MyOrders: React.FC = () => {
  const { orders, user, setOrders, setProducts, isLoadingOrders } = useAppContext();
  const [filter, setFilter] = React.useState<'all' | OrderStatus>('all');
  const [selectedReceipt, setSelectedReceipt] = React.useState<any | null>(null);
  const [orderToDelete, setOrderToDelete] = React.useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Fetch orders on mount / user change
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = user?.role === 'admin'
          ? `${API_BASE_URL}/orders/get.php`
          : `${API_BASE_URL}/orders/get.php?username=${encodeURIComponent(user?.username || '')}`;
        const res = await fetch(url);
        if (res.ok) setOrders(await res.json());
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };
    fetchOrders();
  }, [user, setOrders]);

  // Global Escape key to close modals
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReceipt(null);
        setOrderToDelete(null);
        setOrderToCancel(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const myOrders = orders.filter(o => o.username === user?.username);
  const activeOrders = myOrders.filter(o => o.status !== 'cancelled');
  const filteredOrders = filter === 'all' ? activeOrders : activeOrders.filter(o => o.status === filter);

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/orders/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderToDelete })
      });
      if (response.ok) {
        // Refresh orders & products
        const [prodRes, orderRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products/get.php`),
          fetch(`${API_BASE_URL}/orders/get.php?username=${encodeURIComponent(user?.username ?? '')}`)
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (orderRes.ok) setOrders(await orderRes.json());
        setOrderToDelete(null);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMsg('Unable to delete order. Please try again later.');
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      const response = await fetch(`${API_BASE_URL}/orders/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderToCancel, status: 'cancelled' })
      });
      if (response.ok) {
        // Refresh orders & products
        const [prodRes, orderRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products/get.php`),
          fetch(`${API_BASE_URL}/orders/get.php?username=${encodeURIComponent(user?.username ?? '')}`)
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (orderRes.ok) setOrders(await orderRes.json());
        setOrderToCancel(null);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText);
      }
    } catch (err) {
      console.error('Cancel error:', err);
      setErrorMsg('Unable to cancel order. Please try again later.');
    }
  };

  const statusConfig: Record<OrderStatus, { text: string; bg: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
    pending: { text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
    processing: { text: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: RotateCw },
    completed: { text: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
    declined: { text: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: X },
    cancelled: { text: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Trash2 },
  };

  return (
    <>
      {/* Main Orders Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        {errorMsg && (
          <div className="mb-4 px-4">
            <div className="w-full px-4 py-3 rounded-xl border bg-red-50 border-red-100 text-red-700">
              {errorMsg}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h2>
            <p className="text-gray-500 mt-1">Track the status of your recent purchases.</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {(['all', 'pending', 'processing', 'completed', 'declined'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${filter === s ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {isLoadingOrders ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonOrderCard key={i} />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-12 text-gray-500">
            <Inbox className="w-12 h-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">No orders yet</p>
            <p className="text-sm">Explore the store and place an order to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order, index) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <div key={order.id} className="card p-6 flex flex-col group border border-gray-100 hover:border-blue-200 transition-colors animate-cascade" style={{ animationDelay: `${index * 75}ms` }}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Order #{order.id}</h3>
                      <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 border shadow-sm ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${order.status === 'processing' ? 'animate-spin' : ''}`} /> {order.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 uppercase shadow-sm">
                      {order.paymentMethod || 'Cash on Delivery'}
                    </div>
                    {order.paymentMethod === 'GCash' && (
                      <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-bold text-blue-600 uppercase shadow-sm">Receipt Attached</div>
                    )}
                  </div>

                  {order.estimatedArrival && (
                    (() => {
                      const today = new Date();
                      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                      const isToday = order.estimatedArrival.startsWith(todayStr);
                      const displayDate = new Date(order.estimatedArrival).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                      
                      return (
                        <div className={`flex items-start gap-2 text-sm p-3 rounded-lg mb-6 border font-medium animate-in fade-in ${isToday ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          <Clock className={`w-4 h-4 mt-0.5 shrink-0 ${isToday ? 'text-green-500' : 'text-blue-400'}`} />
                          <p className="leading-snug">{isToday ? 'Arriving Today' : `Estimated Arrival: ${displayDate}`}</p>
                        </div>
                      );
                    })()
                  )}

                  <div className="mb-6 flex-1">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Purchased Items</h4>
                    <ul className="space-y-3">
                      {order.items.map((item: any) => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{item.quantity}</span>
                            <span className="font-medium text-gray-700">{item.name}</span>
                          </div>
                          <span className="font-mono text-gray-900 font-medium">₱{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    {order.status === 'declined' && order.declineReason && (
                      <div className="flex flex-col gap-2 p-4 bg-red-50 border border-red-100 rounded-xl mt-4">
                        <div className="flex items-center gap-2 text-red-700 font-bold text-sm"><X className="w-4 h-4" /> Order Declined</div>
                        <p className="text-sm text-red-600 bg-white/50 p-3 rounded-lg border border-red-100 italic">{order.declineReason}</p>
                        <p className="text-[10px] text-red-400 font-medium uppercase tracking-wider">Please contact support if you have questions.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.status === 'pending' && (
                        <button onClick={() => setOrderToCancel(order.id)} className="px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[11px] font-bold uppercase hover:bg-orange-600 hover:text-white transition-all flex items-center gap-1.5">
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      )}
                      {(order.status === 'completed' || order.status === 'declined' || order.status === 'cancelled') && (
                        <button onClick={() => setOrderToDelete(order.id)} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[11px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      )}
                      <button onClick={() => setSelectedReceipt(order)} className="px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-[11px] font-bold uppercase hover-bg-black hover:text-white transition-all flex items-center gap-1.5">
                        <FileText className="w-3 h-3" /> Receipt
                      </button>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">₱{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 pb-4 flex flex-col items-center border-b border-gray-100 border-dashed">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Order Invoice</h3>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Status: {selectedReceipt.status}</p>
            </div>
            <div className="p-8 pt-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 font-mono text-xs text-gray-600 space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                  <span className="font-bold uppercase tracking-widest">E-Receipt</span>
                  <span>#{selectedReceipt.id}</span>
                </div>
                <div className="space-y-2">
                  {selectedReceipt.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-4 text-sm font-bold text-gray-900">
                  <span>Total Charged</span>
                  <span>₱{selectedReceipt.total.toFixed(2)}</span>
                </div>
                <div className="text-center pt-4 opacity-50">
                  <p>{new Date(selectedReceipt.date).toLocaleString()}</p>
                  <p className="mt-1">Thanks for choosing The Find!</p>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="w-full py-3.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 pb-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete this order?</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                This action will remove your order and restore the items to our inventory. This cannot be undone.
              </p>
            </div>
            <div className="p-8 flex gap-3">
              <button
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleDeleteOrder}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 pb-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <X className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cancel this order?</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                This will cancel your order and restore the items to our inventory. Are you sure?
              </p>
            </div>
            <div className="p-8 flex gap-3">
              <button
                onClick={() => setOrderToCancel(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
