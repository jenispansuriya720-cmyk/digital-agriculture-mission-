import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';
import { GlobalSearch } from './components/common/GlobalSearch';
import { ProtectedRoute } from './components/common/ProtectedRoute';

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
  const { user } = useAuth();
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
      {/* Top Navigation: adapts automatically based on authentication status */}
      {!isAuthRoute && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

      {/* Global Search Dialog */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Body */}
      <div className="flex-1 flex">
        {isDashboardRoute && !isAuthRoute && user && <Sidebar />}

        <main className="flex-1 w-full min-w-0 pb-16 md:pb-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Protected Dashboard Routes — Require Login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-farm"
              element={
                <ProtectedRoute>
                  <MyFarmPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crops"
              element={
                <ProtectedRoute>
                  <CropsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <WeatherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/soil-health"
              element={
                <ProtectedRoute>
                  <SoilHealthPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/disease-detection"
              element={
                <ProtectedRoute>
                  <DiseaseDetectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/irrigation"
              element={
                <ProtectedRoute>
                  <IrrigationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/market"
              element={
                <ProtectedRoute>
                  <MarketPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <MarketplacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schemes"
              element={
                <ProtectedRoute>
                  <SchemesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/experts"
              element={
                <ProtectedRoute>
                  <ExpertsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/knowledge"
              element={
                <ProtectedRoute>
                  <KnowledgePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/knowledge/:slug"
              element={
                <ProtectedRoute>
                  <ArticleDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {/* Footer on public landing and content pages */}
      {!isDashboardRoute && !isAuthRoute && <Footer />}

      {/* Mobile Bottom Navigation Bar (Shown only for authenticated users) */}
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
