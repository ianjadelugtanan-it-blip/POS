import React from 'react';
import { Shirt, Heart, Leaf, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';
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

        {/* Links, Brand & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">

          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--sienna)' }}>
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>
                The Find
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              A modern thrift boutique curating quality pre-loved fashion. Look great, feel good, and help the planet.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:shadow-md" style={{ borderColor: 'var(--border-strong)', color: 'var(--sienna)', backgroundColor: 'var(--cream)' }}>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:shadow-md" style={{ borderColor: 'var(--border-strong)', color: 'var(--sienna)', backgroundColor: 'var(--cream)' }}>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" aria-label="Twitter / X" className="w-8 h-8 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:shadow-md" style={{ borderColor: 'var(--border-strong)', color: 'var(--sienna)', backgroundColor: 'var(--cream)' }}>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="flex flex-col gap-3.5 text-sm items-center md:items-start">
            <span className="font-bold uppercase tracking-widest mb-2 text-xs" style={{ color: 'var(--brown)' }}>Shop</span>
            <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>New Arrivals</a>
            <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Best Sellers</a>
            <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Collections</a>
            <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Size Guide</a>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-3.5 text-sm items-center md:items-start">
            <span className="font-bold uppercase tracking-widest mb-2 text-xs" style={{ color: 'var(--brown)' }}>Support</span>
            <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>FAQ / Help</a>
            <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Shipping & Returns</a>
            <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Order Tracking</a>
            <a href="#" className="hover:underline hover:text-gray-900 transition-all font-medium" style={{ color: 'var(--text-muted)' }}>Contact Us</a>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-4 text-sm items-center md:items-start">
            <span className="font-bold uppercase tracking-widest mb-2 text-xs" style={{ color: 'var(--brown)' }}>Contact Us</span>
            <div className="flex items-start gap-2.5" style={{ color: 'var(--text-muted)' }}>
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--sienna)' }} />
              <span className="leading-snug text-xs">Lagonglong, Misamis Oriental, Philippines</span>
            </div>
            <div className="flex items-center gap-2.5" style={{ color: 'var(--text-muted)' }}>
              <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--sienna)' }} />
              <a href="mailto:hello@thefindthrift.com" className="text-xs hover:underline transition-all">hello@thefindthrift.com</a>
            </div>
            <div className="flex items-center gap-2.5" style={{ color: 'var(--text-muted)' }}>
              <Phone className="w-4 h-4 shrink-0" style={{ color: 'var(--sienna)' }} />
              <span className="text-xs">09554806796</span>
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
