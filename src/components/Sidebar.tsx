import React from 'react';
import { ShoppingCart, LayoutDashboard, Package, ClipboardList, Store, LogOut, Users, Activity, X, Shirt } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout } = useAppContext();

  const adminNavItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'pos', label: 'POS Cashier', icon: Store },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Online Orders', icon: ShoppingCart },
    { id: 'sales-report', label: 'Sales Report', icon: Activity },
    { id: 'users', label: 'Manage Staff', icon: Users },
  ];

  const clientNavItems = [
    { id: 'shop', label: 'Browse Items', icon: Shirt },
    { id: 'cart', label: 'My Cart', icon: ShoppingCart },
    { id: 'my-orders', label: 'My Orders', icon: ClipboardList },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : clientNavItems;

  const handleTabSelect = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(44,44,44,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[270px] flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#3B2A1E', borderRight: '1px solid #2C1F15' }}
      >
        {/* Brand */}
        <div className="px-6 py-7 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--sienna)' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#F2EAD8' }}>
                The Find
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(242,234,216,0.45)' }}>
                Thrift Shop
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden transition-colors"
            style={{ color: 'rgba(242,234,216,0.5)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] uppercase font-bold tracking-widest mb-3" style={{ color: 'rgba(242,234,216,0.35)' }}>
            {user?.role === 'admin' ? 'Staff Menu' : 'Shopper Menu'}
          </p>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(({ id, label, icon: Icon }, index) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleTabSelect(id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group animate-cascade"
                style={{
                  animationDelay: `${index * 40}ms`,
                  backgroundColor: isActive ? 'var(--sienna)' : 'transparent',
                  color: isActive ? '#FAF6EF' : 'rgba(242,234,216,0.65)',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(242,234,216,0.08)';
                    e.currentTarget.style.color = '#F2EAD8';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(242,234,216,0.65)';
                  }
                }}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
                <span>{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F2EAD8', opacity: 0.7 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* User Footer */}
        {user && (
          <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-3" style={{ backgroundColor: 'rgba(242,234,216,0.07)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase flex-shrink-0"
                style={{ backgroundColor: 'var(--sienna)', color: '#FAF6EF' }}>
                {user.username.charAt(0)}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm font-semibold truncate" style={{ color: '#F2EAD8' }}>{user.username}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(242,234,216,0.45)' }}>
                  {user.role === 'admin' ? 'Staff' : 'Shopper'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ color: '#F87171', backgroundColor: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};
