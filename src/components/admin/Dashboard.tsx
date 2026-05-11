import React from 'react';
import { TrendingUp, Package, Tag, ArrowUpRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const { orders } = useAppContext();
  
  const todayTransactions = orders.filter(o => {
    if (o.status !== 'completed') return false;
    // Database stores UTC string (YYYY-MM-DD HH:MM:SS)
    // We add 'Z' to make it ISO UTC so JS parses it correctly as UTC and converts to local
    const orderDate = new Date(o.date.replace(' ', 'T') + 'Z'); 
    const now = new Date();
    return orderDate.toDateString() === now.toDateString();
  });
  const todayTotal = todayTransactions.reduce((sum, o) => sum + o.total, 0);

  const productSales: Record<string, number> = {};
  orders.filter(o => o.status === 'completed').forEach(o => {
    o.items.forEach(item => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });
  
  const topProduct = Object.entries(productSales)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="mb-10">
         <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Overview Dashboard</h2>
         <p className="text-gray-500 mt-1">Track your daily retail performance and insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
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
             <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
               <Package className="w-5 h-5" />
             </div>
             <h3 className="font-semibold text-gray-700">Transactions</h3>
          </div>
          <p className="text-4xl font-bold text-[var(--sienna)] mt-auto flex items-end justify-between font-mono tracking-tight">
            {todayTransactions.length} <span className="text-sm font-medium text-green-600 mb-1 flex items-center font-sans tracking-normal"><ArrowUpRight className="w-4 h-4 mr-1"/> Active</span>
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
    </div>
  );
};
