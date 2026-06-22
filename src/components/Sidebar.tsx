import React, { useState } from 'react';
import { ShoppingCart, LayoutDashboard, Package, Store, LogOut, Users, Activity, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout } = useAppContext();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'pos', label: 'POS Cashier', icon: Store },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Online Orders', icon: ShoppingCart },
    { id: 'sales-report', label: 'Sales Report', icon: Activity },
    { id: 'users', label: 'Manage Staff', icon: Users },
  ];

  const handleTabSelect = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[4px_0_24px_rgba(0,0,0,0.05)]`}
        style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Brand */}
        <div className="px-8 pt-10 pb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight mb-1 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Find
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
              Retail Management
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden transition-colors text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map(({ id, label, icon: Icon }, index) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`${id}-tab`}
                onClick={() => handleTabSelect(id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[13px] font-semibold transition-all duration-300 group animate-cascade ${
                  isActive 
                    ? 'bg-[var(--sidebar-active-bg)] border border-[var(--sidebar-active-border)] shadow-sm' 
                    : 'hover:bg-white/10 border border-transparent'
                }`}
                style={{
                  animationDelay: `${index * 40}ms`,
                  color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-inactive-text)'
                }}
              >
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-all ${isActive ? 'text-[var(--sidebar-text-active)] scale-110' : 'text-white/60 group-hover:text-white'}`} style={{ width: 18, height: 18 }} />
                <span className={!isActive ? "opacity-80 group-hover:opacity-100 transition-opacity" : ""}>{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--sidebar-text-active)] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Footer */}
        {user && (
          <div className="p-5 mt-auto">
            <div className="bg-white/15 rounded-2xl p-4 border border-white/20 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative bg-white/30 border border-white/30 text-white shadow-inner">
                  <span className="text-[13px] font-bold uppercase">{user.username.charAt(0)}</span>
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[13px] font-bold truncate tracking-tight text-white">{user.username}</span>
                  <span className="text-[9px] font-medium tracking-[0.1em] mt-0.5 text-white/80">
                    {user.role === 'admin' ? 'Store Manager' : 'Shopper'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSignOutModal(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[var(--brown)] bg-white/80 hover:bg-white transition-all border border-transparent rounded-xl shadow-sm"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-[var(--brown)]" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--cream)] border border-[var(--border)] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] max-w-sm w-full p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>Sign Out</h3>
            <p className="text-[13px] text-gray-600 mb-8 leading-relaxed">Are you sure you want to securely sign out of your account?</p>
            
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowSignOutModal(false)}
                className="px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:bg-[var(--warm-white)] border border-transparent hover:border-[var(--border)] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowSignOutModal(false);
                  logout();
                }}
                className="px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[var(--brown)] text-[var(--cream)] shadow-md hover:scale-105 transition-transform"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
