import React from 'react';
import { Shirt, Heart, Leaf, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { user } = useAppContext();
  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    return (
      <footer className="w-full mt-10 border-t relative z-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--parchment)' }}>
        <div className="max-w-[1500px] mx-auto px-5 py-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-xs font-semibold tracking-wide" style={{ color: 'var(--text-light)' }}>
            <p>© 2026 The Find Thrift Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full mt-20 border-t relative z-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--parchment)' }}>
      <div className="max-w-[1500px] mx-auto px-5 py-16 md:px-10">

        {/* Brand Values / Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b mb-12" style={{ borderColor: 'var(--border-strong)' }}>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--cream)', color: 'var(--sienna)' }}>
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--brown)' }}>Sustainably Sourced</h4>
            <p className="text-xs max-w-[220px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>Each piece is carefully selected to reduce environmental impact and promote circular fashion.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--cream)', color: 'var(--sienna)' }}>
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--brown)' }}>Curated with Love</h4>
            <p className="text-xs max-w-[220px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>We inspect, clean, and restore every item to ensure it is ready for its second life.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--cream)', color: 'var(--sienna)' }}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--brown)' }}>Premium Quality</h4>
            <p className="text-xs max-w-[220px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>High-quality materials and timeless vintage designs that outlast fast-fashion trends.</p>
          </div>
        </div>

        {/* Links & Brand */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-0 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--sienna)' }}>
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>
                The Find
              </span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              A modern approach to secondhand. Rediscover the joy of vintage and pre-loved boutique fashion.
            </p>
          </div>

          <div className="flex gap-16 md:gap-24">
            <div className="flex flex-col gap-3.5 text-sm">
              <span className="font-bold uppercase tracking-widest mb-2 text-xs" style={{ color: 'var(--brown)' }}>Shop</span>
              <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>New Arrivals</a>
              <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Best Sellers</a>
              <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Collections</a>
            </div>
            <div className="flex flex-col gap-3.5 text-sm">
              <span className="font-bold uppercase tracking-widest mb-2 text-xs" style={{ color: 'var(--brown)' }}>Support</span>
              <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>FAQ / Help</a>
              <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Shipping & Returns</a>
              <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Contact Us</a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-5 text-xs font-semibold tracking-wide" style={{ borderColor: 'var(--border-strong)', color: 'var(--text-light)' }}>
          <p>© 2026 The Find Thrift Shop. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
