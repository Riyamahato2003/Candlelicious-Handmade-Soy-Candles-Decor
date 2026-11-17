import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { CATALOGUE_SEED } from './src/data/catalogueSeed.ts';
import type {
  AvailabilityConfig,
  BagItem,
  CatalogueItem,
  CustomerEnquiry,
  FulfilmentMethod,
  OrderRequest,
  OrderStatus,
} from './src/types/shop.ts';
import { CUSTOM_TOPPER_FEE, PERSONALISED_MESSAGE_FEE } from './src/types/shop.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'candlelicious-atelier';
const SESSION_SECRET =
  process.env.SESSION_SECRET || 'candlelicious-amman-atelier-hmac-key';
const SESSION_COOKIE = 'candlelicious_admin_session';

interface StoreData {
  catalogue: CatalogueItem[];
  orders: OrderRequest[];
  availability: AvailabilityConfig;
  enquiries: CustomerEnquiry[];
}

function getDefaultStore(): StoreData {
  return {
    catalogue: structuredClone(CATALOGUE_SEED),
    orders: [],
    availability: {
      blockedDates: [],
      maxOrdersPerDay: 6,
      dateCounts: {},
    },
    enquiries: [],
  };
}

function ensureStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial = getDefaultStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      catalogue:
        Array.isArray(parsed.catalogue) && parsed.catalogue.length > 0
          ? parsed.catalogue
          : structuredClone(CATALOGUE_SEED),
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      availability: parsed.availability || {
        blockedDates: [],
        maxOrdersPerDay: 6,
        dateCounts: {},
      },
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
    };
  } catch {
    const fallback = getDefaultStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

function writeStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpPath, STORE_PATH);
}

function signSession(payload: string): string {
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return `${payload}.${sig}`;
}

function verifySession(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const lastDot = token.lastIndexOf('.');
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  try {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expectedSig, 'hex');
    if (a.length !== b.length) return false;
    if (!crypto.timingSafeEqual(a, b)) return false;
    const [, expStr] = payload.split(':');
    const exp = Number(expStr);
    return Number.isFinite(exp) && Date.now() < exp;
  } catch {
    return false;
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;
  for (const pair of header.split(';')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const val = decodeURIComponent(pair.slice(idx + 1).trim());
    result[key] = val;
  }
  return result;
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie);
  if (!verifySession(cookies[SESSION_COOKIE])) {
    res.status(401).json({ error: 'Admin authentication required.' });
    return;
  }
  next();
}

function sanitizeText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

async function startServer() {
  ensureStore();
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '1mb' }));

  // Public Catalogue
  app.get('/api/catalogue', (_req: Request, res: Response) => {
    const store = ensureStore();
    res.json({ items: store.catalogue });
  });

  // Public Availability
  app.get('/api/availability', (_req: Request, res: Response) => {
    const store = ensureStore();
    res.json({
      blockedDates: store.availability.blockedDates,
      maxOrdersPerDay: store.availability.maxOrdersPerDay,
      dateCounts: store.availability.dateCounts,
    });
  });

  // Public Order Request Submission (Server-validated pricing & availability)
  app.post('/api/orders', (req: Request, res: Response) => {
    const store = ensureStore();
    const body = req.body || {};

    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) {
      res.status(400).json({ error: 'Your gift bag cannot be empty.' });
      return;
    }
    if (rawItems.length > 25) {
      res.status(400).json({ error: 'Maximum 25 line items per order request.' });
      return;
    }

    const fulfilmentMethod: FulfilmentMethod =
      body.fulfilmentMethod === 'amman_courier' ? 'amman_courier' : 'pickup';
    const preferredDate = sanitizeText(body.preferredDate, 20);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      res.status(400).json({ error: 'Please select a valid preferred date.' });
      return;
    }

    if (store.availability.blockedDates.includes(preferredDate)) {
      res.status(409).json({
        error:
          'That preferred date is currently closed in our Amman studio calendar. Please choose another date.',
      });
      return;
    }
    const existingCount = store.availability.dateCounts[preferredDate] || 0;
    if (existingCount >= store.availability.maxOrdersPerDay) {
      res.status(409).json({
        error:
          'Daily bespoke pouring capacity has been reached for that date. Please select another date.',
      });
      return;
    }

    const customerName = sanitizeText(body.customer?.name, 100);
    const customerEmail = sanitizeText(body.customer?.email, 120);
    const customerPhone = sanitizeText(body.customer?.phone, 40);
    const instagramHandle = sanitizeText(body.customer?.instagramHandle, 60);
    const recipientName = sanitizeText(body.recipient?.name, 100);
    const giftNote = sanitizeText(body.recipient?.giftNote, 400);
    const deliveryArea = sanitizeText(body.deliveryArea, 80);

    if (!customerName || !customerEmail || !customerPhone) {
      res.status(400).json({
        error: 'Name, email address, and phone/WhatsApp number are required.',
      });
      return;
    }
    if (fulfilmentMethod === 'amman_courier' && !deliveryArea) {
      res.status(400).json({
        error: 'Please enter your Amman neighbourhood or city in Jordan for courier coordination.',
      });
      return;
    }

    const validatedItems: BagItem[] = [];
    const pendingNotes = new Set<string>();

    if (fulfilmentMethod === 'amman_courier') {
      pendingNotes.add(
        'Amman & Jordan courier delivery fee is confirmed based on neighbourhood and dispatch window.'
      );
    } else {
      pendingNotes.add(
        'Amman studio pickup window & exact collection coordinates will be shared upon confirmation.'
      );
    }

    for (const raw of rawItems) {
      const product = store.catalogue.find((p) => p.id === raw.productId);
      if (!product) {
        res.status(400).json({ error: 'One or more selected candles could not be found.' });
        return;
      }
      if (!product.inStock) {
        res.status(409).json({
          error: `${product.name} is currently paused in our atelier. Please adjust your bag.`,
        });
        return;
      }

      const quantity = Math.max(1, Math.min(50, Math.floor(Number(raw.quantity) || 1)));
      const matchedVariant =
        product.variants.find((v) => v.id === raw.variantId) || product.variants[0];
      const baseUnitPrice = matchedVariant ? matchedVariant.price : product.basePrice;

      const personalisedMessage = Boolean(raw.personalisedMessage);
      const customTopper = Boolean(raw.customTopper);
      const personalisationUnitFee =
        (personalisedMessage ? PERSONALISED_MESSAGE_FEE : 0) +
        (customTopper ? CUSTOM_TOPPER_FEE : 0);
      const unitTotal = baseUnitPrice + personalisationUnitFee;

      const itemPendingFlags: string[] = [];
      if (product.isFromPrice || product.isIndicativeRange) {
        itemPendingFlags.push('Indicative base price — final quote confirmed upon bespoke design review');
        pendingNotes.add(
          `${product.name} carries an indicative price (${product.priceDisplay}) subject to final bespoke confirmation.`
        );
      }
      if (raw.skirtWrapping && product.skirtOptionAvailable) {
        itemPendingFlags.push('Parchment & frosted tote satin wrapping selected — confirmed on review');
        pendingNotes.add(
          'Signature frosted tote & silk satin ribbon wrapping preference is noted.'
        );
      }

      validatedItems.push({
        id: sanitizeText(raw.id, 64) || crypto.randomUUID(),
        productId: product.id,
        slug: product.slug,
        productName: product.name,
        imageSrc: product.media[0]?.src || '',
        variantId: matchedVariant?.id,
        variantLabel: matchedVariant?.label,
        colourChoice: sanitizeText(raw.colourChoice, 60) || undefined,
        skirtWrapping: Boolean(raw.skirtWrapping && product.skirtOptionAvailable),
        occasion: sanitizeText(raw.occasion, 40) as BagItem['occasion'] || 'Birthdays',
        personalisedMessage,
        personalisedMessageText: personalisedMessage
          ? sanitizeText(raw.personalisedMessageText, 120)
          : '',
        customTopper,
        customTopperText: customTopper ? sanitizeText(raw.customTopperText, 80) : '',
        quantity,
        baseUnitPrice,
        personalisationUnitFee,
        unitTotal,
        pendingQuoteFlags: itemPendingFlags,
      });
    }

    const knownSubtotal = validatedItems.reduce(
      (sum, item) => sum + item.unitTotal * item.quantity,
      0
    );

    const now = new Date().toISOString();
    const referenceCode = `CDL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const order: OrderRequest = {
      id: crypto.randomUUID(),
      referenceCode,
      createdAt: now,
      updatedAt: now,
      status: 'New Request',
      items: validatedItems,
      knownSubtotal,
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
        name: recipientName || customerName,
        giftNote,
      },
      demoPaymentStatus: 'sample_request_unpaid',
      stripeReadyNote:
        'Sample order request recorded. Live card payments are disabled in this demo storefront.',
      pendingConfirmationNotes: Array.from(pendingNotes),
      adminNotes: '',
      finalQuoteJod: null,
    };

    store.orders.unshift(order);
    store.availability.dateCounts[preferredDate] = existingCount + 1;
    writeStore(store);

    res.status(201).json({ order });
  });

  // Public Contact / Bespoke Enquiry
  app.post('/api/enquiries', (req: Request, res: Response) => {
    const store = ensureStore();
    const body = req.body || {};
    const name = sanitizeText(body.name, 100);
    const email = sanitizeText(body.email, 120);
    const message = sanitizeText(body.message, 1000);
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }

    const enquiry: CustomerEnquiry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name,
      email,
      instagramHandle: sanitizeText(body.instagramHandle, 60),
      occasion: sanitizeText(body.occasion, 60) || 'General Enquiry',
      preferredDate: sanitizeText(body.preferredDate, 20),
      message,
      status: 'New',
    };

    store.enquiries.unshift(enquiry);
    writeStore(store);
    res.status(201).json({ enquiry });
  });

  // Admin Authentication
  app.get('/api/admin/session', (req: Request, res: Response) => {
    const cookies = parseCookies(req.headers.cookie);
    const authenticated = verifySession(cookies[SESSION_COOKIE]);
    res.json({ authenticated });
  });

  app.post('/api/admin/login', (req: Request, res: Response) => {
    const passcode = sanitizeText(req.body?.passcode, 120);
    if (!passcode || passcode !== ADMIN_PASSCODE) {
      res.status(401).json({ error: 'Invalid atelier passcode.' });
      return;
    }
    const payload = `admin:${Date.now() + 1000 * 60 * 60 * 12}`;
    const signed = signSession(payload);
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const cookieParts = [
      `${SESSION_COOKIE}=${encodeURIComponent(signed)}`,
      'HttpOnly',
      'Path=/',
      `Max-Age=${60 * 60 * 12}`,
      isHttps ? 'SameSite=None; Secure' : 'SameSite=Lax',
    ];
    res.setHeader('Set-Cookie', cookieParts.join('; '));
    res.json({ authenticated: true });
  });

  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const cookieParts = [
      `${SESSION_COOKIE}=`,
      'HttpOnly',
      'Path=/',
      'Max-Age=0',
      isHttps ? 'SameSite=None; Secure' : 'SameSite=Lax',
    ];
    res.setHeader('Set-Cookie', cookieParts.join('; '));
    res.json({ authenticated: false });
  });

  // Protected Admin Routes
  app.get('/api/admin/orders', requireAdmin, (_req: Request, res: Response) => {
    const store = ensureStore();
    res.json({ orders: store.orders, enquiries: store.enquiries });
  });

  app.patch('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
    const store = ensureStore();
    const order = store.orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order request not found.' });
      return;
    }

    const allowedStatuses: OrderStatus[] = [
      'New Request',
      'Quoted',
      'Confirmed',
      'In Preparation',
      'Ready / Dispatched',
      'Completed',
      'Cancelled',
    ];

    if (typeof req.body?.status === 'string') {
      if (!allowedStatuses.includes(req.body.status as OrderStatus)) {
        res.status(400).json({ error: 'Invalid order status.' });
        return;
      }
      order.status = req.body.status as OrderStatus;
    }
    if (typeof req.body?.adminNotes === 'string') {
      order.adminNotes = sanitizeText(req.body.adminNotes, 1000);
    }
    if (req.body?.finalQuoteJod === null || req.body?.finalQuoteJod === '') {
      order.finalQuoteJod = null;
    } else if (req.body?.finalQuoteJod !== undefined) {
      const parsedQuote = Number(req.body.finalQuoteJod);
      if (!Number.isFinite(parsedQuote) || parsedQuote < 0 || parsedQuote > 10000) {
        res.status(400).json({ error: 'Invalid quote figure.' });
        return;
      }
      order.finalQuoteJod = Math.round(parsedQuote * 100) / 100;
    }
    order.updatedAt = new Date().toISOString();
    writeStore(store);
    res.json({ order });
  });

  app.patch('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const store = ensureStore();
    const enquiry = store.enquiries.find((e) => e.id === req.params.id);
    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }
    if (req.body?.status === 'New' || req.body?.status === 'Replied') {
      enquiry.status = req.body.status;
    }
    writeStore(store);
    res.json({ enquiry });
  });

  app.patch('/api/admin/catalogue/:id', requireAdmin, (req: Request, res: Response) => {
    const store = ensureStore();
    const item = store.catalogue.find((p) => p.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    if (typeof req.body?.inStock === 'boolean') {
      item.inStock = req.body.inStock;
    }
    if (typeof req.body?.priceDisplay === 'string' && req.body.priceDisplay.trim()) {
      item.priceDisplay = sanitizeText(req.body.priceDisplay, 40);
    }
    if (req.body?.basePrice !== undefined) {
      const bp = Number(req.body.basePrice);
      if (Number.isFinite(bp) && bp > 0 && bp <= 5000) {
        item.basePrice = Math.round(bp * 100) / 100;
      }
    }
    if (typeof req.body?.description === 'string' && req.body.description.trim()) {
      item.description = sanitizeText(req.body.description, 600);
    }
    if (typeof req.body?.leadTimeNote === 'string') {
      item.leadTimeNote = sanitizeText(req.body.leadTimeNote, 120);
    }
    if (Array.isArray(req.body?.variants)) {
      item.variants = req.body.variants
        .filter(
          (v: unknown): v is { id: string; label: string; price: number } =>
            typeof v === 'object' &&
            v !== null &&
            typeof (v as { label?: unknown }).label === 'string' &&
            Number.isFinite(Number((v as { price?: unknown }).price))
        )
        .slice(0, 8)
        .map((v: { id: string; label: string; price: number }, idx: number) => ({
          id: sanitizeText(v.id, 40) || `variant-${idx}`,
          label: sanitizeText(v.label, 80),
          price: Math.max(1, Math.round(Number(v.price) * 100) / 100),
        }));
    }
    if (typeof req.body?.primaryPhotoUrl === 'string' && req.body.primaryPhotoUrl.trim()) {
      const url = sanitizeText(req.body.primaryPhotoUrl, 300);
      if (url.startsWith('/') || url.startsWith('https://')) {
        if (item.media.length > 0) {
          item.media[0] = {
            ...item.media[0],
            type: url.endsWith('.mp4') ? 'video' : 'image',
            src: url,
          };
        } else {
          item.media.push({
            type: url.endsWith('.mp4') ? 'video' : 'image',
            src: url,
            alt: item.name,
            isAuthenticBrandWork: true,
            caption: `Candlelicious — ${item.name}`,
          });
        }
      }
    }

    writeStore(store);
    res.json({ item });
  });

  app.put('/api/admin/availability', requireAdmin, (req: Request, res: Response) => {
    const store = ensureStore();
    if (Array.isArray(req.body?.blockedDates)) {
      store.availability.blockedDates = req.body.blockedDates
        .filter((d: unknown): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d))
        .slice(0, 120);
    }
    if (req.body?.maxOrdersPerDay !== undefined) {
      const cap = Math.floor(Number(req.body.maxOrdersPerDay));
      if (Number.isFinite(cap) && cap >= 1 && cap <= 50) {
        store.availability.maxOrdersPerDay = cap;
      }
    }
    writeStore(store);
    res.json({ availability: store.availability });
  });

  // Vite Dev Middleware or Production Static Assets
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Candlelicious Amman atelier server listening on http://localhost:${PORT}`);
  });
}

startServer();
