import React from 'react';
import { Link } from 'react-router-dom';
import { MediaFrame } from '../components/MediaFrame';
import { MagneticButton } from '../components/MagneticButton';
import travertineVesselImg from '../assets/images/studio_travertine_vessel_1794903623643.jpg';
import stationeryImg from '../assets/images/studio_candle_stationery_1794903624528.jpg';

export const StoryPage: React.FC = () => {
  return (
    <div className="bg-[#FAF6F0] text-[#1C110E]">
      {/* Editorial Header */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">
              Our Atelier
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl leading-[1.06] text-[#1C110E]">
              Sculptural candle artistry &amp; contemporary home decor in Amman
            </h1>
            <p className="text-base text-[#6E5A54] leading-relaxed">
              Founded in Amman by Lana, Candlelicious transforms 100% natural soy wax into
              architectural floral bouquets, hand-carved mango wood dough bowls, ceramic
              bonbonnières, and keepsake wedding favours designed to linger in memory and elevate
              everyday interiors.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#6E5A54]">
              <span>Amman, Jordan</span>
              <span aria-hidden="true">·</span>
              <span>100% Natural Soy Wax · Hand-Poured in Small Batches</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden bg-[#F3ECE2] border border-[#1C110E]/10">
              <MediaFrame
                type="image"
                src="/assets/aistudio/image_06853134.png"
                alt="Candlelicious burgundy, terracotta, and ivory soy floral pedestal bowl in warm sunlight"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="border-t border-[#1C110E]/10 py-16 lg:py-24 bg-[#F3ECE2]/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <p className="text-xs text-[#8B1E3F] tabular-nums">01.</p>
            <h2 className="font-serif text-2xl text-[#1C110E]">Pure Botanical Soy Wax</h2>
            <p className="text-sm text-[#6E5A54] leading-relaxed">
              Every peony petal, sculpted rose, woodland squirrel, and apothecary jar is hand-poured
              from 100% natural soy wax with clean-burning braided cotton or crackling wooden wicks.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-[#8B1E3F] tabular-nums">02.</p>
            <h2 className="font-serif text-2xl text-[#1C110E]">Collectible Vessels</h2>
            <p className="text-sm text-[#6E5A54] leading-relaxed">
              Once a candle burns down, our fluted ceramics, sculpted rose-lidded porcelain jars,
              marbled stone boats, and carved wooden dough bowls live on as heirloom interior
              pieces.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-[#8B1E3F] tabular-nums">03.</p>
            <h2 className="font-serif text-2xl text-[#1C110E]">Personalised Favour Craft</h2>
            <p className="text-sm text-[#6E5A54] leading-relaxed">
              From bilingual Arabic &amp; English calligraphy name tags to custom botanical
              match-strike wedding cards (+3 JOD card / +5 JOD brass tag), every milestone feels
              deeply considered.
            </p>
          </div>
        </div>
      </section>

      {/* Studio Process Visuals */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] overflow-hidden border border-[#1C110E]/10">
              <MediaFrame
                type="image"
                src={travertineVesselImg}
                alt="Fluted stone ceramic vessels and brass wick trimmer on linen"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden border border-[#1C110E]/10">
              <MediaFrame
                type="image"
                src={stationeryImg}
                alt="Deckle-edge cotton gift stationery and silk satin ribbons on travertine"
              />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-serif text-3xl text-[#1C110E]">
              Designed for modern homes &amp; generous gestures
            </h2>
            <p className="text-sm text-[#6E5A54] leading-relaxed">
              Whether you are styling a coffee table centerpiece, gifting for an autumn gathering,
              or ordering twenty-five keepsake favour cones for a celebration in Amman, configure
              your request online in minutes.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <MagneticButton
                to="/videos"
                className="px-6 py-3.5 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors"
              >
                Watch Studio Videos
              </MagneticButton>
              <Link
                to="/shop"
                className="px-6 py-3.5 text-xs uppercase tracking-widest border border-[#1C110E]/20 text-[#1C110E] hover:border-[#8B1E3F] transition-colors inline-flex items-center"
              >
                Explore Shop All
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
