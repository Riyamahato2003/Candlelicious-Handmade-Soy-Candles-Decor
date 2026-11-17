import React from 'react';
import { Link } from 'react-router-dom';

export const BoutiqueFooter: React.FC = () => {
  return (
    <footer className="bg-[#241612] text-[#FAF6F0] border-t border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[#FAF6F0]/10">
          <div className="md:col-span-5 space-y-4">
            <p className="font-serif text-3xl tracking-tight text-[#FAF6F0]">
              Candlelicious
            </p>
            <p className="text-sm text-[#FAF6F0]/75 max-w-sm leading-relaxed">
              Amman&apos;s contemporary soy candle and home decor atelier by Lana. Sculptural
              floral candle bouquets, carved wood dough bowls, ceramic vessels, and bespoke
              celebration favours.
            </p>
            <div className="pt-2 text-xs text-[#C5A059] space-y-1">
              <p>Amman, Jordan · 100% Natural Soy Wax</p>
              <p>Amman Studio Pickup &amp; Courier Across Jordan Available</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="font-sans text-xs tracking-widest uppercase text-[#C5A059]">
              Atelier
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF6F0]/80">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-white transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Gift Bag
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-sans text-xs tracking-widest uppercase text-[#C5A059]">
              Craft &amp; Care
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF6F0]/80">
              <li>
                <Link to="/story" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-white transition-colors">
                  Delivery &amp; Pickup
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact &amp; FAQ
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-white transition-colors">
                  Order Request
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="font-sans text-xs tracking-widest uppercase text-[#C5A059]">
              Connect
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF6F0]/80">
              <li>
                <a
                  href="https://www.instagram.com/candlelicious.lana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram @candlelicious.lana
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-[#FAF6F0]/55">
                  Atelier Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#FAF6F0]/55">
          <p>© {new Date().getFullYear()} Candlelicious · Amman, Jordan</p>
          <p>
            Indicative JOD prices shown · Sample order requests only (no live payment captured)
          </p>
        </div>
      </div>
    </footer>
  );
};
