import React from 'react';
import { Activity, Calendar, Server, Globe } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const SalesReport: React.FC = () => {
  const { transactions, orders } = useAppContext();

  // Merge POS transactions and Completed Online Orders into a single ledger array
  const completedOrdersAsTransactions = orders
    .filter(o => o.status === 'completed')
    .map(o => ({
      ...o,
      source: 'Online Checkout',
      sourceIcon: Globe
    }));

  const posTransactions = transactions.map(t => ({
      ...t,
      source: 'Terminal POS',
      sourceIcon: Server
  }));

  const mergedLedger = [...posTransactions, ...completedOrdersAsTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalRevenue = mergedLedger.reduce((sum, t) => sum + t.total, 0);
  const avgOrderValue = mergedLedger.length > 0 ? totalRevenue / mergedLedger.length : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Global Sales Ledger</h2>
           <p className="text-gray-500 mt-1">Unified view of Terminal Transactions and Completed Delivery Orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
         <div className="card p-6 bg-slate-900 text-white border-none">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Global Revenue</p>
            <p className="text-3xl font-black font-mono">₱{totalRevenue.toLocaleString()}</p>
         </div>
         <div className="card p-6 bg-white">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Volume</p>
            <p className="text-3xl font-black font-mono text-gray-900">{mergedLedger.length}</p>
         </div>
         <div className="card p-6 bg-white">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Transaction Value</p>
            <p className="text-3xl font-black font-mono text-gray-900">₱{avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
         </div>
      </div>
      
      <div className="card overflow-hidden">
        {mergedLedger.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
             <Activity className="w-16 h-16 text-gray-300 mb-6 drop-shadow-md" />
             <p className="text-xl font-bold text-gray-900 mb-2">No ledger history initialized</p>
             <p className="text-gray-500 text-sm max-w-sm mx-auto">Both POS transactions and completed online orders will aggregate here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                   <th className="p-5 pl-6">ID Reference</th>
                   <th className="p-5">Ledger Source</th>
                   <th className="p-5">Recorded Timestamp</th>
                   <th className="p-5">Items Mass</th>
                   <th className="p-5 pr-6 text-right">Yield Value</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {mergedLedger.map((t, index) => {
                   const SourceIcon = t.sourceIcon;
                   const isOnline = t.source === 'Online Checkout';

                   return (
                   <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group animate-cascade" style={{ animationDelay: `${index * 50}ms` }}>
                     <td className="p-5 pl-6 font-mono text-sm font-semibold text-gray-600">
                       <span className="text-gray-300">#</span>{t.id}
                     </td>
                     <td className="p-5">
                       <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${isOnline ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                         <SourceIcon className="w-3.5 h-3.5" />
                         {t.source}
                       </div>
                     </td>
                     <td className="p-5">
                       <div className="flex items-center gap-2 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                         <Calendar className="w-4 h-4 text-gray-400" />
                         {new Date(t.date).toLocaleString(undefined, {
                           year: 'numeric', month: 'short', day: 'numeric',
                           hour: '2-digit', minute: '2-digit'
                         })}
                       </div>
                     </td>
                     <td className="p-5">
                       <span className="inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded border border-gray-200 bg-white shadow-sm text-xs font-bold text-gray-800">
                         {t.items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0)} Pcs
                       </span>
                     </td>
                     <td className="p-5 pr-6 text-right font-mono font-bold text-gray-900 text-lg">
                       ₱{t.total.toFixed(2)}
                     </td>
                   </tr>
                 )})}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};
