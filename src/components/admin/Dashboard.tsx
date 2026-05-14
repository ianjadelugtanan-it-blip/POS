import React from 'react';
import { TrendingUp, Package, Tag, ArrowUpRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const { orders, products } = useAppContext();
  
  const todayTransactions = orders.filter(o => {
    if (o.status !== 'completed') return false;
    const orderDate = new Date(o.date.replace(' ', 'T') + 'Z'); 
    const now = new Date();
    return orderDate.toDateString() === now.toDateString();
  });
  const todayTotal = todayTransactions.reduce((sum, o) => sum + o.total, 0);

  // Sales Trend (Last 7 Days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  }).reverse();

  const dailySales = last7Days.map(day => {
    const total = orders
      .filter(o => o.status === 'completed' && new Date(o.date.replace(' ', 'T') + 'Z').toDateString() === day)
      .reduce((sum, o) => sum + o.total, 0);
    return { day, total };
  });

  const lowStockProducts = products.filter(p => p.stock < 5);

  const categorySales: Record<string, number> = {};
  orders.filter(o => o.status === 'completed').forEach(o => {
    o.items.forEach(item => {
      categorySales[item.category] = (categorySales[item.category] || 0) + (item.price * item.quantity);
    });
  });

  const productSales: Record<string, number> = {};
  orders.filter(o => o.status === 'completed').forEach(o => {
    o.items.forEach(item => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });
  
  const topProduct = Object.entries(productSales)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-10">
      <div className="mb-10">
         <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Overview Dashboard</h2>
         <p className="text-gray-500 mt-1">Track your daily retail performance and insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        
        <div className="card p-6 flex flex-col relative overflow-hidden group animate-cascade" style={{ animationDelay: '0ms' }}>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
             <TrendingUp className="w-24 h-24 text-blue-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
               <TrendingUp className="w-5 h-5" />
             </div>
             <h3 className="font-semibold text-gray-700">Today's Revenue</h3>
          </div>
          <p className="text-4xl font-bold text-[var(--sienna)] mt-auto font-mono tracking-tight">
            ₱{todayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="card p-6 flex flex-col relative overflow-hidden group animate-cascade" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
             <Package className="w-24 h-24 text-green-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
               <Package className="w-5 h-5" />
             </div>
             <h3 className="font-semibold text-gray-700">Pending Orders</h3>
          </div>
          <p className="text-4xl font-bold text-[var(--sienna)] mt-auto flex items-end justify-between font-mono tracking-tight">
            {orders.filter(o => o.status !== 'completed').length} <span className="text-sm font-medium text-orange-600 mb-1 flex items-center font-sans tracking-normal">Action Required</span>
          </p>
        </div>

        <div className="card p-6 flex flex-col relative overflow-hidden group lg:col-span-1 md:col-span-2 animate-cascade" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
             <Tag className="w-24 h-24 text-purple-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
               <Tag className="w-5 h-5" />
             </div>
             <h3 className="font-semibold text-gray-700">Top Product</h3>
          </div>
          <div className="mt-auto">
             <p className={`text-2xl font-bold leading-tight ${topProduct ? 'text-gray-900' : 'text-gray-400 italic font-medium'}`}>
               {topProduct ? topProduct[0] : 'N/A'}
             </p>
             <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1.5">
               {topProduct ? (
                 <>
                   <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                   {topProduct[1]} units sold today
                 </>
               ) : (
                 <>
                   <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                   Waiting for sales data
                 </>
               )}
             </p>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="card p-8 mb-10">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-lg font-bold text-gray-900">Sales Trend</h3>
               <p className="text-xs text-gray-500 font-medium">Revenue performance over the last 7 days</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
         </div>
         <div className="flex items-end justify-between gap-4 h-48 pt-4">
            {dailySales.map((data, idx) => {
               const maxSale = Math.max(...dailySales.map(d => d.total), 100);
               const height = (data.total / maxSale) * 100;
               return (
                 <div key={data.day} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="relative w-full flex flex-col items-center">
                       {/* Tooltip */}
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none z-10">
                         ₱{data.total.toLocaleString()}
                       </div>
                       <div 
                         className="w-full max-w-[40px] bg-blue-600/10 group-hover:bg-blue-600 transition-all duration-500 rounded-t-lg relative overflow-hidden"
                         style={{ height: `${Math.max(height, 5)}%` }}
                       >
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                       {idx === 6 ? 'Today' : data.day.split(' ')[0]}
                    </span>
                 </div>
               );
            })}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Low Stock Alerts */}
         <div className="card p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 Low Stock Alerts
               </h3>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{lowStockProducts.length} Items</span>
            </div>
            <div className="space-y-4">
               {lowStockProducts.length === 0 ? (
                 <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-sm">All items are sufficiently stocked.</p>
                 </div>
               ) : (
                 lowStockProducts.map(product => (
                   <div key={product.id} className="flex items-center justify-between p-4 rounded-xl bg-red-50/30 border border-red-100/50">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-white border border-red-100 flex items-center justify-center text-[10px] font-bold text-red-400 overflow-hidden">
                           {product.imageUrl ? <img src={product.imageUrl} alt="" className="w-full h-full object-cover" /> : 'IMG'}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-bold text-red-600">{product.stock} left</p>
                         <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Restock Soon</p>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         {/* Category Performance */}
         <div className="card p-8 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Category Performance</h3>
            <div className="space-y-6">
               {Object.keys(categorySales).length === 0 ? (
                 <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-sm">No sales data recorded yet.</p>
                 </div>
               ) : (
                 Object.entries(categorySales).sort(([,a], [,b]) => b - a).map(([category, amount], idx) => {
                   const maxAmount = Math.max(...Object.values(categorySales));
                   const percentage = (amount / maxAmount) * 100;
                   const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500'];
                   return (
                     <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                           <span className="font-bold text-gray-700">{category}</span>
                           <span className="font-mono font-bold text-gray-900">₱{amount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-1000`} 
                             style={{ width: `${percentage}%` }}
                           ></div>
                        </div>
                     </div>
                   );
                 })
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
