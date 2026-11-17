import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
  CUSTOM_TOPPER_FEE,
  FulfilmentMethod,
  OrderRequest,
  PERSONALISED_MESSAGE_FEE,
} from '../types/shop';

interface LocationPrefill {
  prefill?: {
    fulfilmentMethod?: FulfilmentMethod;
    deliveryArea?: string;
    preferredDate?: string;
    recipientName?: string;
    giftNote?: string;
  };
}

function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
}

export const CheckoutPage: React.FC = () => {
  const { bag, bagKnownSubtotal, availability, clearBag, refreshAvailability } = useShop();
  const location = useLocation();
  const prefill = (location.state as LocationPrefill | null)?.prefill;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [recipientName, setRecipientName] = useState(prefill?.recipientName || '');
  const [giftNote, setGiftNote] = useState(prefill?.giftNote || '');
  const [fulfilmentMethod, setFulfilmentMethod] = useState<FulfilmentMethod>(
    prefill?.fulfilmentMethod || 'pickup'
  );
  const [deliveryArea, setDeliveryArea] = useState(prefill?.deliveryArea || '');
  const [preferredDate, setPreferredDate] = useState(prefill?.preferredDate || defaultDate());

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRequest | null>(null);

  const isDateBlocked = availability.blockedDates.includes(preferredDate);
  const isDateFull =
    (availability.dateCounts[preferredDate] || 0) >= availability.maxOrdersPerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (bag.length === 0) {
      setErrorMsg('Your gift bag is empty.');
      return;
    }
    if (isDateBlocked || isDateFull) {
      setErrorMsg('That preferred date is unavailable. Please select another date.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: bag,
          fulfilmentMethod,
          preferredDate,
          deliveryArea,
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            instagramHandle,
          },
          recipient: {
            name: recipientName,
            giftNote,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not submit order request.');
      }
      setSubmittedOrder(data.order);
      clearBag();
      refreshAvailability();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission error.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 lg:py-20">
        <div className="p-8 sm:p-10 bg-[#F3ECE2] border border-[#1C110E]/15 space-y-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#8B1E3F] shrink-0 mt-1" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8B1E3F]">
                Sample Order Request Logged
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1C110E] mt-1">
                Request {submittedOrder.referenceCode} Received
              </h1>
            </div>
          </div>

          <p className="text-sm text-[#6E5A54] leading-relaxed">
            Thank you, {submittedOrder.customer.name}. Your bespoke candle request has been
            stored in the Candlelicious studio log for Lana&apos;s review.{' '}
            <strong className="font-medium text-[#1C110E]">
              No online payment has been taken
            </strong>{' '}
            — live card charges are disabled in this demo storefront.
          </p>

          <div className="p-5 bg-[#FAF6F0] border border-[#1C110E]/10 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6E5A54]">Status</span>
              <span className="font-medium text-[#8B1E3F]">{submittedOrder.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E5A54]">Preferred Date</span>
              <span className="tabular-nums">{submittedOrder.preferredDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E5A54]">Fulfilment</span>
              <span>
                {submittedOrder.fulfilmentMethod === 'amman_courier'
                  ? `Amman & Jordan Courier (${submittedOrder.deliveryArea})`
                  : 'Amman Studio Pickup'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#1C110E]/10">
              <span className="text-[#6E5A54]">Known Indicative Subtotal</span>
              <span className="font-serif text-xl tabular-nums">
                {submittedOrder.knownSubtotal.toFixed(2)} JOD
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#6E5A54]">
            <p className="uppercase tracking-widest text-[#1C110E]">
              Items &amp; Pending Confirmations
            </p>
            {submittedOrder.items.map((item) => (
              <p key={item.id}>
                · {item.quantity} × {item.productName}
                {item.variantLabel ? ` (${item.variantLabel})` : ''} —{' '}
                {(item.unitTotal * item.quantity).toFixed(2)} JOD
              </p>
            ))}
            {submittedOrder.pendingConfirmationNotes.map((n, idx) => (
              <p key={idx} className="text-[#8B1E3F]">
                · {n}
              </p>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="px-6 py-3 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors"
            >
              Return to Catalogue
            </Link>
            <Link
              to="/admin"
              className="px-6 py-3 text-xs uppercase tracking-widest border border-[#1C110E]/20 text-[#1C110E] hover:border-[#8B1E3F]"
            >
              Review in Atelier Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
      <div className="max-w-2xl space-y-3 pb-8 border-b border-[#1C110E]/10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">
          Order Request &amp; Enquiry Submission
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1C110E]">
          Complete Your Gift Request
        </h1>
        <p className="text-sm text-[#6E5A54] leading-relaxed">
          Submit your curated sculptural candles, preferred date, fragrance notes, and
          personalisation details. Payments are disabled in this preview—orders are reviewed
          before confirming courier delivery or final quotes.
        </p>
      </div>

      {bag.length === 0 ? (
        <div className="py-16 text-center space-y-4">
          <p className="font-serif text-2xl text-[#1C110E]">Your gift bag is empty</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0]"
          >
            Browse Creations
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          <div className="lg:col-span-7 space-y-8">
            {/* Customer Contact */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#1C110E]">1. Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="chk-name" className="block text-xs text-[#6E5A54]">
                    Full Name *
                  </label>
                  <input
                    id="chk-name"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="chk-email" className="block text-xs text-[#6E5A54]">
                    Email Address *
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="chk-phone" className="block text-xs text-[#6E5A54]">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="chk-phone"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+962 7X XXX XXXX"
                    className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="chk-ig" className="block text-xs text-[#6E5A54]">
                    Instagram Handle (optional)
                  </label>
                  <input
                    id="chk-ig"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
              </div>
            </section>

            {/* Fulfilment & Date */}
            <section className="space-y-4 pt-6 border-t border-[#1C110E]/10">
              <h2 className="font-serif text-2xl text-[#1C110E]">
                2. Amman Studio Pickup or Courier Delivery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfilmentMethod('pickup')}
                  className={`p-4 text-left border transition-colors ${
                    fulfilmentMethod === 'pickup'
                      ? 'border-[#8B1E3F] bg-[#241612] text-[#FAF6F0]'
                      : 'border-[#1C110E]/15 bg-[#F3ECE2]'
                  }`}
                >
                  <p className="font-serif text-lg">Amman Studio Pickup</p>
                  <p className="text-xs opacity-75 mt-1">
                    Pickup appointment &amp; location shared upon confirmation.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfilmentMethod('amman_courier')}
                  className={`p-4 text-left border transition-colors ${
                    fulfilmentMethod === 'amman_courier'
                      ? 'border-[#8B1E3F] bg-[#241612] text-[#FAF6F0]'
                      : 'border-[#1C110E]/15 bg-[#F3ECE2]'
                  }`}
                >
                  <p className="font-serif text-lg">Amman &amp; Jordan Courier</p>
                  <p className="text-xs opacity-75 mt-1">
                    Courier charge confirmed based on neighbourhood prior to dispatch.
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="chk-date" className="block text-xs text-[#6E5A54]">
                    Preferred Date *
                  </label>
                  <input
                    id="chk-date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                  {(isDateBlocked || isDateFull) && (
                    <p className="text-xs text-[#8B1E3F]">
                      This date is unavailable in the studio calendar.
                    </p>
                  )}
                </div>

                {fulfilmentMethod === 'amman_courier' && (
                  <div className="space-y-1.5">
                    <label htmlFor="chk-area" className="block text-xs text-[#6E5A54]">
                      Amman Area / City in Jordan *
                    </label>
                    <input
                      id="chk-area"
                      required
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      placeholder="e.g. Abdoun, Dabouq, Sweifieh"
                      className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Recipient & Gift Note */}
            <section className="space-y-4 pt-6 border-t border-[#1C110E]/10">
              <h2 className="font-serif text-2xl text-[#1C110E]">
                3. Recipient &amp; Scent / Styling Note
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="chk-recipient" className="block text-xs text-[#6E5A54]">
                    Recipient Name
                  </label>
                  <input
                    id="chk-recipient"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Leave blank if same as your name"
                    className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="chk-note" className="block text-xs text-[#6E5A54]">
                    Gift Note, Bilingual Calligraphy Request &amp; Fragrance Mood
                  </label>
                  <textarea
                    id="chk-note"
                    rows={3}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3ECE2] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="p-6 bg-[#F3ECE2] border border-[#1C110E]/15 space-y-5">
              <h2 className="font-serif text-2xl text-[#1C110E]">Order Summary</h2>

              <div className="divide-y divide-[#1C110E]/10">
                {bag.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium text-[#1C110E]">
                        {item.quantity} × {item.productName}
                      </p>
                      <p className="text-xs text-[#6E5A54]">
                        {item.variantLabel}
                        {item.colourChoice ? ` · ${item.colourChoice}` : ''}
                        {item.personalisedMessage ? ` · Card (+${PERSONALISED_MESSAGE_FEE} JOD)` : ''}
                        {item.customTopper ? ` · Tag (+${CUSTOM_TOPPER_FEE} JOD)` : ''}
                      </p>
                    </div>
                    <span className="tabular-nums font-medium shrink-0">
                      {(item.unitTotal * item.quantity).toFixed(2)} JOD
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#1C110E]/10 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6E5A54]">Known Indicative Subtotal</span>
                  <span className="font-serif text-2xl tabular-nums text-[#1C110E]">
                    {bagKnownSubtotal.toFixed(2)} JOD
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#6E5A54]">
                  <span>Delivery / Custom Quote Adjustments</span>
                  <span className="text-[#8B1E3F]">Pending Confirmation</span>
                </div>
              </div>

              {/* Demo Payment Notice */}
              <div className="p-4 bg-[#FAF6F0] border border-[#C5A059]/50 text-xs text-[#6E5A54] space-y-1.5">
                <div className="flex items-center gap-2 font-medium text-[#1C110E]">
                  <Lock className="w-3.5 h-3.5 text-[#8B1E3F]" />
                  <span>Sample Request Mode (No Card Charged)</span>
                </div>
                <p className="leading-relaxed">
                  Online card processing is disabled in this preview. Submitting creates a
                  validated sample order request ready for Lana&apos;s confirmation.
                </p>
              </div>

              {errorMsg && (
                <p className="p-3 bg-[#8B1E3F]/10 border border-[#8B1E3F] text-xs text-[#8B1E3F]">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || isDateBlocked || isDateFull}
                className="w-full py-4 text-xs uppercase tracking-[0.18em] bg-[#8B1E3F] text-[#FAF6F0] hover:bg-[#241612] disabled:opacity-45 transition-colors min-h-[48px]"
              >
                {submitting ? 'Submitting Request...' : 'Submit Sample Order Request'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
