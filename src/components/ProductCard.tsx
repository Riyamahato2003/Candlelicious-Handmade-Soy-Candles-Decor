import React from 'react';
import { Link } from 'react-router-dom';
import type { CatalogueItem } from '../types/shop';
import { MediaFrame } from './MediaFrame';

interface ProductCardProps {
  item: CatalogueItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const primaryMedia = item.media[0];

  return (
    <article className="group flex flex-col h-full">
      <Link
        to={`/product/${item.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3ECE2] border border-[#1C110E]/8 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E3F]"
      >
        <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <MediaFrame
            type={primaryMedia?.type}
            src={primaryMedia?.src || ''}
            alt={primaryMedia?.alt || item.name}
          />
        </div>
        {!item.inStock && (
          <div className="absolute inset-0 bg-[#241612]/55 flex items-center justify-center p-4">
            <span className="text-xs uppercase tracking-widest text-[#FAF6F0] border border-[#FAF6F0]/40 px-3 py-1.5 bg-[#241612]/80">
              Temporarily Unavailable
            </span>
          </div>
        )}
      </Link>

      <div className="pt-4 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-2 text-xs text-[#6E5A54]">
          <span className="truncate">{item.collectionTitle}</span>
          <span aria-hidden="true">·</span>
          <span>{item.isFromPrice || item.isIndicativeRange ? 'Indicative' : 'Bespoke'}</span>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <Link
            to={`/product/${item.slug}`}
            className="font-serif text-lg text-[#1C110E] group-hover:text-[#8B1E3F] transition-colors"
          >
            {item.name}
          </Link>
          <span className="text-[15px] font-medium text-[#1C110E] tabular-nums whitespace-nowrap shrink-0">
            {item.priceDisplay}
          </span>
        </div>

        <p className="text-xs text-[#6E5A54] line-clamp-2 leading-relaxed">
          {item.leadTimeNote}
        </p>

        <div className="pt-2 mt-auto flex items-center gap-4 text-xs">
          <Link
            to={`/product/${item.slug}`}
            className="text-[#1C110E] underline underline-offset-4 decoration-[#C5A059] hover:text-[#8B1E3F] transition-colors"
          >
            View Details
          </Link>
          <span aria-hidden="true" className="text-[#6E5A54]/40">
            /
          </span>
          <Link
            to={`/product/${item.slug}`}
            className="text-[#6E5A54] hover:text-[#8B1E3F] transition-colors"
          >
            Customise
          </Link>
        </div>
      </div>
    </article>
  );
};
