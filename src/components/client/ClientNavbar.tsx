import React, { useState } from 'react';
import { ShoppingCart, ClipboardList, Shirt, LogOut, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface ClientNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu?: () => void;
}

export const ClientNavbar: React.FC<ClientNavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout, clientCart } = useAppContext();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const cartCount = clientCart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'shop', label: 'Shop', icon: Shirt },
    { id: 'my-orders', label: 'My Orders', icon: ClipboardList },
  ];

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full border-b border-white/10 shadow-sm" style={{ background: 'linear-gradient(90deg, var(--brown) 0%, #9C5D22 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 -ml-2 text-white/80 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Section */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveTab('shop')}
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform group-hover:scale-105">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none text-white" style={{ fontFamily: "'Playfair Display', serif" }}>THE FIND</span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-white/60 uppercase">Est. 2024</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-bold uppercase tracking-widest transition-all relative py-2 flex items-center gap-2 ${
                  activeTab === item.id ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white animate-in fade-in slide-in-from-left-1" />
                )}
              </button>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* User Profile / Logout */}
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">Welcome</span>
                <span className="text-xs font-bold text-white truncate max-w-[80px]">{user?.username}</span>
              </div>

              <button 
                onClick={() => setActiveTab('cart')}
                className={`p-2.5 rounded-full transition-all relative ${
                  activeTab === 'cart' ? 'bg-white/20 text-white shadow-lg' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white/20">
                    {cartCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setShowSignOutModal(true)}
                className="p-2.5 rounded-full bg-white/10 text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
      </nav>

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
