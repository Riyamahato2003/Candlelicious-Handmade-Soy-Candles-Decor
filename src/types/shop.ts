export type CollectionSlug =
  | 'bouquet-arrangements'
  | 'wooden-dough-bowls'
  | 'ceramic-vessels'
  | 'seasonal-sculptures'
  | 'apothecary-jars'
  | 'events-and-favours';

export type OccasionName =
  | 'Birthdays'
  | 'Weddings'
  | 'Graduations'
  | 'Housewarming'
  | 'Romance'
  | 'Autumn & Seasonal'
  | 'Bespoke Events';

export interface ProductMedia {
  type: 'image' | 'video';
  src: string;
  alt: string;
  isAuthenticBrandWork: boolean;
  caption: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

export interface CatalogueItem {
  id: string;
  slug: string;
  name: string;
  collection: CollectionSlug;
  collectionTitle: string;
  occasions: OccasionName[];
  priceDisplay: string;
  isFromPrice: boolean;
  isIndicativeRange: boolean;
  basePrice: number;
  variants: ProductVariant[];
  colourOptions: string[];
  skirtOptionAvailable: boolean;
  inStock: boolean;
  featured: boolean;
  leadTimeNote: string;
  description: string;
  craftDetails: string[];
  media: ProductMedia[];
}

export interface BagItem {
  id: string;
  productId: string;
  slug: string;
  productName: string;
  imageSrc: string;
  variantId?: string;
  variantLabel?: string;
  colourChoice?: string;
  skirtWrapping?: boolean;
  occasion: OccasionName;
  personalisedMessage: boolean;
  personalisedMessageText: string;
  customTopper: boolean;
  customTopperText: string;
  quantity: number;
  baseUnitPrice: number;
  personalisationUnitFee: number;
  unitTotal: number;
  pendingQuoteFlags: string[];
}

export type OrderStatus =
  | 'New Request'
  | 'Quoted'
  | 'Confirmed'
  | 'In Preparation'
  | 'Ready / Dispatched'
  | 'Completed'
  | 'Cancelled';

export type FulfilmentMethod = 'pickup' | 'amman_courier';

export interface OrderRequest {
  id: string;
  referenceCode: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  items: BagItem[];
  knownSubtotal: number;
  fulfilmentMethod: FulfilmentMethod;
  preferredDate: string;
  deliveryArea: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    instagramHandle: string;
  };
  recipient: {
    name: string;
    giftNote: string;
  };
  demoPaymentStatus: 'sample_request_unpaid';
  stripeReadyNote: string;
  pendingConfirmationNotes: string[];
  adminNotes: string;
  finalQuoteJod: number | null;
}

export interface AvailabilityConfig {
  blockedDates: string[];
  maxOrdersPerDay: number;
  dateCounts: Record<string, number>;
}

export interface CustomerEnquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  instagramHandle: string;
  occasion: string;
  preferredDate: string;
  message: string;
  status: 'New' | 'Replied';
}

export const PERSONALISED_MESSAGE_FEE = 3;
export const CUSTOM_TOPPER_FEE = 5;
