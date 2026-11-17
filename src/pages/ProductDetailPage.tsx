import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MediaFrame } from '../components/MediaFrame';
import {
  CUSTOM_TOPPER_FEE,
  OccasionName,
  PERSONALISED_MESSAGE_FEE,
} from '../types/shop';

const ALL_OCCASIONS: OccasionName[] = [
  'Birthdays',
  'Weddings',
  'Graduations',
  'Housewarming',
  'Romance',
  'Autumn & Seasonal',
  'Bespoke Events',
];

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { catalogue, addToBag } = useShop();
  const product = catalogue.find((p) => p.slug === slug);

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [skirtWrapping, setSkirtWrapping] = useState(false);
  const [occasion, setOccasion] = useState<OccasionName>('Birthdays');
  const [personalisedMessage, setPersonalisedMessage] = useState(false);
  const [personalisedMessageText, setPersonalisedMessageText] = useState('');
  const [customTopper, setCustomTopper] = useState(false);
  const [customTopperText, setCustomTopperText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setActiveMediaIdx(0);
    setSelectedVariantId(product.variants[0]?.id || '');
    setSelectedColour(product.colourOptions[0] || '');
    setSkirtWrapping(false);
    setOccasion(product.occasions[0] || 'Birthdays');
    setPersonalisedMessage(false);
    setPersonalisedMessageText('');
    setCustomTopper(false);
    setCustomTopperText('');
    setQuantity(1);
    setJustAdded(false);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-24 text-center space-y-5">
        <h1 className="font-serif text-4xl text-[#1C110E]">Creation Not Found</h1>
        <p className="text-sm text-[#6E5A54]">
          We couldn&apos;t locate that creation in our Amman atelier catalogue.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0]"
        >
          Return to Shop All
        </Link>
      </div>
    );
  }

  const activeMedia = product.media[activeMediaIdx] || product.media[0];
  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const baseUnitPrice = activeVariant ? activeVariant.price : product.basePrice;
  const personalisationUnitFee =
    (personalisedMessage ? PERSONALISED_MESSAGE_FEE : 0) +
    (customTopper ? CUSTOM_TOPPER_FEE : 0);
  const unitTotal = baseUnitPrice + personalisationUnitFee;

  const handleAddToBag = () => {
    if (!product.inStock) return;
    const pendingFlags: string[] = [];
    if (product.isFromPrice || product.isIndicativeRange) {
      pendingFlags.push(`Indicative pricing (${product.priceDisplay}) pending final review`);
    }
    if (skirtWrapping && product.skirtOptionAvailable) {
      pendingFlags.push('Signature frosted tote & satin ribbon wrap selected');
    }

    addToBag({
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: product.id,
      slug: product.slug,
      productName: product.name,
      imageSrc: product.media[0]?.src || '',
      variantId: activeVariant?.id,
      variantLabel: activeVariant?.label,
      colourChoice: selectedColour || undefined,
      skirtWrapping: skirtWrapping && product.skirtOptionAvailable,
      occasion,
      personalisedMessage,
      personalisedMessageText: personalisedMessage ? personalisedMessageText.trim() : '',
      customTopper,
      customTopperText: customTopper ? customTopperText.trim() : '',
      quantity,
      baseUnitPrice,
      personalisationUnitFee,
      unitTotal,
      pendingQuoteFlags: pendingFlags,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-16">
      <div className="mb-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#6E5A54] hover:text-[#8B1E3F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shop All</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Sticky Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <div className="aspect-[4/5] w-full overflow-hidden bg-[#F3ECE2] border border-[#1C110E]/10">
            <MediaFrame
              type={activeMedia?.type}
              src={activeMedia?.src || ''}
              alt={activeMedia?.alt || product.name}
            />
          </div>

          {activeMedia && (
            <div className="flex items-center justify-between gap-4 text-xs text-[#6E5A54]">
              <span>{activeMedia.caption}</span>
              <span className="shrink-0">
                {activeMedia.isAuthenticBrandWork
                  ? 'Candlelicious Original Work'
                  : 'Atelier Craft Preview'}
              </span>
            </div>
          )}

          {product.media.length > 1 && (
            <div className="grid grid-cols-4 gap-3 pt-2">
              {product.media.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaIdx(idx)}
                  className={`aspect-square overflow-hidden border transition-all ${
                    idx === activeMediaIdx
                      ? 'border-[#8B1E3F] ring-1 ring-[#8B1E3F]'
                      : 'border-[#1C110E]/15 opacity-75 hover:opacity-100'
                  }`}
                >
                  <MediaFrame type={m.type} src={m.src} alt={m.alt} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-7">
          <div className="space-y-3 pb-6 border-b border-[#1C110E]/10">
            <div className="flex items-center gap-2 text-xs text-[#6E5A54]">
              <span>{product.collectionTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{product.inStock ? 'Available to Request' : 'Currently Unavailable'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C110E]">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl text-[#8B1E3F] tabular-nums">
                {unitTotal.toFixed(2)} JOD
              </span>
              <span className="text-xs text-[#6E5A54]">
                Indicative price ({product.priceDisplay})
              </span>
            </div>
            <p className="text-sm text-[#6E5A54] leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Variant / Scale Selector */}
          {product.variants.length > 1 && (
            <div className="space-y-2.5">
              <label className="block text-xs uppercase tracking-widest text-[#1C110E]">
                Size / Edition
              </label>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-3 text-left text-sm border flex items-center justify-between transition-colors ${
                      selectedVariantId === v.id
                        ? 'border-[#8B1E3F] bg-[#F3ECE2] text-[#1C110E]'
                        : 'border-[#1C110E]/15 text-[#6E5A54] hover:border-[#1C110E]/40'
                    }`}
                  >
                    <span>{v.label}</span>
                    <span className="tabular-nums font-medium text-[#1C110E]">
                      {v.price.toFixed(2)} JOD
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colour Palette Selector where available */}
          {product.colourOptions.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs uppercase tracking-widest text-[#1C110E]">
                Curated Wax &amp; Ribbon Palette
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.colourOptions.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColour(col)}
                    className={`px-3 py-2.5 text-xs border text-center transition-colors min-h-[40px] ${
                      selectedColour === col
                        ? 'border-[#8B1E3F] bg-[#241612] text-[#FAF6F0]'
                        : 'border-[#1C110E]/15 text-[#1C110E] hover:border-[#8B1E3F]'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Signature Frosted Tote & Parchment Gift Wrap Option */}
          {product.skirtOptionAvailable && (
            <label className="flex items-start gap-3 p-4 bg-[#F3ECE2] border border-[#1C110E]/10 cursor-pointer">
              <input
                type="checkbox"
                checked={skirtWrapping}
                onChange={(e) => setSkirtWrapping(e.target.checked)}
                className="mt-0.5 accent-[#8B1E3F] w-4 h-4"
              />
              <div className="text-xs space-y-1">
                <span className="font-medium text-[#1C110E] block">
                  Include Signature Tote &amp; Silk Ribbon Wrapping
                </span>
                <span className="text-[#6E5A54] block">
                  Translucent boutique carrier wrapped with parchment &amp; coordinated silk
                  ribbon tie.
                </span>
              </div>
            </label>
          )}

          {/* Occasion Selector */}
          <div className="space-y-2">
            <label
              htmlFor="pdp-occasion"
              className="block text-xs uppercase tracking-widest text-[#1C110E]"
            >
              Occasion
            </label>
            <select
              id="pdp-occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as OccasionName)}
              className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm text-[#1C110E] focus:outline-none focus:border-[#8B1E3F]"
            >
              {ALL_OCCASIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          {/* Personalisation Add-ons (+3 JOD / +5 JOD) */}
          <div className="space-y-3 pt-2 border-t border-[#1C110E]/10">
            <p className="text-xs uppercase tracking-widest text-[#1C110E]">
              Personalisation Options
            </p>

            <div className="p-4 border border-[#1C110E]/15 space-y-3">
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="flex items-center gap-3 text-sm text-[#1C110E]">
                  <input
                    type="checkbox"
                    checked={personalisedMessage}
                    onChange={(e) => setPersonalisedMessage(e.target.checked)}
                    className="accent-[#8B1E3F] w-4 h-4"
                  />
                  <span>Calligraphy Gift Message Card</span>
                </span>
                <span className="text-sm font-medium text-[#8B1E3F] tabular-nums">
                  +{PERSONALISED_MESSAGE_FEE} JOD
                </span>
              </label>
              {personalisedMessage && (
                <input
                  type="text"
                  maxLength={120}
                  value={personalisedMessageText}
                  onChange={(e) => setPersonalisedMessageText(e.target.value)}
                  placeholder="Enter English or Arabic message (e.g. Mubarak, Layla)"
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#1C110E]/15 text-xs text-[#1C110E] focus:outline-none focus:border-[#8B1E3F]"
                />
              )}
            </div>

            <div className="p-4 border border-[#1C110E]/15 space-y-3">
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="flex items-center gap-3 text-sm text-[#1C110E]">
                  <input
                    type="checkbox"
                    checked={customTopper}
                    onChange={(e) => setCustomTopper(e.target.checked)}
                    className="accent-[#8B1E3F] w-4 h-4"
                  />
                  <span>Brass Holder &amp; Custom Event Tag</span>
                </span>
                <span className="text-sm font-medium text-[#8B1E3F] tabular-nums">
                  +{CUSTOM_TOPPER_FEE} JOD
                </span>
              </label>
              {customTopper && (
                <input
                  type="text"
                  maxLength={80}
                  value={customTopperText}
                  onChange={(e) => setCustomTopperText(e.target.value)}
                  placeholder="Tag wording (e.g. Moath & Hanan, Class of 2026)"
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#1C110E]/15 text-xs text-[#1C110E] focus:outline-none focus:border-[#8B1E3F]"
                />
              )}
            </div>
          </div>

          {/* Quantity + Primary CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-stretch gap-3">
              <div className="inline-flex items-center border border-[#1C110E]/20 bg-[#FAF6F0]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-11 h-12 inline-flex items-center justify-center hover:bg-[#F3ECE2]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm tabular-nums font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  aria-label="Increase quantity"
                  className="w-11 h-12 inline-flex items-center justify-center hover:bg-[#F3ECE2]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToBag}
                className="flex-1 px-6 py-3.5 text-xs uppercase tracking-[0.18em] bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] disabled:bg-[#6E5A54]/40 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Gift Bag</span>
                  </>
                ) : product.inStock ? (
                  <span>Add to Bag — {(unitTotal * quantity).toFixed(2)} JOD</span>
                ) : (
                  <span>Currently Unavailable</span>
                )}
              </button>
            </div>

            <Link
              to="/videos"
              className="block w-full py-3 text-center text-xs uppercase tracking-[0.18em] border border-[#1C110E]/20 text-[#1C110E] hover:border-[#8B1E3F] hover:text-[#8B1E3F] transition-colors"
            >
              Watch Candle Crafting Videos
            </Link>
          </div>

          {/* Craft Notes */}
          <div className="pt-6 border-t border-[#1C110E]/10 space-y-2.5 text-xs text-[#6E5A54]">
            <p className="uppercase tracking-widest text-[#1C110E]">Atelier Craft &amp; Notes</p>
            <ul className="space-y-1.5 list-disc pl-4">
              {product.craftDetails.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
              <li>Hand-poured in small batches in Amman using 100% natural soy wax</li>
              <li>Amman courier charges &amp; bespoke colour details confirmed after review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
