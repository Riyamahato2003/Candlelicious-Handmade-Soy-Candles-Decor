import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COLLECTIONS_META } from '../data/catalogueSeed';
import { MediaFrame } from '../components/MediaFrame';
import { useShop } from '../context/ShopContext';
import soyWaxPourImg from '../assets/images/studio_soywax_pour_1794903623066.jpg';

const FEATURED_SLUGS = [
  'crimson-rose-hatbox',
  'ivory-botanical-dough-bowl',
  'sage-blush-marble-boat',
  'blush-peony-teddy-vessel',
];

const STUDIO_MOSAIC: {
  title: string;
  src: string;
  alt: string;
  to: string;
}[] = [
  {
    title: 'Crimson Rose Velvet Hatbox',
    src: '/assets/aistudio/image_4a5d8010.png',
    alt: 'Candlelicious Crimson Rose Velvet Hatbox candle bouquet with brass heart clip',
    to: '/product/crimson-rose-hatbox',
  },
  {
    title: 'Ivory Botanical Dough Bowl',
    src: '/assets/aistudio/image_4314d612.png',
    alt: 'Candlelicious hand-carved mango wood bowls brimming with ivory peony candles',
    to: '/product/ivory-botanical-dough-bowl',
  },
  {
    title: 'Sage & Blush Marble Centerpiece',
    src: '/assets/aistudio/image_61ccd76a.png',
    alt: 'Candlelicious marbled stone centerpiece with sage and blush botanical soy candles',
    to: '/product/sage-blush-marble-boat',
  },
  {
    title: 'Rose-Lidded Ceramic Bonbonnières',
    src: '/assets/aistudio/image_3bfa96c6.png',
    alt: 'Candlelicious matte porcelain rose-lidded bonbonniere vessels with daisy melts',
    to: '/product/rose-lidded-bonbonniere',
  },
  {
    title: 'Burgundy & Terracotta Pedestal',
    src: '/assets/aistudio/image_06853134.png',
    alt: 'Candlelicious plum, terracotta, and ivory soy floral pedestal bowl with brass holders',
    to: '/product/burgundy-terracotta-pedestal',
  },
  {
    title: 'Wedding & Graduation Cones',
    src: '/assets/aistudio/image_d64575ce.png',
    alt: 'Candlelicious floral soy candle cones with dried gypsophila and satin ribbons',
    to: '/product/botanical-flower-cones',
  },
  {
    title: 'Botanical Match-Card Favours',
    src: '/assets/aistudio/image_cb3607ef.png',
    alt: 'Candlelicious botanical matchstick stationery cards with peony soy candles',
    to: '/product/match-card-peony-favours',
  },
  {
    title: 'Sculpted Rose-Fur Teddy Bear',
    src: '/assets/aistudio/image_fa99e50b.png',
    alt: 'Candlelicious pink rose-textured teddy bear soy candle holding a floral heart',
    to: '/product/rose-fur-teddy-candle',
  },
];

export const HomePage: React.FC = () => {
  const { catalogue } = useShop();
  const navigate = useNavigate();

  const [occasionNote, setOccasionNote] = useState('');
  const [scrollY, setScrollY] = useState(0);

  const pageRef = useRef<HTMLDivElement>(null);

  // Gentle scroll parallax for hero backdrop & copy
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrollY(Math.min(window.scrollY, 900));
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Soft IntersectionObserver reveal matching cubic-bezier(0.22, 0.61, 0.36, 1)
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.soft-reveal'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((el) => {
        el.dataset.visible = 'true';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = 'true';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [catalogue.length]);

  const featuredProducts = useMemo(() => {
    const picked = FEATURED_SLUGS.map((slug) => catalogue.find((c) => c.slug === slug)).filter(
      (item): item is NonNullable<typeof item> => Boolean(item)
    );
    if (picked.length === 4) return picked;
    return catalogue.slice(0, 4);
  }, [catalogue]);

  const handleGiftNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lower = occasionNote.trim().toLowerCase();
    let matchedOccasion = 'Birthdays';
    if (lower.includes('wedd') || lower.includes('nikkah') || lower.includes('brid'))
      matchedOccasion = 'Weddings';
    else if (lower.includes('grad')) matchedOccasion = 'Graduations';
    else if (lower.includes('house') || lower.includes('home') || lower.includes('decor'))
      matchedOccasion = 'Housewarming';
    else if (lower.includes('autumn') || lower.includes('fall') || lower.includes('pumpk'))
      matchedOccasion = 'Autumn & Seasonal';
    else if (lower.includes('romanc') || lower.includes('anniv') || lower.includes('love'))
      matchedOccasion = 'Romance';
    else if (lower.length > 0 && !lower.includes('birth')) matchedOccasion = 'Bespoke Events';

    navigate(`/shop?occasion=${encodeURIComponent(matchedOccasion)}`);
  };

  return (
    <div ref={pageRef} className="bg-[#FAF6F0] text-[#1C110E] pb-20">
      <style>{`
        .soft-reveal {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 1s cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 1s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .soft-reveal[data-visible="true"] {
          opacity: 1;
          transform: none;
        }
        @keyframes cdlHeroRise {
          0% {
            opacity: 0;
            transform: translateY(22px);
          }
          100% {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes cdlHeroFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .hero-rise {
          opacity: 0;
          animation: cdlHeroRise 1.05s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .hero-fade {
          opacity: 0;
          animation: cdlHeroFade 1.3s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .soft-reveal, .hero-rise, .hero-fade {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* 0. FULL-BLEED EDITORIAL HERO (OPENS DIRECTLY WITH ZERO INTRO OVERLAY) */}
      <section className="relative h-[88vh] min-h-[580px] w-full overflow-hidden bg-[#F3ECE2]">
        <div
          className="absolute inset-0 will-change-transform hero-fade"
          style={{
            transform: `translate3d(0, ${scrollY * 0.14}px, 0) scale(1.06)`,
          }}
        >
          <MediaFrame
            type="image"
            src="/assets/aistudio/image_88541090.png"
            alt="Candlelicious autumn pumpkin ceramic bowls, sculpted cocoa squirrel topper, and taupe suede hatbox candle display"
            imgClassName="h-full w-full object-cover object-center"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/55 via-[#FAF6F0]/30 to-[#FAF6F0]/92" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/75 via-[#FAF6F0]/30 to-transparent" />
        </div>

        <div
          className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-24"
          style={{
            transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
          }}
        >
          <p
            className="hero-rise text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#8B1E3F]"
            style={{ animationDelay: '120ms' }}
          >
            Amman, Jordan · 100% Natural Soy Wax
          </p>

          <h1
            className="hero-rise mt-5 max-w-4xl font-serif text-[2.9rem] leading-[1.02] tracking-tight text-[#1C110E] sm:text-6xl lg:text-[5.25rem]"
            style={{ animationDelay: '280ms' }}
          >
            Light, sculpted
            <br className="hidden sm:block" />{' '}
            <span className="italic font-normal text-[#8B1E3F]">like living florals.</span>
          </h1>

          <p
            className="hero-rise mt-6 max-w-md text-sm leading-relaxed text-[#1C110E]/75"
            style={{ animationDelay: '460ms' }}
          >
            Hand-poured soy candle bouquets, carved wood dough bowls, and architectural ceramic
            vessels crafted by Lana for contemporary Amman homes and milestones.
          </p>

          <div
            className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            style={{ animationDelay: '640ms' }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-[#241612] px-9 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#FAF6F0] transition-colors duration-300 hover:bg-[#8B1E3F] whitespace-nowrap"
              >
                Shop the collection
              </Link>
              <Link
                to="/videos"
                className="inline-flex items-center justify-center border border-[#1C110E]/30 bg-[#FAF6F0]/45 backdrop-blur-sm px-9 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#1C110E] transition-colors duration-300 hover:border-[#1C110E] whitespace-nowrap"
              >
                Watch studio videos
              </Link>
            </div>

            <div className="flex items-center gap-3 pt-2 sm:pt-0 text-xs text-[#6E5A54]">
              <span>Contemporary Home Decor</span>
              <span aria-hidden="true">·</span>
              <span>Amman Pickup &amp; Courier</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. FEATURED CREATIONS (4-COLUMN EDITORIAL STRIP) */}
      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-36">
        <div
          data-visible="false"
          style={{ transitionDelay: '0ms' }}
          className="soft-reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#6E5A54]">
              Featured
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-[1.06] text-[#1C110E] sm:text-5xl">
              Sculpted by hand, poured in pure soy wax.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#6E5A54]">
            Botanical candle bouquets, carved mango wood bowls, and fluted ceramic keepsakes
            dressed with satin ribbons and dried florals.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8 items-stretch">
          {featuredProducts.map((item, idx) => {
            const primaryImg =
              item.media.find((m) => m.type === 'image') || item.media[0];
            const secondaryImg = item.media.find(
              (m) => m.type === 'image' && m.src !== primaryImg?.src
            );

            return (
              <article
                key={item.id}
                data-visible="false"
                style={{ transitionDelay: `${idx * 90}ms` }}
                className="soft-reveal group flex flex-col h-full"
              >
                <Link
                  to={`/product/${item.slug}`}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3ECE2] block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E3F]"
                >
                  <div className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-105">
                    <MediaFrame
                      type="image"
                      src={primaryImg?.src || ''}
                      alt={primaryImg?.alt || item.name}
                    />
                  </div>
                  {secondaryImg && (
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100">
                      <MediaFrame
                        type="image"
                        src={secondaryImg.src}
                        alt={secondaryImg.alt}
                      />
                    </div>
                  )}
                </Link>

                <div className="mt-4 flex flex-col flex-1 gap-1">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#6E5A54]">
                    {item.collectionTitle}
                  </p>
                  <div className="flex items-baseline justify-between gap-2">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-serif text-lg sm:text-xl text-[#1C110E] transition-colors group-hover:text-[#8B1E3F]"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm text-[#1C110E] tabular-nums whitespace-nowrap shrink-0">
                      {item.priceDisplay}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E5A54] line-clamp-1">{item.leadTimeNote}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div
          data-visible="false"
          style={{ transitionDelay: '0ms' }}
          className="soft-reveal mt-14 flex justify-center"
        >
          <Link
            to="/shop"
            className="border-b border-[#C5A059] pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#1C110E] transition-colors hover:text-[#8B1E3F]"
          >
            View all {catalogue.length} creations
          </Link>
        </div>
      </section>

      {/* 2. THE ATELIER EDITORIAL SPLIT */}
      <section className="mx-auto mt-28 max-w-7xl px-5 sm:mt-40 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div
            data-visible="false"
            style={{ transitionDelay: '0ms' }}
            className="soft-reveal lg:col-span-7"
          >
            <div className="aspect-[5/4] w-full overflow-hidden bg-[#F3ECE2] group">
              <div className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-105">
                <MediaFrame
                  type="image"
                  src="/assets/aistudio/image_4314d612.png"
                  alt="Candlelicious hand-carved wood dough bowls with white peony soy wax candles"
                />
              </div>
            </div>
          </div>

          <div
            data-visible="false"
            style={{ transitionDelay: '140ms' }}
            className="soft-reveal lg:col-span-5 lg:pl-4"
          >
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#6E5A54]">
              The Atelier
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] text-[#1C110E] sm:text-[3.35rem]">
              Warm candlelight
              <br />
              <span className="italic font-normal text-[#8B1E3F]">for living spaces.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-[1.85] text-[#6E5A54]">
              From velvety red rose hatboxes and rose-lidded ceramic bonbonnières to bespoke
              wedding match-card favours, every Candlelicious piece blends sculptural form with
              clean-burning soy wax.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <Link
                to="/story"
                className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#1C110E] hover:text-[#8B1E3F] transition-colors"
              >
                <span>Discover our story</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
              </Link>
              <Link
                to="/delivery"
                className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#6E5A54] hover:text-[#1C110E] transition-colors"
              >
                Delivery &amp; Pickup
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIX COLLECTIONS (EQUAL-HEIGHT EDITORIAL OVERLAY CARDS) */}
      <section className="mx-auto mt-32 max-w-7xl px-5 sm:mt-44 sm:px-8">
        <div
          data-visible="false"
          style={{ transitionDelay: '0ms' }}
          className="soft-reveal flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#6E5A54]">
              Collections
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[#1C110E] sm:text-5xl">
              Six signature worlds to explore.
            </h2>
          </div>
          <Link
            to="/collections"
            className="border-b border-[#C5A059] pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#1C110E] transition-colors hover:text-[#8B1E3F] whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            View all collections
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {COLLECTIONS_META.map((col, idx) => (
            <div
              key={col.slug}
              data-visible="false"
              style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
              className="soft-reveal h-full"
            >
              <Link
                to={`/shop?collection=${col.slug}`}
                className="group relative block h-full overflow-hidden bg-[#F3ECE2]"
              >
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <div className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-105">
                    <MediaFrame type="image" src={col.coverSrc} alt={col.title} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C110E]/75 via-[#1C110E]/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:-translate-y-1">
                  <div>
                    <h3 className="font-serif text-2xl text-[#FAF6F0] sm:text-3xl">{col.title}</h3>
                    <p className="mt-1 max-w-xs text-xs text-[#FAF6F0]/80 line-clamp-1">
                      {col.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="mb-1 h-4 w-4 shrink-0 text-[#FAF6F0] transition-transform duration-500 group-hover:translate-x-1.5" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HANDPOURED BESPOKE STUDIO BAND */}
      <section className="mt-32 bg-[#F3ECE2] py-24 sm:mt-44 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20">
          <div
            data-visible="false"
            style={{ transitionDelay: '0ms' }}
            className="soft-reveal lg:col-span-6"
          >
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#8B1E3F]">
              Bespoke Personalisation
            </p>
            <h2 className="mt-5 font-serif text-[2.6rem] leading-[1.05] text-[#1C110E] sm:text-[3.85rem]">
              Poured by hand.
              <br />
              <span className="italic font-normal text-[#8B1E3F]">Tailored to your moment.</span>
            </h2>
            <p className="mt-8 max-w-md text-sm leading-[1.9] text-[#6E5A54]">
              Every Candlelicious arrangement is hand-poured with 100% natural soy wax in our Amman
              studio—finished with bilingual calligraphy notes (+3 JOD) or brass heart clips &amp;
              custom event tags (+5 JOD).
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-[#241612] px-8 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#FAF6F0] transition-colors duration-300 hover:bg-[#8B1E3F]"
              >
                Explore the collection
              </Link>
              <span className="text-xs text-[#6E5A54]">
                Calligraphy Card +3 JOD · Custom Tag +5 JOD
              </span>
            </div>
          </div>

          <div
            data-visible="false"
            style={{ transitionDelay: '140ms' }}
            className="soft-reveal lg:col-span-6"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#FAF6F0] group">
              <div className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-105">
                <MediaFrame
                  type="image"
                  src={soyWaxPourImg}
                  alt="Natural molten soy wax hand-poured in sunlit Amman candle studio"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FROM OUR STUDIO (@candlelicious.lana 8-TILE MOSAIC) */}
      <section className="mx-auto mt-28 max-w-7xl px-5 sm:mt-40 sm:px-8">
        <div
          data-visible="false"
          style={{ transitionDelay: '0ms' }}
          className="soft-reveal text-center"
        >
          <a
            href="https://www.instagram.com/candlelicious.lana/"
            target="_blank"
            rel="noreferrer"
            className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#6E5A54] hover:text-[#8B1E3F] transition-colors"
          >
            @candlelicious.lana
          </a>
          <h2 className="mt-4 font-serif text-4xl text-[#1C110E] sm:text-5xl">
            From our Amman studio
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {STUDIO_MOSAIC.map((tile, idx) => (
            <Link
              key={tile.src}
              to={tile.to}
              data-visible="false"
              style={{ transitionDelay: `${(idx % 4) * 70}ms` }}
              className="soft-reveal group relative block overflow-hidden bg-[#F3ECE2]"
            >
              <div className="aspect-square w-full overflow-hidden">
                <MediaFrame
                  type="image"
                  src={tile.src}
                  alt={tile.alt}
                  imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#241612]/45 p-4 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="font-serif text-base sm:text-lg text-[#FAF6F0]">
                  {tile.title}
                </span>
                <span className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-[#FAF6F0]/85">
                  View creation →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. OCCASION INVITATION BAR */}
      <section className="mx-auto mt-28 max-w-3xl px-5 pb-4 text-center sm:mt-40 sm:px-8">
        <div
          data-visible="false"
          style={{ transitionDelay: '0ms' }}
          className="soft-reveal"
        >
          <h2 className="font-serif text-4xl text-[#1C110E] sm:text-[3.4rem]">
            Warmth &amp; floral artistry, gifted.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#6E5A54]">
            Share an occasion, interior palette, or event idea to begin crafting your bespoke
            candle piece for Amman pickup or Jordan delivery.
          </p>

          <form
            onSubmit={handleGiftNoteSubmit}
            className="mx-auto mt-9 flex max-w-md items-center border-b border-[#1C110E]/25"
          >
            <input
              type="text"
              value={occasionNote}
              onChange={(e) => setOccasionNote(e.target.value)}
              placeholder="Wedding favour, housewarming, autumn centerpiece..."
              aria-label="Occasion or bespoke candle idea"
              className="w-full bg-transparent py-3 text-sm text-[#1C110E] placeholder:text-[#1C110E]/35 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 py-3 pl-4 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#1C110E] transition-colors hover:text-[#8B1E3F] whitespace-nowrap"
            >
              Start gift
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
