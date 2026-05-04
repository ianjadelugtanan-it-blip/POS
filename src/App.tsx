import React, { useState } from 'react';
import { AppContextProvider, useAppContext } from './context/AppContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/admin/Dashboard';
import { POSCashier } from './components/admin/POSCashier';
import { Inventory } from './components/admin/Inventory';
import { OrderManagement } from './components/admin/OrderManagement';
import { SalesReport } from './components/admin/SalesReport';
import { AdminUsersManagement } from './components/admin/AdminUsersManagement';
import { Shop } from './components/client/Shop';
import { Cart } from './components/client/Cart';
import { Checkout } from './components/client/Checkout';
import { MyOrders } from './components/client/MyOrders';
import { Footer } from './components/Footer';
import { Menu, Shirt } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return <Login />;

  if (user.role === 'client' && !['shop', 'cart', 'my-orders'].includes(activeTab)) {
    setActiveTab('shop');
  }
  if (user.role === 'admin' && ['shop', 'cart', 'my-orders'].includes(activeTab)) {
    setActiveTab('dashboard');
  }

  const handleCheckoutComplete = () => {
    setIsCheckout(false);
    setActiveTab('my-orders');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--cream)' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 overflow-y-auto relative">
        {/* Subtle dot texture overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(#C9B99A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Mobile Header */}
        <div
          className="md:hidden sticky top-0 z-30 px-5 py-3.5 flex items-center justify-between"
          style={{ backgroundColor: 'var(--warm-white)', borderBottom: '1px solid var(--border)', boxShadow: '0 1px 6px rgba(92,61,46,0.06)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--sienna)' }}>
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>
              The Find
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <main className="relative z-10 min-h-full px-5 py-7 md:px-10 md:py-10 max-w-[1500px] mx-auto">
          {user.role === 'admin' ? (
            <>
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'pos' && <POSCashier />}
              {activeTab === 'inventory' && <Inventory />}
              {activeTab === 'orders' && <OrderManagement />}
              {activeTab === 'sales-report' && <SalesReport />}
              {activeTab === 'users' && <AdminUsersManagement />}
            </>
          ) : (
            <>
              {activeTab === 'shop' && <Shop />}
              {activeTab === 'cart' && (
                isCheckout ? (
                  <Checkout onBackToCart={() => setIsCheckout(false)} onOrderComplete={handleCheckoutComplete} />
                ) : (
                  <Cart onProceedToCheckout={() => setIsCheckout(true)} />
                )
              )}
              {activeTab === 'my-orders' && <MyOrders />}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppContextProvider>
      <MainApp />
    </AppContextProvider>
  );
}
