import React, { useState } from 'react';
import { Shirt, Sparkles, ShieldCheck, Truck, ArrowRight, User, Loader2, MapPin, Mail, ShoppingBag, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface HomeProps {
  onNavigate: (tab: string) => void;
  isGuest?: boolean;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, isGuest = false }) => {
  const { products } = useAppContext();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showGuestCart, setShowGuestCart] = useState(false);

  const handleNavigate = (tab: string) => {
    setIsNavigating(true);
    setNavTarget(tab);
    onNavigate(tab);
    // Note: We don't need a timeout here anymore because we're using React.lazy
    // on the Login component to simulate the actual network delay via Suspense.
  };

  // Get first 3 products with images to display as spotlight
  const spotlightProducts = products
    .filter(p => p.stock > 0 && p.imageUrl)
    .slice(0, 3);

  const content = (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--brown)] to-[var(--sienna)] text-white p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <div className="flex-1 space-y-6 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-[var(--parchment)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Est. 2026 • Curated Thrift Boutique
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Discover Your <span className="text-[var(--parchment)]">Perfect Style</span>
          </h1>
          <p className="text-sm md:text-lg text-white/80 max-w-xl font-medium leading-relaxed">
            Welcome to The Find. We handpick the best secondhand clothes and unique items, so you can look amazing and care for the earth at the same time.
          </p>
          {!isGuest && (
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => handleNavigate('shop')}
                disabled={isNavigating}
                className="w-full sm:w-auto px-8 py-4 bg-white text-[var(--brown)] hover:bg-[var(--cream)] rounded-full font-bold uppercase tracking-wider text-xs shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isNavigating && navTarget === 'shop' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                ) : (
                  <>Shop Collection <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
              <button
                onClick={() => handleNavigate('my-orders')}
                disabled={isNavigating}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 rounded-full font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isNavigating && navTarget === 'my-orders' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                ) : (
                  'Track Orders'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Hero Decorative Side */}
        <div className="flex-1 w-full max-w-sm md:max-w-md relative flex items-center justify-center">
          {spotlightProducts.length > 0 ? (
            <div
              className={`relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl animate-tag-swing border border-white/20 group ${isNavigating ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => {
                if (isNavigating) return;
                if (isGuest) {
                  setShowLoginPrompt(true);
                } else {
                  handleNavigate('shop');
                }
              }}
            >
              <img src={spotlightProducts[0].imageUrl} alt={spotlightProducts[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono tracking-widest uppercase">Featured</span>
                  <span className="px-3 py-1 rounded bg-[var(--sienna)] text-white text-[10px] font-mono tracking-widest uppercase">{spotlightProducts[0].category}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1">{spotlightProducts[0].name}</h3>
                  <div className="pt-2 flex items-center justify-between border-t border-white/20 mt-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-white/80 flex items-center gap-1">
                      {isGuest ? 'Sign In to Buy' : 'View Details'} <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="font-mono text-sm font-bold text-[var(--parchment)]">₱{spotlightProducts[0].price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm p-6 flex flex-col justify-between shadow-2xl animate-tag-swing">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded bg-[var(--sienna)] text-white text-[10px] font-mono tracking-widest uppercase">Vintage</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight font-serif text-white">Handpicked Comfort</h3>
                <p className="text-xs text-white/70">Every item is cleaned, inspected, and curated with vintage authenticity in mind.</p>
                <div className="pt-2 flex items-center justify-between border-t border-white/10 mt-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/60">Starting At</span>
                  <span className="font-mono text-sm font-bold text-[var(--parchment)]">₱199.00</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-8 flex flex-col items-center text-center space-y-4 border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Curated Vintage</h3>
          <p className="text-xs text-gray-500 leading-relaxed">We carefully hand-select each garment ensuring perfect quality, distinct character, and lasting style.</p>
        </div>
        <div className="card p-8 flex flex-col items-center text-center space-y-4 border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Sustainable Fashion</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Buying secondhand extends garment lifecycles and significantly reduces textile waste on the planet.</p>
        </div>
        <div className="card p-8 flex flex-col items-center text-center space-y-4 border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Careful Delivery</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Your orders are packed securely in reusable paper packaging and dispatched to you in no time.</p>
        </div>
      </section>

      {/* Spotlight / Curated Products */}
      {spotlightProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Spotlight Finds</h2>
              <p className="text-xs text-gray-500 mt-1">Unique pre-loved gems selected for this week.</p>
            </div>
            <button
              onClick={() => handleNavigate('shop')}
              disabled={isNavigating}
              className="text-xs font-bold uppercase tracking-widest text-[var(--sienna)] hover:text-[var(--sienna-dark)] transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isNavigating && navTarget === 'shop' ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...</>
              ) : (
                <>{isGuest ? 'Sign In to Shop All' : 'See All Items'} <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {spotlightProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  if (isNavigating) return;
                  if (isGuest) {
                    setShowLoginPrompt(true);
                  } else {
                    handleNavigate('shop');
                  }
                }}
                className={`card group overflow-hidden border border-gray-100 flex flex-col ${isNavigating ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="price-tag">₱{product.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="category-pill mb-2">{product.category}</span>
                    <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center mt-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Stock: {product.stock} units</span>
                    <span className="text-xs font-bold text-[var(--sienna)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isGuest ? 'Sign In' : 'View Details'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-[var(--cream)] rounded-full flex items-center justify-center mx-auto text-[var(--sienna)]">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Sign In Required
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    You need to be signed in to view product details and add items to your cart.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 flex gap-3">
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      handleNavigate('signin');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-[var(--brown)] hover:bg-[var(--sienna)] transition-colors"
                  >
                    Yes, Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Guest Cart Modal */}
          {showGuestCart && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <ShoppingBag className="w-4 h-4 text-[var(--sienna)]" /> Your Cart
                  </h3>
                  <button
                    onClick={() => setShowGuestCart(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-[var(--cream)] rounded-full flex items-center justify-center mx-auto text-[var(--sand)]">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Sign in to start adding unique thrift finds to your cart.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50">
                  <button
                    onClick={() => {
                      setShowGuestCart(false);
                      handleNavigate('signin');
                    }}
                    className="w-full px-4 py-3 rounded-xl font-bold text-sm text-white bg-[var(--brown)] hover:bg-[var(--sienna)] transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Sign In to Shop
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-gradient-to-tr from-[var(--warm-white)] to-[var(--cream)] rounded-3xl p-8 md:p-12 border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--sand)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>What Shoppers Say</h2>
          <p className="text-xs text-gray-500 mt-1">Our community loves their unique finds.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-white/60 backdrop-blur-sm border border-white">
            <p className="text-sm italic text-gray-600 leading-relaxed">
              "such store na inani do exist? hapit gud ma hurot ilang baligya kay mga chada kaayo."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: 'var(--sienna)' }}>M</div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Kenneth Palicte</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Verified Buyer</p>
              </div>
            </div>
          </div>
          <div className="card p-6 bg-white/60 backdrop-blur-sm border border-white">
            <p className="text-sm italic text-gray-600 leading-relaxed">
              "anime na mga sanina, barato ra pagyud? sheshhhh! kung naa palang koy daghan na kwarta, gi hurot na unta nakog palit tanan."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: '#7c6b52' }}>J</div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Justine Aranas</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Verified Buyer</p>
              </div>
            </div>
          </div>
          <div className="card p-6 bg-white/60 backdrop-blur-sm border border-white">
            <p className="text-sm italic text-gray-600 leading-relaxed">
              "chada kaayo ang mga sanina, barato og nindot para sa iyang presyo, will order again."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: '#a0785a' }}>A</div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Steven G. Ochigue</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // ── GUEST MODE: full standalone page with its own header ──
  if (isGuest) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
        {/* Dot texture */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(#C9B99A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Standalone Header */}
        <header className="sticky top-0 z-[100] w-full border-b border-white/10 shadow-sm backdrop-blur-md" style={{ background: 'var(--nav-bg)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter leading-none text-white" style={{ fontFamily: "'Playfair Display', serif" }}>THE FIND</span>
                  <span className="text-[9px] font-bold tracking-[0.3em] text-white/60 uppercase">Est. 2026</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sign In Button */}
                <button
                  onClick={() => handleNavigate('signin')}
                  disabled={isNavigating}
                  className="group relative flex items-center h-10 w-10 hover:w-[105px] rounded-full bg-white text-[var(--sienna)] hover:bg-[var(--cream)] hover:shadow-lg hover:-translate-y-0.5 border border-white/20 shadow-sm transition-all duration-300 ease-in-out active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute left-0 w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {isNavigating && navTarget === 'signin' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <User className="w-4 h-4 transition-transform group-hover:scale-110" />
                    )}
                  </div>
                  <span className="ml-9 font-bold uppercase tracking-wider text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
                    Sign In
                  </span>
                </button>

                {/* Cart Button */}
                <button
                  onClick={() => setShowGuestCart(true)}
                  className="group relative w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 shadow-sm transition-all duration-300 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative z-10 flex-1 px-4 py-8 md:px-8 md:py-12 max-w-7xl mx-auto w-full">
          {content}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-[var(--border)] py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
            {/* Brand + copyright */}
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--sienna)' }}>
                  <Shirt className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>The Find</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium tracking-wider">© 2026 The Find Thrift Shop. All rights reserved.</p>
            </div>
            {/* Contact */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" style={{ color: 'var(--sienna)' }} />
                Lagonglong, Misamis Oriental Philippines
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" style={{ color: 'var(--sienna)' }} />
                thefindthrift.com
              </span>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a href="#" aria-label="Facebook" className="w-7 h-7 rounded-full flex items-center justify-center border transition-all hover:scale-110" style={{ borderColor: 'var(--border-strong)', color: 'var(--sienna)', backgroundColor: 'var(--cream)' }}>
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-7 h-7 rounded-full flex items-center justify-center border transition-all hover:scale-110" style={{ borderColor: 'var(--border-strong)', color: 'var(--sienna)', backgroundColor: 'var(--cream)' }}>
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-7 h-7 rounded-full flex items-center justify-center border transition-all hover:scale-110" style={{ borderColor: 'var(--border-strong)', color: 'var(--sienna)', backgroundColor: 'var(--cream)' }}>
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ── LOGGED-IN MODE: embedded in the client layout ──
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
      {content}
    </div>
  );
};
