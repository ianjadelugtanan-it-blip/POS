import React, { useState, useEffect, useRef } from 'react';
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
import { Menu, Shirt, Search, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { SkeletonDashboard, SkeletonProductCard, SkeletonTableRow, SkeletonOrderCard, SkeletonUserCard } from './components/ui/Skeleton';
import { useTheme } from './hooks/useTheme';

const MainApp: React.FC = () => {
  const { user, products, orders, isLoggingOut } = useAppContext();
  const { theme, toggleTheme } = useTheme(user !== null, isLoggingOut);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  // loadingTab and isTabLoading are derived here; real loading only occurs on initial app load
  const loadingTab = activeTab;
  const isTabLoading = false;

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    // Switch instantly — data is already in memory from the initial fetch.
    // Skeleton loaders only show during the real API load on app start.
    setActiveTab(tab);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [isCheckout, setIsCheckout] = useState(false);
  const [checkoutItemIds, setCheckoutItemIds] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Welcome screen animation states
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [prevUser, setPrevUser] = useState(user);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isNotificationsOpen]);

  // Intercept the very first frame of login to prevent UI flash
  if (user && !prevUser) {
    setPrevUser(user);
    setActiveTab(user.role === 'admin' ? 'dashboard' : 'shop');
    setShowWelcome(true);
    setIsFadingOut(false);
  } else if (!user && prevUser) {
    setPrevUser(user);
  }

  useEffect(() => {
    if (showWelcome && !isFadingOut) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        const removeTimer = setTimeout(() => setShowWelcome(false), 600); // Wait for fade out
        return () => clearTimeout(removeTimer);
      }, 1500); // Show splash for 1.5 seconds
      
      return () => clearTimeout(fadeTimer);
    }
  }, [showWelcome, isFadingOut]);

  const lowStockProducts = products ? products.filter(p => p.stock < 5 && p.stock > 0) : [];
  const pendingOrders = orders ? orders.filter(o => o.status === 'pending' || o.status === 'processing') : [];
  
  let totalNotifications = 0;
  if (lowStockProducts.length > 0) totalNotifications += 1;
  if (pendingOrders.length > 0) totalNotifications += 1;

  if (!user) return <Login />;

  if (user.role === 'client' && !['shop', 'cart', 'my-orders'].includes(activeTab)) {
    setActiveTab('shop');
  }
  if (user.role === 'admin' && ['shop', 'cart', 'my-orders'].includes(activeTab)) {
    setActiveTab('dashboard');
  }

  const handleCheckoutComplete = () => {
    setIsCheckout(false);
    handleTabChange('my-orders');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${user.role === 'client' ? 'flex-col' : ''}`} style={{ backgroundColor: 'var(--cream)' }}>
      {user.role === 'admin' ? (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      ) : (
        <ClientNavbar 
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
      )}

      <div className="flex-1 overflow-y-auto relative" ref={scrollContainerRef}>
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
                className="w-full bg-white border border-[var(--border)] rounded-full pl-11 pr-4 py-2.5 text-[13px] outline-none focus:border-[var(--sienna)] focus:ring-4 focus:ring-[var(--sienna)]/10 transition-all shadow-sm placeholder:text-gray-400"
              />
            </div>
            
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg transition-colors text-[var(--text-muted)]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 ml-auto">
              
              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`relative p-2 rounded-full transition-all ${isNotificationsOpen ? 'text-[var(--brown)] bg-gray-200/50' : 'text-gray-500 hover:text-[var(--brown)] hover:bg-gray-200/50'}`} 
                  title="Notifications"
                >
                  <Bell className="w-[22px] h-[22px]" />
                  {totalNotifications > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[var(--cream)] shadow-sm leading-none">
                      {totalNotifications}
                    </span>
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

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all active:scale-95 ${theme === 'dark' ? 'text-white/80 bg-white/10 hover:bg-white/20' : 'text-gray-700 bg-white/90 hover:bg-gray-100'}`}
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'light' && <Sun className="w-[22px] h-[22px] text-amber-500" />}
                {theme === 'dark' && <Moon className="w-[22px] h-[22px] text-indigo-400" />}
              </button>

              <span className="hidden sm:block text-[15px] tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>
                The Find Thrift Shop
              </span>
            </div>
          </header>
        )}

        <main className={`relative z-10 min-h-full ${user.role === 'admin' ? 'px-5 py-7 md:px-10 md:py-10 max-w-[1500px]' : 'px-4 py-8 md:px-8 md:py-12 max-w-7xl'} mx-auto`}>
          {user.role === 'admin' ? (
            isTabLoading ? (
              <div className="animate-in fade-in duration-300">
                {loadingTab === 'dashboard' && <SkeletonDashboard />}
                {loadingTab === 'pos' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <SkeletonProductCard key={i} variant="pos" />)}
                  </div>
                )}
                {loadingTab === 'inventory' && (
                  <div className="space-y-4">
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
                      {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
                    </div>
                  </div>
                )}
                {loadingTab === 'orders' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => <SkeletonOrderCard key={i} isAdmin={true} />)}
                  </div>
                )}
                {loadingTab === 'sales-report' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 rounded-xl border border-[var(--border)] bg-white h-32 skeleton-shimmer" />
                      ))}
                    </div>
                    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
                      {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
                    </div>
                  </div>
                )}
                {loadingTab === 'users' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <SkeletonUserCard key={i} />)}
                  </div>
                )}
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard onNavigate={handleTabChange} />}
                {activeTab === 'pos' && <POSCashier />}
                {activeTab === 'inventory' && <Inventory />}
                {activeTab === 'orders' && <OrderManagement />}
                {activeTab === 'sales-report' && <SalesReport />}
                {activeTab === 'users' && <AdminUsersManagement />}
              </>
            )
          ) : (
            isTabLoading ? (
              <div className="animate-in fade-in duration-300">
                {loadingTab === 'shop' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => <SkeletonProductCard key={i} variant="shop" />)}
                  </div>
                )}
                {loadingTab === 'cart' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-white">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg skeleton-shimmer flex-shrink-0" />
                          <div className="flex-1 space-y-2 pt-2">
                            <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                            <div className="h-3 w-1/4 bg-gray-100 rounded animate-pulse" />
                            <div className="h-5 w-16 bg-gray-100 rounded animate-pulse mt-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 rounded-xl border border-[var(--border)] bg-white h-64 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="h-5 w-1/3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-px bg-[var(--border)]" />
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                      </div>
                      <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                )}
                {loadingTab === 'my-orders' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => <SkeletonOrderCard key={i} isAdmin={false} />)}
                  </div>
                )}
              </div>
            ) : (
              <>
                {activeTab === 'shop' && <Shop />}
                {activeTab === 'cart' && (
                  isCheckout ? (
                    <Checkout 
                      selectedItemIds={checkoutItemIds}
                      onBackToCart={() => setIsCheckout(false)} 
                      onOrderComplete={handleCheckoutComplete} 
                    />
                  ) : (
                    <Cart onProceedToCheckout={(selectedIds) => {
                      setCheckoutItemIds(selectedIds);
                      setIsCheckout(true);
                    }} />
                  )
                )}
                {activeTab === 'my-orders' && <MyOrders />}
              </>
            )
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
