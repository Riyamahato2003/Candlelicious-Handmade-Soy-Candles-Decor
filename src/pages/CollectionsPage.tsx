import React from 'react';
import { Link } from 'react-router-dom';
import { COLLECTIONS_META } from '../data/catalogueSeed';
import { useShop } from '../context/ShopContext';
import { MediaFrame } from '../components/MediaFrame';
import { ProductCard } from '../components/ProductCard';

export const CollectionsPage: React.FC = () => {
  const { catalogue } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-20">
      <div className="max-w-2xl space-y-3 pb-10 border-b border-[#1C110E]/10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">
          Editorial Lookbook
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1C110E]">
          Our Six Signature Collections
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A54] leading-relaxed">
          From sculpted soy flower bouquets and carved mango wood dough bowls to rose-lidded
          ceramic vessels and wedding match-card favours—handcrafted in Amman, Jordan.
        </p>
      </div>

      <div className="space-y-24">
        {COLLECTIONS_META.map((col, idx) => {
          const items = catalogue.filter((c) => c.collection === col.slug);
          return (
            <section
              key={col.slug}
              className="pt-8 border-t border-[#1C110E]/10 first:border-t-0 first:pt-0 space-y-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className={`lg:col-span-5 space-y-4 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <p className="text-xs text-[#6E5A54] tabular-nums">
                    0{idx + 1} · {items.length} creations
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1C110E]">
                    {col.title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#6E5A54] leading-relaxed">
                    {col.editorialIntro}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 text-xs">
                    <Link
                      to={`/shop?collection=${col.slug}`}
                      className="px-5 py-3 uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors"
                    >
                      Filter in Shop
                    </Link>
                    <Link
                      to="/videos"
                      className="px-5 py-3 uppercase tracking-widest border border-[#1C110E]/20 text-[#1C110E] hover:border-[#8B1E3F] hover:text-[#8B1E3F] transition-colors"
                    >
                      Watch Atelier Reels
                    </Link>
                  </div>
                </div>

                <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="aspect-[16/10] overflow-hidden bg-[#F3ECE2] border border-[#1C110E]/10">
                    <MediaFrame
                      type={col.coverType}
                      src={col.coverSrc}
                      alt={col.title}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 items-stretch">
                {items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
                {col.showcaseExtras.map((extra) => (
                  <article key={extra.id} className="group flex flex-col h-full">
                    <Link
                      to={extra.targetPath}
                      className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3ECE2] border border-[#1C110E]/8 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E3F]"
                    >
                      <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                        <MediaFrame
                          type={extra.imageSrc.endsWith('.mp4') ? 'video' : 'image'}
                          src={extra.imageSrc}
                          alt={extra.alt}
                        />
                      </div>
                    </Link>

                    <div className="pt-4 flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-2 text-xs text-[#6E5A54]">
                        <span className="truncate">{col.title}</span>
                        <span aria-hidden="true">·</span>
                        <span>Atelier Study</span>
                      </div>

                      <div className="flex items-baseline justify-between gap-4">
                        <Link
                          to={extra.targetPath}
                          className="font-serif text-lg text-[#1C110E] group-hover:text-[#8B1E3F] transition-colors"
                        >
                          {extra.title}
                        </Link>
                        <span className="text-[13px] font-medium text-[#1C110E] tabular-nums whitespace-nowrap shrink-0">
                          {extra.priceNote}
                        </span>
                      </div>

                      <p className="text-xs text-[#6E5A54] line-clamp-2 leading-relaxed">
                        {extra.subtitle}
                      </p>

                      <div className="pt-2 mt-auto flex items-center gap-4 text-xs">
                        <Link
                          to={extra.targetPath}
                          className="text-[#1C110E] underline underline-offset-4 decoration-[#C5A059] hover:text-[#8B1E3F] transition-colors"
                        >
                          Explore Creation
                        </Link>
                        <span aria-hidden="true" className="text-[#6E5A54]/40">
                          /
                        </span>
                        <Link
                          to="/videos"
                          className="text-[#6E5A54] hover:text-[#8B1E3F] transition-colors"
                        >
                          Watch Videos
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
