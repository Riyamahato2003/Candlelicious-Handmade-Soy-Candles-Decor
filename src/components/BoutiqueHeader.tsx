import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const BoutiqueHeader: React.FC = () => {
  const { bagCount, setIsBagOpen } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide transition-colors duration-200 whitespace-nowrap shrink-0 pb-0.5 border-b ${
      isActive
        ? 'text-[#8B1E3F] border-[#8B1E3F] font-medium'
        : 'text-[#1C110E]/80 border-transparent hover:text-[#1C110E] hover:border-[#C5A059]'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/55 supports-[backdrop-filter]:bg-[#FAF6F0]/45 backdrop-blur-xl backdrop-saturate-150 border-b border-[#1C110E]/12 shadow-[0_4px_30px_rgba(28,17,14,0.05)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="font-serif text-xl sm:text-2xl tracking-tight text-[#1C110E] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E3F]"
          >
            Candlelicious
          </Link>

          {/* Zone 2: 5 Concise Single-Line Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7"
          >
            <NavLink to="/shop" className={navLinkClass}>
              Shop All
            </NavLink>
            <NavLink to="/collections" className={navLinkClass}>
              Collections
            </NavLink>
            <NavLink to="/videos" className={navLinkClass}>
              Videos
            </NavLink>
            <NavLink to="/story" className={navLinkClass}>
              Our Story
            </NavLink>
            <NavLink to="/delivery" className={navLinkClass}>
              Delivery
            </NavLink>
          </nav>

          {/* Zone 3: Single Primary Bag Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              aria-label={`Open gift bag with ${bagCount} items`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors duration-200 whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E3F]"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums">Bag ({bagCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#1C110E] hover:text-[#8B1E3F] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-[#241612]/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FAF6F0]/90 backdrop-blur-xl p-6 flex flex-col justify-between shadow-2xl border-l border-[#1C110E]/10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#1C110E]/10">
                <span className="font-serif text-xl text-[#1C110E]">Candlelicious</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-11 h-11 inline-flex items-center justify-center text-[#1C110E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-5 pt-8">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/shop', label: 'Shop All' },
                  { to: '/collections', label: 'Collections' },
                  { to: '/videos', label: 'Videos' },
                  { to: '/story', label: 'Our Story' },
                  { to: '/delivery', label: 'Delivery & Pickup' },
                  { to: '/contact', label: 'Contact & FAQ' },
                  { to: '/cart', label: 'Gift Bag' },
                  { to: '/admin', label: 'Private Admin' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-2xl text-[#1C110E] hover:text-[#8B1E3F] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="pt-6 border-t border-[#1C110E]/10 text-xs text-[#6E5A54] space-y-1">
              <p>Amman, Jordan · 100% Natural Soy Wax</p>
              <p>Contemporary Home Decor &amp; Floral Candles</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
