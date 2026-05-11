import React from 'react';
import { ShoppingCart, ClipboardList, Shirt, LogOut, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface ClientNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu?: () => void;
}

export const ClientNavbar: React.FC<ClientNavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout, clientCart } = useAppContext();

  const cartCount = clientCart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'shop', label: 'Shop', icon: Shirt },
    { id: 'cart', label: 'My Cart', icon: ShoppingCart },
    { id: 'my-orders', label: 'My Orders', icon: ClipboardList },
  ];

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 -ml-2 text-gray-500">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Section */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveTab('shop')}
          >
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center transition-transform group-hover:scale-105">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>THE FIND</span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-gray-400 uppercase">Est. 2024</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-bold uppercase tracking-widest transition-all relative py-2 flex items-center gap-2 ${
                  activeTab === item.id ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-left-1" />
                )}
              </button>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* User Profile / Logout */}
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Welcome</span>
                <span className="text-xs font-bold text-black truncate max-w-[80px]">{user?.username}</span>
              </div>

              <button 
                onClick={() => setActiveTab('cart')}
                className={`p-2.5 rounded-full transition-all relative ${
                  activeTab === 'cart' ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <button 
                onClick={logout}
                className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};
