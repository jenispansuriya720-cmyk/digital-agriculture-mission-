import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';
import { GlobalSearch } from './components/common/GlobalSearch';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyFarmPage } from './pages/MyFarmPage';
import { CropsPage } from './pages/CropsPage';
import { WeatherPage } from './pages/WeatherPage';
import { SoilHealthPage } from './pages/SoilHealthPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { MarketPage } from './pages/MarketPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { SchemesPage } from './pages/SchemesPage';
import { ExpertsPage } from './pages/ExpertsPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Inner layout component to handle sidebar vs full width
const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Pages that display sidebar layout for SaaS experience
  const isDashboardRoute = [
    '/dashboard',
    '/my-farm',
    '/crops',
    '/weather',
    '/soil-health',
    '/disease-detection',
    '/irrigation',
    '/market',
    '/marketplace',
    '/schemes',
    '/experts',
    '/knowledge',
    '/profile',
    '/orders',
    '/cart',
    '/admin',
  ].some((path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path)));

  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F0] text-[#172018]">
      {/* Top Navigation */}
      {!isAuthRoute && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

      {/* Global Search Dialog */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Body */}
      <div className="flex-1 flex">
        {isDashboardRoute && !isAuthRoute && <Sidebar />}

        <main className="flex-1 w-full min-w-0 pb-16 md:pb-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-farm" element={<MyFarmPage />} />
            <Route path="/crops" element={<CropsPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/soil-health" element={<SoilHealthPage />} />
            <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
            <Route path="/irrigation" element={<IrrigationPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/experts" element={<ExpertsPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/knowledge/:slug" element={<ArticleDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {/* Footer (on landing and content pages) */}
      {!isDashboardRoute && !isAuthRoute && <Footer />}

      {/* Mobile Bottom Navigation Bar */}
      {!isAuthRoute && <BottomNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <Router>
            <AppLayout />
          </Router>
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
