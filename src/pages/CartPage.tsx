import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MediaFrame } from '../components/MediaFrame';
import { CUSTOM_TOPPER_FEE, PERSONALISED_MESSAGE_FEE } from '../types/shop';

export const CartPage: React.FC = () => {
  const { bag, bagKnownSubtotal, catalogue, updateBagQuantity, removeFromBag, clearBag } =
    useShop();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#1C110E]/10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">Review Selection</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C110E] mt-1">
            Your Gift Bag
          </h1>
        </div>
        {bag.length > 0 && (
          <button
            type="button"
            onClick={clearBag}
            className="text-xs text-[#6E5A54] underline underline-offset-4 hover:text-[#8B1E3F] self-start sm:self-auto"
          >
            Clear Bag
          </button>
        )}
      </div>

      {bag.length === 0 ? (
        <div className="py-20 text-center space-y-5">
          <p className="font-serif text-2xl text-[#1C110E]">No creations in your bag yet</p>
          <p className="text-sm text-[#6E5A54] max-w-md mx-auto">
            Browse our {catalogue.length} signature sculptural soy candle creations or explore our
            behind-the-scenes studio films.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/shop"
              className="px-6 py-3.5 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors"
            >
              Shop All Creations
            </Link>
            <Link
              to="/videos"
              className="px-6 py-3.5 text-xs uppercase tracking-widest border border-[#1C110E]/25 text-[#1C110E] hover:border-[#8B1E3F] hover:text-[#8B1E3F] transition-colors"
            >
              Watch Atelier Videos
            </Link>
          </div>
        </div>
      ) : (
        <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 divide-y divide-[#1C110E]/10">
            {bag.map((item) => (
              <div key={item.id} className="py-6 flex gap-5">
                <div className="w-24 h-28 shrink-0 bg-[#F3ECE2] border border-[#1C110E]/10 overflow-hidden">
                  <MediaFrame
                    type={item.imageSrc.endsWith('.mp4') ? 'video' : 'image'}
                    src={item.imageSrc}
                    alt={item.productName}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-serif text-xl text-[#1C110E] hover:text-[#8B1E3F]"
                    >
                      {item.productName}
                    </Link>
                    <span className="font-serif text-lg tabular-nums text-[#1C110E]">
                      {(item.unitTotal * item.quantity).toFixed(2)} JOD
                    </span>
                  </div>

                  <div className="mt-1.5 text-xs text-[#6E5A54] space-y-0.5">
                    {item.variantLabel && <p>{item.variantLabel}</p>}
                    {item.colourChoice && <p>Palette: {item.colourChoice}</p>}
                    {item.skirtWrapping && <p>Signature tote &amp; ribbon wrap requested</p>}
                    <p>Occasion: {item.occasion}</p>
                    {item.personalisedMessage && (
                      <p className="text-[#8B1E3F]">
                        Calligraphy Message Card (+{PERSONALISED_MESSAGE_FEE} JOD):{' '}
                        {item.personalisedMessageText || 'Included'}
                      </p>
                    )}
                    {item.customTopper && (
                      <p className="text-[#8B1E3F]">
                        Brass Holder &amp; Event Tag (+{CUSTOM_TOPPER_FEE} JOD):{' '}
                        {item.customTopperText || 'Included'}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center border border-[#1C110E]/20">
                      <button
                        type="button"
                        onClick={() => updateBagQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-10 h-10 inline-flex items-center justify-center hover:bg-[#F3ECE2]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-sm tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateBagQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-10 h-10 inline-flex items-center justify-center hover:bg-[#F3ECE2]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromBag(item.id)}
                      className="text-xs text-[#6E5A54] hover:text-[#8B1E3F] inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="p-6 bg-[#F3ECE2] border border-[#1C110E]/10 space-y-5">
              <h2 className="font-serif text-2xl text-[#1C110E]">Request Summary</h2>
              <div className="flex items-baseline justify-between pt-2 border-t border-[#1C110E]/10">
                <span className="text-sm text-[#6E5A54]">Known Indicative Subtotal</span>
                <span className="font-serif text-2xl text-[#1C110E] tabular-nums">
                  {bagKnownSubtotal.toFixed(2)} JOD
                </span>
              </div>
              <p className="text-xs text-[#6E5A54] leading-relaxed">
                Amman courier fees, studio pickup windows, and any bespoke fragrance or floral
                styling adjustments are confirmed after submitting your request.
              </p>
              <Link
                to="/checkout"
                className="block w-full py-4 text-center text-xs uppercase tracking-[0.18em] bg-[#8B1E3F] text-[#FAF6F0] hover:bg-[#241612] transition-colors"
              >
                Proceed to Order Request
              </Link>
              <Link
                to="/shop"
                className="block w-full py-3 text-center text-xs uppercase tracking-[0.18em] border border-[#1C110E]/20 text-[#1C110E] hover:border-[#8B1E3F] transition-colors"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
