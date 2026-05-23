import React from 'react';
import { TrendingUp, Package, Tag } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { SkeletonDashboard } from '../ui/Skeleton';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { orders, products, isLoadingProducts, isLoadingOrders } = useAppContext();
  
  if (isLoadingProducts || isLoadingOrders) {
    return (
      <div className="animate-in fade-in duration-300 max-w-6xl">
        <SkeletonDashboard />
      </div>
    );
  }

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
           <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>Store Overview</h2>
           <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>Insights and operations for 'The Find' today.</p>
         </div>

      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="p-6 rounded-xl flex flex-col relative animate-cascade border border-[var(--border)]" style={{ backgroundColor: 'var(--warm-white)', animationDelay: '0ms' }}>
          <div className="flex items-start justify-between mb-8">
             <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--parchment)] text-[var(--charcoal)]">
               <TrendingUp className="w-4 h-4" />
             </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--text-muted)' }}>Today's Revenue</h3>
            <p className="text-3xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--charcoal)' }}>
              ₱{todayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)] border-dashed text-[10px] italic" style={{ color: 'var(--text-light)' }}>
            From {todayTransactions.length} successful transactions
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="p-6 rounded-xl flex flex-col relative animate-cascade border border-[var(--border)]" style={{ backgroundColor: 'var(--warm-white)', animationDelay: '100ms' }}>
          <div className="flex items-start justify-between mb-8">
             <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--parchment)] text-[var(--charcoal)]">
               <Package className="w-4 h-4" />
             </div>
             {lowStockProducts.length > 0 && (
               <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-600">
                 Action Needed
               </span>
             )}
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--text-muted)' }}>Low Stock Items</h3>
            <p className="text-3xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--charcoal)' }}>
              {lowStockProducts.length} Items
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)] border-dashed text-[10px] font-semibold flex justify-between items-center" style={{ color: 'var(--text-light)' }}>
            <span>Inventory requires attention</span>
            <button className="underline hover:text-[var(--brown)]" onClick={() => onNavigate?.('inventory')}>View Inventory</button>
          </div>
        </div>

        {/* Top Product Card */}
        <div className="p-6 rounded-xl flex flex-col relative animate-cascade border border-[var(--border)]" style={{ backgroundColor: 'var(--warm-white)', animationDelay: '200ms' }}>
          <div className="flex items-start justify-between mb-8">
             <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--parchment)] text-[var(--charcoal)]">
               <Tag className="w-4 h-4" />
             </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--text-muted)' }}>Top Selling Item</h3>
            <p className={`text-3xl tracking-tight truncate ${topProduct ? 'text-[var(--charcoal)]' : 'text-gray-400 italic'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {topProduct ? topProduct[0] : 'N/A'}
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-[var(--border)] border-dashed text-[10px]" style={{ color: 'var(--text-light)' }}>
            {topProduct ? `${topProduct[1]} unit(s) sold all-time` : 'Waiting for sales data'}
          </div>
        </div>
      </div>

      {/* Middle Section (Chart & Orders List) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Sales Trend Chart Container */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-[var(--border)] flex flex-col" style={{ backgroundColor: 'var(--warm-white)' }}>
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-[17px]" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>Sales Trend <span className="text-[11px] font-sans font-medium text-gray-400 ml-1 tracking-wide">(Last 7 Days)</span></h3>
            <button className="px-3 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-wider flex items-center gap-2 border border-[var(--border)] bg-[var(--parchment)]" style={{ color: 'var(--brown)' }}>
              <span className="w-2 h-2 rounded-full bg-[var(--brown)]"></span> WEEKLY REVENUE
            </button>
          </div>
          <div className="flex items-end justify-between gap-2 md:gap-4 h-48 mt-auto relative">
            {/* Background grid line */}
            <div className="absolute bottom-0 left-0 w-full border-t border-dashed border-[var(--border)] z-0"></div>
            {dailySales.map((data, idx) => {
               const maxSale = Math.max(...dailySales.map(d => d.total), 100);
               const height = (data.total / maxSale) * 100;
               const isHighlighted = idx === 5; // e.g. highlighting Saturday like the mockup
               return (
                 <div key={data.day} className="flex-1 flex flex-col items-center gap-4 group z-10 h-full justify-end">
                    <div className="relative w-full flex flex-col items-center h-full justify-end">
                       {/* Tooltip */}
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--charcoal)] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none z-20">
                         ₱{data.total.toLocaleString()}
                       </div>
                       <div 
                         className="w-full max-w-[36px] transition-all duration-500 rounded-t-md"
                         style={{ height: `${Math.max(height, 5)}%`, backgroundColor: isHighlighted ? 'var(--brown)' : 'var(--parchment)' }}
                       >
                       </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: isHighlighted ? 'var(--charcoal)' : 'var(--text-light)' }}>
                       {new Date(data.day).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                 </div>
               );
            })}
          </div>
        </div>

        {/* Pending Orders List */}
        <div className="p-0 rounded-xl border border-[var(--border)] flex flex-col relative" style={{ backgroundColor: 'var(--warm-white)' }}>
          <div className="p-6 flex items-center justify-between border-b border-[var(--border)]">
            <h3 className="text-[17px]" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>Pending Orders</h3>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--parchment)]" style={{ color: 'var(--charcoal)' }}>
              {orders.filter(o => o.status !== 'completed').length}
            </span>
          </div>
          <div className="flex-1 flex flex-col divide-y divide-[var(--border)]">
            {orders.filter(o => o.status !== 'completed').slice(0,3).map((order) => (
              <div key={order.id} className="p-4 flex items-start gap-4 hover:bg-[var(--cream)] transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded bg-[var(--parchment)] overflow-hidden border border-[var(--border)] flex-shrink-0">
                  {order.items[0]?.imageUrl && <img src={order.items[0].imageUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-[13px] font-bold" style={{ color: 'var(--charcoal)' }}>Order #{order.id.toString().padStart(4, '0')}</p>
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${order.status === 'processing' ? 'text-orange-500' : 'text-blue-500'}`}>
                      {order.status === 'processing' ? 'PREPARING' : 'NEW'}
                    </span>
                  </div>
                  <p className="text-[11px] truncate" style={{ color: 'var(--brown)' }}>{order.items.map(i => i.name).join(', ')}</p>
                </div>
              </div>
            ))}
            {orders.filter(o => o.status !== 'completed').length === 0 && (
              <div className="p-8 text-center text-[12px]" style={{ color: 'var(--text-light)' }}>
                No pending orders!
              </div>
            )}
          </div>
          <div className="p-4 border-t border-[var(--border)] text-center pb-6">
            <button
              className="text-[10px] font-bold uppercase tracking-widest hover:underline"
              style={{ color: 'var(--brown)' }}
              onClick={() => onNavigate?.('orders')}
            >
              View All Orders
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
