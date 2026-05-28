import React from 'react';
import { TrendingUp, Package, Tag, Shirt } from 'lucide-react';
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

  const lowStockProducts = products.filter(p => p.stock < 3 && p.stock > 0);

  const activeOrders = orders.filter((o) => {
    const status = String(o.status ?? '').trim().toLowerCase();
    return status === 'pending' || status === 'processing';
  });

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
        <div className="lg:col-span-2 p-6 rounded-xl border border-[var(--border)] flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--warm-white)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[17px]" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>
                Sales Trend <span className="text-[11px] font-sans font-medium text-gray-400 ml-1 tracking-wide">(Last 7 Days)</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Weekly total chip */}
              <div className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide border border-[var(--border)] flex items-center gap-1.5" style={{ backgroundColor: 'var(--parchment)', color: 'var(--sienna)' }}>
                <span>WEEK</span>
                <span className="font-black font-mono">₱{dailySales.reduce((s, d) => s + d.total, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between gap-2 md:gap-3 mt-auto relative" style={{ height: '168px' }}>
            {/* Horizontal grid lines */}
            {[25, 50, 75, 100].map(pct => (
              <div key={pct} className="absolute w-full border-t border-dashed pointer-events-none" style={{ bottom: `${pct}%`, borderColor: 'var(--border)', opacity: 0.45 }} />
            ))}

            {dailySales.map((data, idx) => {
              const maxSale = Math.max(...dailySales.map(d => d.total), 1);
              const height = Math.max((data.total / maxSale) * 100, data.total > 0 ? 8 : 3);
              const isToday = idx === dailySales.length - 1;
              const dayLabel = new Date(data.day).toLocaleDateString('en-US', { weekday: 'short' });

              let barStyle: React.CSSProperties;
              if (isToday && data.total > 0) {
                barStyle = { background: 'linear-gradient(180deg, var(--sienna) 0%, var(--brown) 100%)', boxShadow: '0 4px 20px rgba(196,117,43,0.4)' };
              } else if (data.total > 0) {
                barStyle = { background: 'linear-gradient(180deg, var(--sand) 0%, var(--border-strong) 100%)' };
              } else {
                barStyle = { backgroundColor: 'var(--parchment)', border: '1px solid var(--border)' };
              }

              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2 group z-10 h-full justify-end">
                  <div className="relative w-full flex flex-col items-center justify-end h-full">
                    {/* Value label above bar */}
                    {data.total > 0 && (
                      <div
                        className="absolute text-[9px] font-black font-mono whitespace-nowrap"
                        style={{
                          bottom: `calc(${height}% + 7px)`,
                          color: isToday ? 'var(--sienna)' : 'var(--text-muted)',
                          opacity: isToday ? 1 : 0.65,
                        }}
                      >
                        ₱{data.total >= 1000 ? (data.total / 1000).toFixed(1) + 'k' : data.total}
                      </div>
                    )}

                    {/* Pulse ring on today's bar (bottom anchor) */}
                    {isToday && data.total > 0 && (
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(196,117,43,0.25) 0%, transparent 70%)',
                          animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
                        }}
                      />
                    )}

                    {/* The bar */}
                    <div
                      className="w-full max-w-[40px] rounded-t-xl transition-all duration-700 ease-out cursor-default group-hover:brightness-110 group-hover:scale-x-105 origin-bottom relative overflow-hidden"
                      style={{ height: `${height}%`, ...barStyle }}
                    >
                      {/* Shine cap */}
                      <div className="absolute top-0 left-0 w-full h-2 rounded-t-xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)' }} />
                    </div>
                  </div>

                  {/* Day label */}
                  <span
                    className="text-[9px] font-black uppercase tracking-widest transition-colors"
                    style={{ color: isToday ? 'var(--sienna)' : 'var(--text-light)' }}
                  >
                    {dayLabel}
                    {isToday && <span className="block text-center" style={{ fontSize: '7px', letterSpacing: 0, color: 'var(--sienna)' }}>TODAY</span>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-dashed border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-light)' }}>
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'linear-gradient(180deg, var(--sienna), var(--brown))' }} />
              Today
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-light)' }}>
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'linear-gradient(180deg, var(--sand), var(--border-strong))' }} />
              Past Days
            </div>
          </div>
        </div>


        {/* Pending Orders List */}
        <div className="p-0 rounded-xl border border-[var(--border)] flex flex-col relative" style={{ backgroundColor: 'var(--warm-white)' }}>
          <div className="p-6 flex items-center justify-between border-b border-[var(--border)]">
            <h3 className="text-[17px]" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>Pending Orders</h3>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--parchment)]" style={{ color: 'var(--charcoal)' }}>
              {activeOrders.length}
            </span>
          </div>
          <div className="flex-1 flex flex-col divide-y divide-[var(--border)]">
            {activeOrders.slice(0,3).map((order) => (
              <div key={order.id} className="p-4 flex items-start gap-4 hover:bg-[var(--cream)] transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded bg-[var(--parchment)] overflow-hidden border border-[var(--border)] flex-shrink-0 flex items-center justify-center">
                  {order.items[0]?.imageUrl ? (
                    <img src={order.items[0].imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Shirt className="w-6 h-6 text-gray-300" />
                  )}
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
            {activeOrders.length === 0 && (
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
