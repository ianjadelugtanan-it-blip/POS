import React from 'react';
import { Package, Clock, RotateCw, CheckCircle, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { OrderStatus } from '../../types';

export const MyOrders: React.FC = () => {
  const { orders, user } = useAppContext();
  
  const myOrders = orders.filter(o => o.username === user?.username);

  const statusConfig: Record<OrderStatus, { text: string, bg: string, icon: React.FC<any> }> = {
    pending: { text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
    processing: { text: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: RotateCw },
    completed: { text: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h2>
           <p className="text-gray-500 mt-1">Track the status of your recent purchases.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myOrders.map((order, index) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <div key={order.id} className="card p-6 flex flex-col group border border-gray-100 hover:border-blue-200 transition-colors animate-cascade" style={{ animationDelay: `${index * 75}ms` }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 border shadow-sm ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                    {order.status}
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Purchased Items</h4>
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

                <div className="mt-auto pt-5 border-t border-gray-100 flex flex-col gap-4">
                  {order.estimatedArrival && (
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                      <Clock className="w-4 h-4" />
                      <span>Estimated Arrival: {order.estimatedArrival}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>Requires Delivery</span>
                    </div>
                    <div className="flex flex-col text-right">
                       <span className="text-xs font-semibold text-gray-400 uppercase">Total Amount</span>
                       <span className="text-xl font-bold text-gray-900">₱{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
        {myOrders.length === 0 && (
          <div className="col-span-full card p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <Package className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-1">No orders yet</p>
            <p className="text-gray-500">Looks like you haven't made a purchase. Browse the collection.</p>
          </div>
        )}
      </div>
    </div>
  );
};
