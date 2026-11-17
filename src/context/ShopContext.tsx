import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CATALOGUE_SEED } from '../data/catalogueSeed';
import type { AvailabilityConfig, BagItem, CatalogueItem } from '../types/shop';

const BAG_STORAGE_KEY = 'candlelicious_bag_v1';

interface ShopContextValue {
  catalogue: CatalogueItem[];
  catalogueLoading: boolean;
  catalogueError: string | null;
  availability: AvailabilityConfig;
  bag: BagItem[];
  bagCount: number;
  bagKnownSubtotal: number;
  isBagOpen: boolean;
  setIsBagOpen: (open: boolean) => void;
  addToBag: (item: BagItem, openDrawer?: boolean) => void;
  updateBagQuantity: (itemId: string, quantity: number) => void;
  removeFromBag: (itemId: string) => void;
  clearBag: () => void;
  refreshCatalogue: () => Promise<void>;
  refreshAvailability: () => Promise<void>;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>(CATALOGUE_SEED);
  const [catalogueLoading, setCatalogueLoading] = useState<boolean>(true);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);

  const [availability, setAvailability] = useState<AvailabilityConfig>({
    blockedDates: [],
    maxOrdersPerDay: 6,
    dateCounts: {},
  });

  const [bag, setBag] = useState<BagItem[]>(() => {
    try {
      const saved = localStorage.getItem(BAG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage parsing errors
    }
    return [];
  });

  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bag));
    } catch {
      // Ignore storage quota errors
    }
  }, [bag]);

  const refreshCatalogue = useCallback(async () => {
    setCatalogueLoading(true);
    setCatalogueError(null);
    try {
      const res = await fetch('/api/catalogue');
      if (!res.ok) throw new Error('Unable to load catalogue');
      const data = await res.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        setCatalogue(data.items);
      }
    } catch (err) {
      setCatalogueError(err instanceof Error ? err.message : 'Unable to reach atelier catalogue');
    } finally {
      setCatalogueLoading(false);
    }
  }, []);

  const refreshAvailability = useCallback(async () => {
    try {
      const res = await fetch('/api/availability');
      if (!res.ok) return;
      const data = await res.json();
      setAvailability({
        blockedDates: Array.isArray(data.blockedDates) ? data.blockedDates : [],
        maxOrdersPerDay: Number(data.maxOrdersPerDay) || 6,
        dateCounts: data.dateCounts || {},
      });
    } catch {
      // Silent fallback to defaults
    }
  }, []);

  useEffect(() => {
    refreshCatalogue();
    refreshAvailability();
  }, [refreshCatalogue, refreshAvailability]);

  const addToBag = useCallback((newItem: BagItem, openDrawer = true) => {
    setBag((prev) => {
      const matchIdx = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId &&
          item.colourChoice === newItem.colourChoice &&
          item.skirtWrapping === newItem.skirtWrapping &&
          item.occasion === newItem.occasion &&
          item.personalisedMessage === newItem.personalisedMessage &&
          item.personalisedMessageText === newItem.personalisedMessageText &&
          item.customTopper === newItem.customTopper &&
          item.customTopperText === newItem.customTopperText
      );
      if (matchIdx > -1) {
        const next = [...prev];
        next[matchIdx] = {
          ...next[matchIdx],
          quantity: Math.min(50, next[matchIdx].quantity + newItem.quantity),
        };
        return next;
      }
      return [newItem, ...prev];
    });
    if (openDrawer) setIsBagOpen(true);
  }, []);

  const updateBagQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setBag((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setBag((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.min(50, quantity) } : item
      )
    );
  }, []);

  const removeFromBag = useCallback((itemId: string) => {
    setBag((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearBag = useCallback(() => {
    setBag([]);
  }, []);

  const bagCount = bag.reduce((sum, item) => sum + item.quantity, 0);
  const bagKnownSubtotal = bag.reduce((sum, item) => sum + item.unitTotal * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        catalogue,
        catalogueLoading,
        catalogueError,
        availability,
        bag,
        bagCount,
        bagKnownSubtotal,
        isBagOpen,
        setIsBagOpen,
        addToBag,
        updateBagQuantity,
        removeFromBag,
        clearBag,
        refreshCatalogue,
        refreshAvailability,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
}
