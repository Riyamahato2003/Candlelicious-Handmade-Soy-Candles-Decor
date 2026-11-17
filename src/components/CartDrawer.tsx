import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MediaFrame } from './MediaFrame';
import { CUSTOM_TOPPER_FEE, PERSONALISED_MESSAGE_FEE } from '../types/shop';

export const CartDrawer: React.FC = () => {
  const {
    bag,
    bagCount,
    bagKnownSubtotal,
    isBagOpen,
    setIsBagOpen,
    updateBagQuantity,
    removeFromBag,
  } = useShop();

  if (!isBagOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1C110E]/45 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Gift Bag"
    >
      <div
        className="absolute inset-0"
        onClick={() => setIsBagOpen(false)}
        aria-hidden="true"
      />
      <aside className="relative z-10 w-full max-w-md bg-[#FAF6F0] text-[#1C110E] h-full flex flex-col border-l border-[#1C110E]/15 shadow-2xl">
        <div className="px-6 py-5 border-b border-[#1C110E]/10 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-[#1C110E]">Your Gift Bag</h2>
            <p className="text-xs text-[#6E5A54] mt-0.5 tabular-nums">
              {bagCount} {bagCount === 1 ? 'creation' : 'creations'} selected
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsBagOpen(false)}
            aria-label="Close gift bag"
            className="w-11 h-11 inline-flex items-center justify-center text-[#1C110E] hover:text-[#8B1E3F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {bag.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <p className="font-serif text-xl text-[#1C110E]">Your gift bag is empty</p>
              <p className="text-sm text-[#6E5A54] max-w-xs mx-auto leading-relaxed">
                Explore our handcrafted sculptural soy candles and floral vessels or watch our
                Amman studio pouring and wrapping reels.
              </p>
              <div className="pt-2 flex flex-col gap-3 max-w-xs mx-auto">
                <Link
                  to="/shop"
                  onClick={() => setIsBagOpen(false)}
                  className="px-5 py-3 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors text-center"
                >
                  Explore Catalogue
                </Link>
                <Link
                  to="/videos"
                  onClick={() => setIsBagOpen(false)}
                  className="px-5 py-3 text-xs uppercase tracking-widest border border-[#1C110E]/20 text-[#1C110E] hover:border-[#8B1E3F] hover:text-[#8B1E3F] transition-colors text-center"
                >
                  Watch Atelier Videos
                </Link>
              </div>
            </div>
          ) : (
            bag.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-6 border-b border-[#1C110E]/10 last:border-b-0"
              >
                <div className="w-20 h-24 shrink-0 bg-[#F3ECE2] overflow-hidden border border-[#1C110E]/10">
                  <MediaFrame
                    type={item.imageSrc.endsWith('.mp4') ? 'video' : 'image'}
                    src={item.imageSrc}
                    alt={item.productName}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setIsBagOpen(false)}
                      className="font-serif text-base text-[#1C110E] hover:text-[#8B1E3F] transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <span className="text-sm font-medium tabular-nums shrink-0">
                      {(item.unitTotal * item.quantity).toFixed(2)} JOD
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-[#6E5A54] space-y-0.5">
                    {item.variantLabel && <p>{item.variantLabel}</p>}
                    {item.colourChoice && <p>Palette: {item.colourChoice}</p>}
                    {item.skirtWrapping && <p>Signature Tote &amp; Satin Wrap</p>}
                    <p>Occasion: {item.occasion}</p>
                    {item.personalisedMessage && (
                      <p className="text-[#8B1E3F]">
                        + Calligraphy Card (+{PERSONALISED_MESSAGE_FEE} JOD)
                        {item.personalisedMessageText
                          ? `: “${item.personalisedMessageText}”`
                          : ''}
                      </p>
                    )}
                    {item.customTopper && (
                      <p className="text-[#8B1E3F]">
                        + Custom Brass/Acrylic Tag (+{CUSTOM_TOPPER_FEE} JOD)
                        {item.customTopperText ? `: “${item.customTopperText}”` : ''}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-[#1C110E]/20">
                      <button
                        type="button"
                        onClick={() => updateBagQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-9 h-9 inline-flex items-center justify-center hover:bg-[#F3ECE2] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs tabular-nums font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateBagQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-9 h-9 inline-flex items-center justify-center hover:bg-[#F3ECE2] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromBag(item.id)}
                      aria-label={`Remove ${item.productName}`}
                      className="text-xs text-[#6E5A54] hover:text-[#8B1E3F] inline-flex items-center gap-1 py-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {bag.length > 0 && (
          <div className="p-6 bg-[#F3ECE2] border-t border-[#1C110E]/10 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-[#6E5A54]">Known Indicative Subtotal</span>
                <span className="font-serif text-2xl text-[#1C110E] tabular-nums">
                  {bagKnownSubtotal.toFixed(2)} JOD
                </span>
              </div>
              <p className="text-xs text-[#6E5A54] leading-relaxed">
                Amman courier fees and any custom fragrance or vessel notes are confirmed
                upon request review. No online payment is charged.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={() => setIsBagOpen(false)}
                className="px-4 py-3 text-xs uppercase tracking-widest border border-[#1C110E]/25 text-[#1C110E] hover:border-[#8B1E3F] hover:text-[#8B1E3F] transition-colors text-center"
              >
                View Bag
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsBagOpen(false)}
                className="px-4 py-3 text-xs uppercase tracking-widest bg-[#8B1E3F] text-[#FAF6F0] hover:bg-[#241612] transition-colors text-center"
              >
                Order Request
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
