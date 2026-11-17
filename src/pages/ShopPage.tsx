import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { COLLECTIONS_META } from '../data/catalogueSeed';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import type { CollectionSlug, OccasionName } from '../types/shop';

const OCCASIONS: ('All' | OccasionName)[] = [
  'All',
  'Birthdays',
  'Weddings',
  'Graduations',
  'Housewarming',
  'Romance',
  'Autumn & Seasonal',
  'Bespoke Events',
];

export const ShopPage: React.FC = () => {
  const { catalogue, catalogueLoading, catalogueError, refreshCatalogue } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<'all' | CollectionSlug>(() => {
    const param = searchParams.get('collection');
    return (param as CollectionSlug) || 'all';
  });
  const [selectedOccasion, setSelectedOccasion] = useState<'All' | OccasionName>(() => {
    const param = searchParams.get('occasion');
    return (param as OccasionName) || 'All';
  });
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    const col = searchParams.get('collection');
    const occ = searchParams.get('occasion');
    if (col) setSelectedCollection(col as CollectionSlug);
    if (occ) setSelectedOccasion(occ as OccasionName);
  }, [searchParams]);

  const handleCollectionChange = (val: 'all' | CollectionSlug) => {
    setSelectedCollection(val);
    const next = new URLSearchParams(searchParams);
    if (val === 'all') next.delete('collection');
    else next.set('collection', val);
    setSearchParams(next, { replace: true });
  };

  const handleOccasionChange = (val: 'All' | OccasionName) => {
    setSelectedOccasion(val);
    const next = new URLSearchParams(searchParams);
    if (val === 'All') next.delete('occasion');
    else next.set('occasion', val);
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = catalogue.filter((item) => {
      if (selectedCollection !== 'all' && item.collection !== selectedCollection) {
        return false;
      }
      if (selectedOccasion !== 'All' && !item.occasions.includes(selectedOccasion)) {
        return false;
      }
      if (q) {
        const hay = `${item.name} ${item.collectionTitle} ${item.description} ${item.occasions.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.basePrice - b.basePrice);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.basePrice - a.basePrice);
    }
    return list;
  }, [catalogue, selectedCollection, selectedOccasion, query, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCollection('all');
    setSelectedOccasion('All');
    setSortBy('featured');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
      <div className="max-w-2xl space-y-3 pb-10 border-b border-[#1C110E]/10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">
          The Amman Atelier Catalogue
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1C110E]">
          Shop All Creations
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A54] leading-relaxed">
          All prices are indicative JOD guides handcrafted in pure natural soy wax in Amman,
          Jordan. Every piece can carry a calligraphy message card (+3 JOD) or custom acrylic
          tag (+5 JOD).
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="py-8 space-y-6 border-b border-[#1C110E]/10">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-[#6E5A54] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bouquets, dough bowls, vessels, favours..."
              aria-label="Search products"
              className="w-full pl-10 pr-9 py-2.5 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm text-[#1C110E] placeholder:text-[#6E5A54]/70 focus:outline-none focus:border-[#8B1E3F]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E5A54] hover:text-[#1C110E] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs text-[#6E5A54] flex items-center gap-2">
              <span>Occasion</span>
              <select
                value={selectedOccasion}
                onChange={(e) => handleOccasionChange(e.target.value as 'All' | OccasionName)}
                className="bg-[#F3ECE2] border border-[#1C110E]/15 px-3 py-2 text-xs text-[#1C110E] focus:outline-none focus:border-[#8B1E3F] min-h-[40px]"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-[#6E5A54] flex items-center gap-2">
              <span>Sort</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')
                }
                className="bg-[#F3ECE2] border border-[#1C110E]/15 px-3 py-2 text-xs text-[#1C110E] focus:outline-none focus:border-[#8B1E3F] min-h-[40px]"
              >
                <option value="featured">Curated Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>

        {/* Collection Interactive Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => handleCollectionChange('all')}
            className={`px-4 py-2 text-xs whitespace-nowrap shrink-0 transition-colors border min-h-[40px] ${
              selectedCollection === 'all'
                ? 'bg-[#241612] text-[#FAF6F0] border-[#241612]'
                : 'bg-transparent text-[#6E5A54] border-[#1C110E]/15 hover:text-[#1C110E] hover:border-[#1C110E]/40'
            }`}
          >
            All ({catalogue.length})
          </button>
          {COLLECTIONS_META.map((col) => (
            <button
              key={col.slug}
              type="button"
              onClick={() => handleCollectionChange(col.slug)}
              className={`px-4 py-2 text-xs whitespace-nowrap shrink-0 transition-colors border min-h-[40px] ${
                selectedCollection === col.slug
                  ? 'bg-[#241612] text-[#FAF6F0] border-[#241612]'
                  : 'bg-transparent text-[#6E5A54] border-[#1C110E]/15 hover:text-[#1C110E] hover:border-[#1C110E]/40'
              }`}
            >
              {col.title}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="py-5 flex items-center justify-between text-xs text-[#6E5A54]">
        <span className="tabular-nums">
          Showing {filtered.length} of {catalogue.length} creations
        </span>
        {(query || selectedCollection !== 'all' || selectedOccasion !== 'All') && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[#8B1E3F] underline underline-offset-4 hover:text-[#1C110E]"
          >
            Reset all filters
          </button>
        )}
      </div>

      {catalogueError && (
        <div className="mb-8 p-4 bg-[#F3ECE2] border border-[#8B1E3F]/30 text-xs text-[#1C110E] flex items-center justify-between gap-4">
          <span>{catalogueError} — showing studio catalogue snapshot.</span>
          <button
            type="button"
            onClick={refreshCatalogue}
            className="text-[#8B1E3F] underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      {catalogueLoading && catalogue.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-3 animate-pulse">
              <div className="aspect-[4/5] bg-[#F3ECE2]" />
              <div className="h-4 bg-[#F3ECE2] w-2/3" />
              <div className="h-3 bg-[#F3ECE2] w-1/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <p className="font-serif text-2xl text-[#1C110E]">
            No creations match those filters
          </p>
          <p className="text-sm text-[#6E5A54]">
            Try clearing your search or switching collections to explore all {catalogue.length} sculptural candles.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-3 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors"
          >
            Show All Creations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 pt-2">
          {filtered.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
