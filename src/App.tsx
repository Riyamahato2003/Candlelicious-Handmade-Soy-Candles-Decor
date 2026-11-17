import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { BoutiqueHeader } from './components/BoutiqueHeader';
import { BoutiqueFooter } from './components/BoutiqueFooter';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { VideosPage } from './pages/VideosPage';
import { StoryPage } from './pages/StoryPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#1C110E]">
          <BoutiqueHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/build-your-gift" element={<Navigate to="/videos" replace />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BoutiqueFooter />
          <CartDrawer />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}
