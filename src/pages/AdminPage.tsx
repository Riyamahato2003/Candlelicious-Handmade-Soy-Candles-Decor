import React, { useCallback, useEffect, useState } from 'react';
import { Lock, LogOut, Plus, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
  CatalogueItem,
  CUSTOM_TOPPER_FEE,
  CustomerEnquiry,
  OrderRequest,
  OrderStatus,
  PERSONALISED_MESSAGE_FEE,
} from '../types/shop';

const ORDER_STATUSES: OrderStatus[] = [
  'New Request',
  'Quoted',
  'Confirmed',
  'In Preparation',
  'Ready / Dispatched',
  'Completed',
  'Cancelled',
];

export const AdminPage: React.FC = () => {
  const { catalogue, availability, refreshCatalogue, refreshAvailability } = useShop();

  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'orders' | 'catalogue' | 'availability' | 'enquiries'
  >('orders');

  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Order Edit Buffer
  const [editStatus, setEditStatus] = useState<OrderStatus>('New Request');
  const [editQuote, setEditQuote] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [savingOrder, setSavingOrder] = useState(false);

  // Catalogue Edit Buffer
  const [editingProduct, setEditingProduct] = useState<CatalogueItem | null>(null);
  const [prodPriceDisplay, setProdPriceDisplay] = useState('');
  const [prodBasePrice, setProdBasePrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPhotoUrl, setProdPhotoUrl] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);

  // Availability Buffer
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [maxCapacity, setMaxCapacity] = useState<number>(6);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const fetchAdminData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setEnquiries(Array.isArray(data.enquiries) ? data.enquiries : []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/session');
        const data = await res.json();
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          await fetchAdminData();
        }
      } finally {
        setCheckingSession(false);
      }
    })();
  }, [fetchAdminData]);

  useEffect(() => {
    setBlockedDates(availability.blockedDates);
    setMaxCapacity(availability.maxOrdersPerDay);
  }, [availability]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || 'Authentication failed');
      return;
    }
    setAuthenticated(true);
    setPasscode('');
    await fetchAdminData();
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setOrders([]);
    setEnquiries([]);
  };

  const openOrderDetail = (order: OrderRequest) => {
    setSelectedOrderId(order.id);
    setEditStatus(order.status);
    setEditQuote(order.finalQuoteJod !== null ? String(order.finalQuoteJod) : '');
    setEditNotes(order.adminNotes || '');
  };

  const handleSaveOrder = async () => {
    if (!selectedOrderId) return;
    setSavingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          finalQuoteJod: editQuote === '' ? null : Number(editQuote),
          adminNotes: editNotes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === data.order.id ? data.order : o)));
        showToast('Order request updated.');
      }
    } finally {
      setSavingOrder(false);
    }
  };

  const startEditProduct = (item: CatalogueItem) => {
    setEditingProduct(item);
    setProdPriceDisplay(item.priceDisplay);
    setProdBasePrice(String(item.basePrice));
    setProdDescription(item.description);
    setProdPhotoUrl(item.media[0]?.src || '');
    setProdInStock(item.inStock);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setSavingProduct(true);
    try {
      const res = await fetch(`/api/admin/catalogue/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceDisplay: prodPriceDisplay,
          basePrice: Number(prodBasePrice),
          description: prodDescription,
          primaryPhotoUrl: prodPhotoUrl,
          inStock: prodInStock,
        }),
      });
      if (res.ok) {
        await refreshCatalogue();
        setEditingProduct(null);
        showToast('Catalogue updated across storefront.');
      }
    } finally {
      setSavingProduct(false);
    }
  };

  const toggleProductStock = async (item: CatalogueItem) => {
    const res = await fetch(`/api/admin/catalogue/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !item.inStock }),
    });
    if (res.ok) {
      await refreshCatalogue();
      showToast(`${item.name} marked ${!item.inStock ? 'available' : 'unavailable'}.`);
    }
  };

  const handleSaveAvailability = async (nextDates: string[], nextCap: number) => {
    setSavingAvailability(true);
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockedDates: nextDates,
          maxOrdersPerDay: nextCap,
        }),
      });
      if (res.ok) {
        await refreshAvailability();
        showToast('Atelier calendar updated.');
      }
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleMarkEnquiry = async (id: string, status: 'New' | 'Replied') => {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok && data.enquiry) {
      setEnquiries((prev) => prev.map((e) => (e.id === id ? data.enquiry : e)));
    }
  };

  if (checkingSession) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-24 text-center text-sm text-[#6E5A54]">
        Verifying atelier session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 lg:py-28">
        <div className="p-8 bg-[#F3ECE2] border border-[#1C110E]/15 space-y-6">
          <div className="flex items-center gap-3 text-[#8B1E3F]">
            <Lock className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.2em]">Private Atelier Access</span>
          </div>
          <h1 className="font-serif text-3xl text-[#1C110E]">Candlelicious Admin</h1>
          <p className="text-xs text-[#6E5A54] leading-relaxed">
            Customer requests, recipient gift notes, and Amman studio capacity are protected
            behind server-side session verification.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="block text-xs text-[#6E5A54]">
                Atelier Passcode
              </label>
              <input
                id="admin-pass"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#1C110E]/20 text-sm focus:outline-none focus:border-[#8B1E3F]"
              />
            </div>

            {authError && <p className="text-xs text-[#8B1E3F]">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3.5 text-xs uppercase tracking-[0.18em] bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors min-h-[48px]"
            >
              Unlock Atelier Dashboard
            </button>

            <div className="pt-2 border-t border-[#1C110E]/10 flex items-center justify-between text-[11px] text-[#6E5A54]">
              <span>Demo passcode: candlelicious-atelier</span>
              <button
                type="button"
                onClick={() => setPasscode('candlelicious-atelier')}
                className="text-[#8B1E3F] underline underline-offset-2"
              >
                Fill Demo
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders =
    statusFilter === 'All'
      ? orders
      : orders.filter((o) => o.status === statusFilter);
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || null;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#1C110E]/10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#8B1E3F]">
            Private Management Studio
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C110E] mt-1">
            Candlelicious Atelier Operations
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {toastMsg && <span className="text-xs text-[#8B1E3F]">{toastMsg}</span>}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs border border-[#1C110E]/20 hover:border-[#8B1E3F] hover:text-[#8B1E3F] transition-colors min-h-[40px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'catalogue', label: `Catalogue (${catalogue.length})` },
            { id: 'availability', label: 'Dates & Capacity' },
            { id: 'enquiries', label: `Enquiries (${enquiries.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs whitespace-nowrap shrink-0 border transition-colors min-h-[40px] ${
              activeTab === tab.id
                ? 'bg-[#241612] text-[#FAF6F0] border-[#241612]'
                : 'bg-transparent text-[#6E5A54] border-[#1C110E]/15 hover:text-[#1C110E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl text-[#1C110E]">Order Requests</h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | OrderStatus)}
                className="px-3 py-2 bg-[#F3ECE2] border border-[#1C110E]/15 text-xs"
              >
                <option value="All">All Statuses</option>
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-10 bg-[#F3ECE2] border border-[#1C110E]/10 text-center text-sm text-[#6E5A54]">
                No order requests yet. Submit a sample request via Checkout to inspect it
                here.
              </div>
            ) : (
              <div className="divide-y divide-[#1C110E]/10 border border-[#1C110E]/10 bg-[#FAF6F0]">
                {filteredOrders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => openOrderDetail(o)}
                    className={`w-full p-5 text-left transition-colors hover:bg-[#F3ECE2]/60 ${
                      selectedOrderId === o.id ? 'bg-[#F3ECE2]' : ''
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-serif text-lg text-[#1C110E]">
                        {o.referenceCode} · {o.customer.name}
                      </span>
                      <span className="text-sm font-medium tabular-nums text-[#8B1E3F]">
                        {(o.finalQuoteJod ?? o.knownSubtotal).toFixed(2)} JOD
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6E5A54]">
                      <span className="font-medium text-[#1C110E]">{o.status}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{o.preferredDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {o.fulfilmentMethod === 'amman_courier'
                          ? `Amman Courier (${o.deliveryArea})`
                          : 'Amman Studio Pickup'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{o.items.length} line item(s)</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            {activeOrder ? (
              <div className="p-6 bg-[#F3ECE2] border border-[#1C110E]/15 space-y-5">
                <div className="border-b border-[#1C110E]/10 pb-4">
                  <p className="text-xs text-[#8B1E3F]">{activeOrder.referenceCode}</p>
                  <h3 className="font-serif text-2xl text-[#1C110E]">
                    {activeOrder.customer.name}
                  </h3>
                  <p className="text-xs text-[#6E5A54] mt-1">
                    {activeOrder.customer.email} · {activeOrder.customer.phone}
                    {activeOrder.customer.instagramHandle
                      ? ` · ${activeOrder.customer.instagramHandle}`
                      : ''}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="uppercase tracking-widest text-[#1C110E]">
                    Items &amp; Personalisation
                  </p>
                  {activeOrder.items.map((it) => (
                    <div key={it.id} className="p-3 bg-[#FAF6F0] border border-[#1C110E]/10 space-y-1">
                      <div className="flex justify-between font-medium text-[#1C110E]">
                        <span>
                          {it.quantity} × {it.productName}
                        </span>
                        <span className="tabular-nums">
                          {(it.unitTotal * it.quantity).toFixed(2)} JOD
                        </span>
                      </div>
                      <p className="text-[#6E5A54]">
                        {it.variantLabel}
                        {it.colourChoice ? ` · ${it.colourChoice}` : ''}
                        {it.skirtWrapping ? ' · Tote Wrap' : ''} · {it.occasion}
                      </p>
                      {it.personalisedMessage && (
                        <p className="text-[#8B1E3F]">
                          Card (+{PERSONALISED_MESSAGE_FEE} JOD):{' '}
                          {it.personalisedMessageText || 'Requested'}
                        </p>
                      )}
                      {it.customTopper && (
                        <p className="text-[#8B1E3F]">
                          Event Tag (+{CUSTOM_TOPPER_FEE} JOD):{' '}
                          {it.customTopperText || 'Requested'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-xs text-[#6E5A54] space-y-1">
                  <p>
                    <strong className="text-[#1C110E]">Recipient:</strong>{' '}
                    {activeOrder.recipient.name}
                  </p>
                  {activeOrder.recipient.giftNote && (
                    <p>
                      <strong className="text-[#1C110E]">Gift &amp; Scent Note:</strong>{' '}
                      {activeOrder.recipient.giftNote}
                    </p>
                  )}
                  <p>
                    <strong className="text-[#1C110E]">Payment Mode:</strong>{' '}
                    {activeOrder.stripeReadyNote}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#1C110E]/10">
                  <div className="space-y-1">
                    <label className="block text-xs text-[#6E5A54]">Fulfilment Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs text-[#6E5A54]">
                      Confirmed Total Quote (JOD, incl. courier if applicable)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editQuote}
                      onChange={(e) => setEditQuote(e.target.value)}
                      placeholder={`Indicative subtotal ${activeOrder.knownSubtotal.toFixed(2)} JOD`}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm tabular-nums"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs text-[#6E5A54]">Internal Notes</label>
                    <textarea
                      rows={3}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={savingOrder}
                    onClick={handleSaveOrder}
                    className="w-full py-3 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F] transition-colors"
                  >
                    {savingOrder ? 'Saving...' : 'Save Order Update'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#F3ECE2] border border-[#1C110E]/10 text-xs text-[#6E5A54] text-center">
                Select an order request on the left to inspect personalisation details and
                update status or quote.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATALOGUE TAB */}
      {activeTab === 'catalogue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 divide-y divide-[#1C110E]/10 border border-[#1C110E]/10">
            {catalogue.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-serif text-lg text-[#1C110E]">{item.name}</p>
                  <p className="text-xs text-[#6E5A54] tabular-nums">
                    {item.priceDisplay} · {item.collectionTitle} ·{' '}
                    {item.inStock ? 'Available' : 'Out of Stock'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleProductStock(item)}
                    className={`px-3 py-1.5 text-xs border transition-colors ${
                      item.inStock
                        ? 'border-[#1C110E]/20 text-[#1C110E] hover:border-[#8B1E3F]'
                        : 'border-[#8B1E3F] bg-[#8B1E3F] text-[#FAF6F0]'
                    }`}
                  >
                    {item.inStock ? 'Pause Stock' : 'Mark Available'}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEditProduct(item)}
                    className="px-3 py-1.5 text-xs bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F]"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            {editingProduct ? (
              <div className="p-6 bg-[#F3ECE2] border border-[#1C110E]/15 space-y-4">
                <h3 className="font-serif text-2xl text-[#1C110E]">
                  Edit {editingProduct.name}
                </h3>
                <div className="space-y-1">
                  <label className="block text-xs text-[#6E5A54]">Display Price</label>
                  <input
                    value={prodPriceDisplay}
                    onChange={(e) => setProdPriceDisplay(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-[#6E5A54]">Base Price (JOD)</label>
                  <input
                    type="number"
                    value={prodBasePrice}
                    onChange={(e) => setProdBasePrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-[#6E5A54]">Primary Photo / Video Path</label>
                  <input
                    value={prodPhotoUrl}
                    onChange={(e) => setProdPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-[#6E5A54]">Description</label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={prodInStock}
                    onChange={(e) => setProdInStock(e.target.checked)}
                    className="accent-[#8B1E3F]"
                  />
                  <span>Available for Request</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={savingProduct}
                    onClick={handleSaveProduct}
                    className="flex-1 py-3 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F]"
                  >
                    {savingProduct ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-3 text-xs border border-[#1C110E]/20"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#F3ECE2] border border-[#1C110E]/10 text-xs text-[#6E5A54] text-center">
                Select any creation on the left to adjust its price, photo, description, or
                stock status.
              </div>
            )}
          </div>
        </div>
      )}

      {/* AVAILABILITY TAB */}
      {activeTab === 'availability' && (
        <div className="max-w-2xl space-y-6 p-6 sm:p-8 bg-[#F3ECE2] border border-[#1C110E]/10">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-[#1C110E]">
              Atelier Calendar &amp; Daily Capacity
            </h2>
            <p className="text-xs text-[#6E5A54]">
              Blocked dates are immediately prevented in the Checkout Request form.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="cap-input" className="block text-xs text-[#6E5A54]">
              Maximum Requests Per Day
            </label>
            <div className="flex items-center gap-3">
              <input
                id="cap-input"
                type="number"
                min={1}
                max={50}
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value) || 1)}
                className="w-28 px-3 py-2 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm tabular-nums"
              />
              <button
                type="button"
                disabled={savingAvailability}
                onClick={() => handleSaveAvailability(blockedDates, maxCapacity)}
                className="px-4 py-2 text-xs uppercase tracking-widest bg-[#241612] text-[#FAF6F0] hover:bg-[#8B1E3F]"
              >
                Update Capacity
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#1C110E]/10">
            <label htmlFor="block-date" className="block text-xs text-[#6E5A54]">
              Block a Specific Date
            </label>
            <div className="flex items-center gap-3">
              <input
                id="block-date"
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="px-3 py-2 bg-[#FAF6F0] border border-[#1C110E]/15 text-sm"
              />
              <button
                type="button"
                disabled={!newBlockedDate || savingAvailability}
                onClick={() => {
                  if (!newBlockedDate || blockedDates.includes(newBlockedDate)) return;
                  const next = [...blockedDates, newBlockedDate].sort();
                  setBlockedDates(next);
                  setNewBlockedDate('');
                  handleSaveAvailability(next, maxCapacity);
                }}
                className="px-4 py-2 text-xs uppercase tracking-widest bg-[#8B1E3F] text-[#FAF6F0] inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Block Date</span>
              </button>
            </div>

            <div className="pt-2 space-y-2">
              {blockedDates.length === 0 ? (
                <p className="text-xs text-[#6E5A54]">No blocked dates configured.</p>
              ) : (
                blockedDates.map((d) => (
                  <div
                    key={d}
                    className="flex items-center justify-between px-4 py-2.5 bg-[#FAF6F0] border border-[#1C110E]/10 text-sm"
                  >
                    <span className="tabular-nums">{d}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = blockedDates.filter((x) => x !== d);
                        setBlockedDates(next);
                        handleSaveAvailability(next, maxCapacity);
                      }}
                      className="text-xs text-[#8B1E3F] inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unblock</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="p-10 bg-[#F3ECE2] border border-[#1C110E]/10 text-center text-sm text-[#6E5A54]">
              No customer enquiries received yet.
            </div>
          ) : (
            <div className="divide-y divide-[#1C110E]/10 border border-[#1C110E]/10">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="font-serif text-lg text-[#1C110E]">
                      {enq.name} · <span className="text-sm text-[#6E5A54]">{enq.email}</span>
                    </p>
                    <p className="text-xs text-[#6E5A54]">
                      {enq.occasion}
                      {enq.preferredDate ? ` · ${enq.preferredDate}` : ''}
                      {enq.instagramHandle ? ` · ${enq.instagramHandle}` : ''}
                    </p>
                    <p className="text-sm text-[#1C110E] pt-1">{enq.message}</p>
                  </div>
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleMarkEnquiry(enq.id, enq.status === 'New' ? 'Replied' : 'New')
                      }
                      className={`px-3.5 py-2 text-xs border ${
                        enq.status === 'Replied'
                          ? 'border-[#1C110E]/20 text-[#6E5A54]'
                          : 'border-[#8B1E3F] bg-[#8B1E3F] text-[#FAF6F0]'
                      }`}
                    >
                      {enq.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
