import React, { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

const FAQS = [
  {
    q: 'Are all prices final or indicative guides?',
    a: 'Catalogue prices shown in JOD are indicative guides for handcrafted Candlelicious creations (for example, Floral Hatboxes from 35 JOD or Carved Dough Bowls 45–62 JOD). Personalisation add-ons are +3 JOD for a Calligraphy Message Card and +5 JOD for a Brass Clip & Custom Event Tag. Final courier charges or bespoke event volume discounts are confirmed upon reviewing your request.',
  },
  {
    q: 'How do Amman studio pickup and delivery across Jordan work?',
    a: 'You can select either Amman Studio Pickup or courier delivery across Amman neighbourhoods and Jordan. Once your preferred date and delivery area are submitted, Lana confirms the courier fee and exact pickup appointment directly.',
  },
  {
    q: 'What wax and wicks do you use?',
    a: 'Every candle is hand-poured in small batches in Amman using 100% natural vegan soy wax paired with either pure braided cotton wicks or gentle crackling wooden wicks, depending on the vessel design.',
  },
  {
    q: 'Can I request custom colours or bilingual Arabic & English event tags?',
    a: 'Yes. Wedding cones, match-card favours, velvet hatboxes, and mini pumpkin jars can all be styled in custom wax palettes with bespoke English or Arabic calligraphy stationery.',
  },
  {
    q: 'Is online payment taken on this website?',
    a: 'No. Online card processing is disabled in this storefront preview so your submission acts as a structured bespoke order request reviewed by our atelier prior to payment confirmation.',
  },
];

export const ContactPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [occasion, setOccasion] = useState('Weddings');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          instagramHandle,
          occasion,
          preferredDate,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send enquiry');
      setSubmitted(true);
      setName('');
      setEmail('');
      setInstagramHandle('');
      setPreferredDate('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
      <div className="max-w-2xl space-y-3 pb-10 border-b border-[#1C110E]/10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">
          Atelier Concierge
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1C110E]">
          Contact &amp; Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A54] leading-relaxed">
          Planning wedding favours, graduation keepsakes, or a custom table centerpiece in Amman?
          Send a note below or reach us on Instagram at{' '}
          <a
            href="https://www.instagram.com/candlelicious.lana/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B1E3F] underline underline-offset-4"
          >
            @candlelicious.lana
          </a>
          .
        </p>
      </div>

      <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* FAQ Accordion */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-serif text-2xl text-[#1C110E] mb-4">
            Common Questions
          </h2>
          <div className="divide-y divide-[#1C110E]/10 border-y border-[#1C110E]/10">
            {FAQS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-serif text-lg text-[#1C110E]">{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8B1E3F] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="pt-3 text-sm text-[#6E5A54] leading-relaxed">{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Enquiry Form */}
        <div className="lg:col-span-6 p-6 sm:p-8 bg-[#F3ECE2] border border-[#1C110E]/10">
          <h2 className="font-serif text-2xl text-[#1C110E] mb-2">
            Send an Atelier Enquiry
          </h2>
          <p className="text-xs text-[#6E5A54] mb-6">
            Enquiries go directly to the private Candlelicious admin dashboard.
          </p>

          {submitted ? (
            <div className="p-6 bg-[#FAF6F0] border border-[#1C110E]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#8B1E3F]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-serif text-xl">Enquiry Sent</span>
              </div>
              <p className="text-sm text-[#6E5A54]">
                Thank you for reaching out. Your enquiry is saved for Lana&apos;s review.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-widest text-[#1C110E] underline underline-offset-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="enq-name" className="block text-xs text-[#6E5A54]">
                    Name *
                  </label>
                  <input
                    id="enq-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="enq-email" className="block text-xs text-[#6E5A54]">
                    Email *
                  </label>
                  <input
                    id="enq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="enq-ig" className="block text-xs text-[#6E5A54]">
                    Instagram Handle
                  </label>
                  <input
                    id="enq-ig"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@handle"
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="enq-date" className="block text-xs text-[#6E5A54]">
                    Preferred Date (optional)
                  </label>
                  <input
                    id="enq-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="enq-occ" className="block text-xs text-[#6E5A54]">
                  Occasion or Event
                </label>
                <input
                  id="enq-occ"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="enq-msg" className="block text-xs text-[#6E5A54]">
                  Message *
                </label>
                <textarea
                  id="enq-msg"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm focus:outline-none focus:border-[#8B1E3F]"
                />
              </div>

              {errorMsg && <p className="text-xs text-[#8B1E3F]">{errorMsg}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 text-xs uppercase tracking-[0.18em] bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors min-h-[48px]"
              >
                {submitting ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
