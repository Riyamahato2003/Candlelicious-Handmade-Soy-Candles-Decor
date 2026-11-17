import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { MediaFrame } from '../components/MediaFrame';

interface StudioVideo {
  chapter: string;
  title: string;
  category: string;
  description: string;
  src: string;
  alt: string;
  relatedProductPath: string;
  relatedProductLabel: string;
}

const FEATURED_FILM: StudioVideo = {
  chapter: '01',
  title: 'The Amman Atelier Lineup',
  category: 'Signature Showcase',
  description:
    'Step inside our sunlit Amman studio for a sweeping look at Candlelicious sculptural pieces—hand-carved ivory peony dough bowls, emerald citrus marble vessels, blush ceramic tulips, and warm autumn centerpieces.',
  src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_15.00.50_b4e33b7a.mp4',
  alt: 'Candlelicious signature collection showcase including floral wooden dough bowls, emerald stone citrus bowl, and tulip ceramic vessels',
  relatedProductPath: '/shop',
  relatedProductLabel: 'Explore All Creations',
};

const STUDIO_VIDEOS: StudioVideo[] = [
  {
    chapter: '02',
    title: 'Carved Wood Dough Bowl Up Close',
    category: 'Floral Craft',
    description:
      'Macro pass across multi-wick carved mango wood dough bowls crowned with hand-poured white dahlias, camellias, and creamy unbleached soy wax.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_14.59.37_4e3abda7.mp4',
    alt: 'Overhead close-up of Candlelicious long carved wooden dough bowl floral soy candle with braided cotton wicks',
    relatedProductPath: '/product/ivory-botanical-dough-bowl',
    relatedProductLabel: 'Ivory Botanical Dough Bowl',
  },
  {
    chapter: '03',
    title: 'Pearled Sand Wax Ritual',
    category: 'Home Fragrance',
    description:
      'Unwrapping our carved wooden bowl and Candlelicious Sand Wax refill pouch, pouring fine pearlescent beads around cotton wicks for clean, refillable ambiance.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_15.00.13_6a2f802e.mp4',
    alt: 'Pouring Candlelicious Pearled Sand Wax beads into hand-carved wooden bowl with cotton wicks',
    relatedProductPath: '/product/pearled-sand-wax-bowl',
    relatedProductLabel: 'Pearled Sand Wax Set',
  },
  {
    chapter: '04',
    title: 'Burgundy & Terracotta Ceramics',
    category: 'Seasonal Edit',
    description:
      'Fluted white stoneware vessels styled with deep plum, cognac, and blush soy peonies beside speckled woodland mushroom tapers.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_15.00.18_c91cc474.mp4',
    alt: 'Candlelicious burgundy, terracotta, and cream floral candles in fluted ceramic bowls with mushroom candles',
    relatedProductPath: '/product/burgundy-cognac-fluted-planter',
    relatedProductLabel: 'Burgundy & Cognac Planter',
  },
  {
    chapter: '05',
    title: 'Cozy Autumn Shelf Showcase',
    category: 'Seasonal Edit',
    description:
      'Full shelf study from our seasonal autumn edit—glazed ceramic pumpkins, cocoa woodland squirrel toppers, and ribbed amber vessels.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-15_at_11.22.41_e9423c09.mp4',
    alt: 'Candlelicious full seasonal autumn candle showcase on studio shelf',
    relatedProductPath: '/product/woodland-squirrel-harvest-bowl',
    relatedProductLabel: 'Woodland Squirrel Harvest Bowl',
  },
  {
    chapter: '06',
    title: 'Unmoulding Ribbed Pumpkins',
    category: 'Behind the Pour',
    description:
      'Demoulding hand-poured cream soy pumpkins fresh from silicone casts and arranging them in sage green, plum, terracotta, and warm cocoa tones.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_14.59.47_e31e4959.mp4',
    alt: 'Demoulding hand-poured soy wax pumpkin candles in cream, sage, plum, and cocoa',
    relatedProductPath: '/product/woodland-squirrel-harvest-bowl',
    relatedProductLabel: 'Shop Harvest Edit',
  },
  {
    chapter: '07',
    title: 'Ramadan Architectural Collection',
    category: 'Occasion Edit',
    description:
      'Sculpted mosque minarets, geometric lattice lanterns with crescent moons, and Arabic calligraphy date platters poured for evening gatherings.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_14.59.11_bd8101b3.mp4',
    alt: 'Candlelicious Ramadan collection sculpted minaret candles, crescent lanterns, and calligraphy tray',
    relatedProductPath: '/product/ramadan-architectural-candles',
    relatedProductLabel: 'Ramadan Architectural Edit',
  },
  {
    chapter: '08',
    title: 'Autumn Vibes 180g Amber Jars',
    category: 'Apothecary',
    description:
      'Small-batch 180g natural soy wax poured into UV-protective amber apothecary glass with natural cork stoppers and delicate dried botanicals.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-15_at_11.22.33_5ce17d71.mp4',
    alt: 'Candlelicious Autumn Vibes 180g cork-lid amber apothecary soy candle reel',
    relatedProductPath: '/product/autumn-vibes-amber-jar',
    relatedProductLabel: 'Autumn Vibes 180g Jar',
  },
  {
    chapter: '09',
    title: 'Hand-Gilding Botanical Sachets',
    category: 'Atelier Craft',
    description:
      'Fine brush strokes of champagne metallic mica across moulded soy autumn leaves, acorns, and mini pumpkins hung on natural jute twine.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-15_at_11.22.50_41cec70a.mp4',
    alt: 'Hand-gilding champagne gold mica pigment onto Candlelicious wax sachets',
    relatedProductPath: '/product/gilded-wax-sachets',
    relatedProductLabel: 'Hand-Gilded Wax Sachets',
  },
  {
    chapter: '10',
    title: 'Gold-Trimming Wood Wicks',
    category: 'Finishing Touch',
    description:
      'Trimming crackling wooden wicks inside sculpted daisy melts before closing the matte porcelain rose-lidded bonbonnière vessels.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_13.43.22_e24377b3.mp4',
    alt: 'Gold wick trimmer trimming wood wicks inside Candlelicious porcelain rose-lidded jars',
    relatedProductPath: '/product/rose-lidded-bonbonniere',
    relatedProductLabel: 'Rose-Lidded Bonbonnière',
  },
  {
    chapter: '11',
    title: 'Braided Cotton Wick Precision',
    category: 'Finishing Touch',
    description:
      'Inspecting and trimming multi-wick ivory floral dough bowls so every petal melts slowly and evenly from the first lighting.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_13.43.04_599aaa05.mp4',
    alt: 'Atelier worker trimming cotton wicks across Candlelicious ivory peony dough bowls',
    relatedProductPath: '/product/ivory-botanical-dough-bowl',
    relatedProductLabel: 'Ivory Botanical Dough Bowl',
  },
  {
    chapter: '12',
    title: 'Parchment & Frosted Tote Presentation',
    category: 'Boutique Wrapping',
    description:
      'Our signature preparation ritual: crisp botanical parchment paper, a translucent frosted carry tote, satin tie, and metallic heart card clip.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-15_at_11.23.03_fc9d52cb.mp4',
    alt: 'Candlelicious frosted boutique gift bag, parchment wrap, satin bow, and brass heart card clip',
    relatedProductPath: '/product/mini-pumpkin-ceramic-vessels',
    relatedProductLabel: 'Explore Wrapped Pieces',
  },
  {
    chapter: '13',
    title: 'Sheer Organza & Gold Wax Seal Unboxing',
    category: 'Boutique Wrapping',
    description:
      'Unboxing a finished keepsake gift box dressed in sheer white organza ribbon and stamped with our metallic gold wax seal beside candlelight.',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-17_at_14.59.22_bce00217.mp4',
    alt: 'Unboxing Candlelicious white gift box with sheer organza ribbon and gold wax seal next to burning candle',
    relatedProductPath: '/collections',
    relatedProductLabel: 'Browse Gift Collections',
  },
];

export const VideosPage: React.FC = () => {
  return (
    <div className="bg-[#FAF6F0] text-[#1C110E] pb-24">
      {/* Editorial Intro Section with Single Featured Image */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-16 lg:py-20 border-b border-[#1C110E]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">
              @candlelicious.lana · Atelier Films
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.06] text-[#1C110E]">
              Behind the flame: poured, sculpted &amp; wrapped in Amman.
            </h1>
            <p className="text-sm sm:text-base text-[#6E5A54] leading-[1.85]">
              Every Candlelicious piece begins with pure 100% natural soy wax, patient demoulding,
              hand-brushed metallic mica, and ribbon-tied packaging prepared by Lana. Scroll
              through our studio reels below to see each botanical pour, wick trim, seasonal
              collection, and wax-sealed gift box in motion.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#6E5A54]">
              <span className="tabular-nums">13 Studio Reels</span>
              <span aria-hidden="true">·</span>
              <span>100% Natural Soy Wax</span>
              <span aria-hidden="true">·</span>
              <Link
                to="/shop"
                className="text-[#1C110E] underline underline-offset-4 decoration-[#C5A059] hover:text-[#8B1E3F] transition-colors"
              >
                Shop Featured Creations
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden bg-[#F3ECE2] border border-[#1C110E]/10">
              <MediaFrame
                type="image"
                src="/assets/aistudio/image_564b70d4.png"
                alt="Sunlit marble table displaying taupe velvet Candlelicious hatbox with walnut squirrel and floral candles beside a lit glass candle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Reel 01 Banner (Matches 2-Column Editorial Proportion) */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 bg-[#F3ECE2] border border-[#1C110E]/10">
          <div className="lg:col-span-5">
            <div className="aspect-[9/14] max-w-sm mx-auto w-full overflow-hidden bg-[#241612] border border-[#1C110E]/15">
              <MediaFrame
                type="video"
                src={FEATURED_FILM.src}
                alt={FEATURED_FILM.alt}
                controls
                muted
                loop
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#8B1E3F]">
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                Film {FEATURED_FILM.chapter} · {FEATURED_FILM.category}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C110E] leading-[1.08]">
              {FEATURED_FILM.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6E5A54] leading-[1.85] max-w-xl">
              {FEATURED_FILM.description}
            </p>
            <div className="pt-2">
              <Link
                to={FEATURED_FILM.relatedProductPath}
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-xs uppercase tracking-[0.2em] bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors"
              >
                <span>{FEATURED_FILM.relatedProductLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Sequential Grid (Films 02–13: 4 Equal Rows of 3 Cards) */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 lg:pt-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#1C110E]/10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#6E5A54]">
              Complete Studio Archive
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C110E] mt-1">
              Craft, Pour &amp; Presentation Sequence
            </h2>
          </div>
          <p className="text-xs text-[#6E5A54] max-w-xs">
            Press play on any reel to watch our pieces up close in natural daylight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 items-stretch">
          {STUDIO_VIDEOS.map((film) => (
            <article key={film.chapter} className="group flex flex-col h-full">
              <div className="relative aspect-[9/14] w-full overflow-hidden bg-[#241612] border border-[#1C110E]/10">
                <MediaFrame
                  type="video"
                  src={film.src}
                  alt={film.alt}
                  autoPlay={false}
                  controls
                  muted
                  loop
                />
              </div>

              <div className="pt-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-[#8B1E3F] uppercase tracking-[0.16em]">
                  <span className="tabular-nums">{film.chapter}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#6E5A54]">{film.category}</span>
                </div>

                <h3 className="font-serif text-xl text-[#1C110E]">{film.title}</h3>

                <p className="text-xs text-[#6E5A54] leading-relaxed flex-1">
                  {film.description}
                </p>

                <div className="pt-2 mt-auto">
                  <Link
                    to={film.relatedProductPath}
                    className="inline-flex items-center gap-1.5 text-xs text-[#1C110E] underline underline-offset-4 decoration-[#C5A059] hover:text-[#8B1E3F] transition-colors"
                  >
                    <span>{film.relatedProductLabel}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
