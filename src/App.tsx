import React, { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import { AppContextProvider } from './context/AppContextProvider';
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
import { ClientNavbar } from './components/client/ClientNavbar';
import { Footer } from './components/Footer';
import { Menu, Shirt, Search, Bell, HelpCircle, LogOut } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, products, orders, isLoggingOut } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Welcome screen animation states
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [prevUser, setPrevUser] = useState(user);

  useEffect(() => {
    // Trigger animation when moving from logged-out to logged-in
    if (!prevUser && user) {
      setShowWelcome(true);
      setIsFadingOut(false);
      
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        const removeTimer = setTimeout(() => setShowWelcome(false), 600); // Wait for fade out
        return () => clearTimeout(removeTimer);
      }, 1500); // Show splash for 1.5 seconds
      
      return () => clearTimeout(fadeTimer);
    }
    setPrevUser(user);
  }, [user, prevUser]);

  const lowStockProducts = products ? products.filter(p => p.stock < 5) : [];
  const pendingOrders = orders ? orders.filter(o => o.status !== 'completed') : [];
  const totalNotifications = lowStockProducts.length + pendingOrders.length;

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
    <div className={`flex h-screen overflow-hidden ${user.role === 'client' ? 'flex-col' : ''}`} style={{ backgroundColor: 'var(--cream)' }}>
      {user.role === 'admin' ? (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      ) : (
        <ClientNavbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      <div className="flex-1 overflow-y-auto relative">
        {/* Subtle dot texture overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(#C9B99A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Top Bar (Admin Only) */}
        {user.role === 'admin' && (
          <header className="px-5 py-5 md:px-10 flex items-center justify-between border-b border-[var(--border)] bg-transparent">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders, inventory or staff..." 
                className="w-full bg-[var(--cream)] border border-[var(--border)] rounded-full pl-11 pr-4 py-2.5 text-[13px] outline-none focus:border-[var(--border-strong)] transition-colors placeholder:text-gray-400"
              />
            </div>
            
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg transition-colors text-[var(--text-muted)]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-6 ml-auto">
              
              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsHelpOpen(false); }}
                  className={`relative transition-colors ${isNotificationsOpen ? 'text-[var(--brown)]' : 'text-gray-500 hover:text-[var(--brown)]'}`} 
                  title="Notifications"
                >
                  <Bell className="w-[18px] h-[18px]" />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-[var(--cream)] rounded-full"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute top-full right-0 mt-6 w-72 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[var(--border)] overflow-hidden z-50 animate-cascade">
                    <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--warm-white)]">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--charcoal)]">Notifications</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--parchment)] text-[var(--brown)]">{totalNotifications} New</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {lowStockProducts.length > 0 && (
                        <div 
                          className="p-4 border-b border-[var(--border)] hover:bg-[var(--warm-white)] cursor-pointer transition-colors"
                          onClick={() => { setActiveTab('inventory'); setIsNotificationsOpen(false); }}
                        >
                          <p className="text-[12px] font-bold text-red-600 mb-1">Low Stock Alert</p>
                          <p className="text-[11px] text-gray-500 leading-snug">{lowStockProducts.length} items have fallen below their minimum stock threshold.</p>
                        </div>
                      )}
                      {pendingOrders.length > 0 && (
                        <div 
                          className="p-4 border-b border-[var(--border)] hover:bg-[var(--warm-white)] cursor-pointer transition-colors"
                          onClick={() => { setActiveTab('orders'); setIsNotificationsOpen(false); }}
                        >
                          <p className="text-[12px] font-bold text-[var(--brown)] mb-1">Pending Orders</p>
                          <p className="text-[11px] text-gray-500 leading-snug">There are {pendingOrders.length} orders waiting to be processed.</p>
                        </div>
                      )}
                      {totalNotifications === 0 && (
                        <div className="p-6 text-center text-gray-400 text-[11px]">
                          You're all caught up!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Help Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => { setIsHelpOpen(!isHelpOpen); setIsNotificationsOpen(false); }}
                  className={`transition-colors ${isHelpOpen ? 'text-[var(--brown)]' : 'text-gray-500 hover:text-[var(--brown)]'}`} 
                  title="Help & Support"
                >
                  <HelpCircle className="w-[18px] h-[18px]" />
                </button>

                {isHelpOpen && (
                  <div className="absolute top-full right-0 mt-6 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[var(--border)] overflow-hidden z-50 animate-cascade">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--warm-white)]">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--charcoal)]">Support Center</h3>
                    </div>
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2.5 text-[12px] text-gray-600 hover:bg-[var(--warm-white)] hover:text-[var(--brown)] transition-colors">Contact Support</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-5 w-px bg-[var(--border)] hidden sm:block"></div>
              <span className="hidden sm:block text-[15px] tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>
                The Find Thrift Shop
              </span>
            </div>
          </header>
        )}

        <main className={`relative z-10 min-h-full ${user.role === 'admin' ? 'px-5 py-7 md:px-10 md:py-10 max-w-[1500px]' : 'px-4 py-8 md:px-8 md:py-12 max-w-7xl'} mx-auto`}>
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

      {/* Welcome Transition Screen */}
      {showWelcome && (
        <div className={`fixed inset-0 bg-[var(--cream)] flex flex-col items-center justify-center z-[9999] transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-20 h-20 bg-[var(--charcoal)] rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] animate-pulse">
            <Shirt className="w-10 h-10 text-[var(--cream)]" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>
            THE FIND
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--sienna)] animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--sienna)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--sienna)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase mt-4">
            {user.role === 'admin' ? 'Initializing Workspace...' : 'Preparing Your Boutique...'}
          </p>
        </div>
      )}

      {/* Sign Out Transition Screen */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-[var(--charcoal)] flex flex-col items-center justify-center z-[9999] animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-[var(--cream)] rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <LogOut className="w-10 h-10 text-[var(--charcoal)] ml-1" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cream)' }}>
            THE FIND
          </h2>
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mt-4">
            Signing Out...
          </p>
        </div>
      )}
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
