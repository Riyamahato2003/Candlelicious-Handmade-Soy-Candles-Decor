import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, MapPin, Truck } from 'lucide-react';

export const DeliveryPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-14">
      <div className="max-w-2xl space-y-3 pb-8 border-b border-[#1C110E]/10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">
          Fulfilment &amp; Candle Care
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1C110E]">
          Delivery &amp; Pickup
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A54] leading-relaxed">
          All Candlelicious pieces are hand-poured and wrapped in Amman, Jordan—fulfilled via
          pre-arranged studio pickup or careful doorstep courier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-[#F3ECE2] border border-[#1C110E]/10 space-y-4">
          <MapPin className="w-5 h-5 text-[#8B1E3F]" aria-hidden="true" />
          <h2 className="font-serif text-2xl text-[#1C110E]">Amman Studio Pickup</h2>
          <p className="text-sm text-[#6E5A54] leading-relaxed">
            Scheduled pickup is available from our Amman workspace once your order has finished
            curing. To protect privacy and coordinate handovers smoothly, exact pickup coordinates
            and time windows are sent upon request confirmation.
          </p>
        </div>

        <div className="p-8 bg-[#F3ECE2] border border-[#1C110E]/10 space-y-4">
          <Truck className="w-5 h-5 text-[#8B1E3F]" aria-hidden="true" />
          <h2 className="font-serif text-2xl text-[#1C110E]">Amman &amp; Jordan Courier</h2>
          <p className="text-sm text-[#6E5A54] leading-relaxed">
            We coordinate careful upright delivery across Amman neighborhoods and governorates in
            Jordan so delicate sculpted candle bouquets, dough bowls, and glass jars travel
            securely. Courier fees are confirmed based on location upon reviewing your request.
          </p>
        </div>
      </div>

      <div className="p-8 border border-[#1C110E]/12 space-y-5">
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-[#8B1E3F]" aria-hidden="true" />
          <h2 className="font-serif text-2xl text-[#1C110E]">
            Burn &amp; Sculptural Soy Wax Care
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#6E5A54] leading-relaxed">
          <div className="space-y-2">
            <p className="font-medium text-[#1C110E]">Wick Trimming &amp; First Burn</p>
            <p>
              Trim cotton or wooden wicks to 5mm prior to each lighting for an even, soot-free glow.
              For floral bouquets and sculpted figures, remove dried botanical accents and place
              pieces on a heat-safe coaster before lighting.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-[#1C110E]">Curing Notice &amp; Custom Events</p>
            <p>
              Natural soy wax requires proper curing for optimal scent throw. For bespoke wedding or
              graduation favour runs, submit your preferred celebration date during checkout for
              priority scheduling.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/checkout"
          className="px-6 py-3.5 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors"
        >
          Request a Preferred Date
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3.5 text-xs uppercase tracking-widest border border-[#1C110E]/20 text-[#1C110E] hover:border-[#8B1E3F]"
        >
          Ask a Fulfilment Question
        </Link>
      </div>
    </div>
  );
};
