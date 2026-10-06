import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  Bell,
  Globe,
  ShoppingCart,
  User as UserIcon,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { user, logout } = useAuth();
  const { totalItemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Fetch notifications if user is logged in
  useEffect(() => {
    if (user) {
      notificationService
        .getMyNotifications()
        .then((res) => {
          if (res.success) {
            setNotifications(res.data);
            setUnreadCount(res.unreadCount);
          }
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLanguageOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotificationsOpen(false);
      if (link) navigate(link);
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  // Authenticated full navigation links
  const authNavLinks = [
    { name: t.nav.home || 'Home', path: '/dashboard' },
    { name: t.nav.myFarm, path: '/my-farm' },
    { name: t.nav.crops, path: '/crops' },
    { name: t.nav.market, path: '/market' },
    { name: t.nav.schemes, path: '/schemes' },
    { name: t.nav.marketplace, path: '/marketplace' },
    { name: t.nav.advisory, path: '/experts' },
    { name: t.nav.knowledge, path: '/knowledge' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2.5 group">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-secondary animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg text-primary tracking-tight font-sans">
                    KRISHI DIGITAL
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-light-green text-primary rounded-full uppercase tracking-wider">
                    Govt Mission
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium tracking-tight -mt-0.5 hidden sm:block">
                  Digital Agriculture Mission
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links — ONLY shown for authenticated users */}
          {user && (
            <nav className="hidden lg:flex items-center space-x-1">
              {authNavLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-light-green/60 font-semibold'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Header Icons & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger (Always visible for both public and logged-in) */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors flex items-center"
              title="Search platform (Ctrl + K)"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart — Authenticated users only */}
            {user && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notifications Dropdown — Authenticated users only */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-lg border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800 text-sm">
                          Farm Alerts & Updates
                        </span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => handleMarkAsRead(n._id, n.link)}
                            className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                              !n.isRead ? 'bg-emerald-50/40' : ''
                            }`}
                          >
                            <div className="p-2 rounded-xl bg-light-green text-primary flex-shrink-0 mt-0.5">
                              <Sprout className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 leading-snug">
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-1 inline-block">
                                Just now
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 text-center border-t border-gray-100">
                      <Link
                        to="/dashboard"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View Dashboard & Alerts
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Selector (Always visible for both public and logged-in) */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span>
                  {language === 'en' ? 'English' : language === 'gu' ? 'ગુજરાતી' : 'हिन्दी'}
                </span>
              </button>

              {languageOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-1.5 z-50">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLanguageOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 ${
                      language === 'en' ? 'font-bold text-primary bg-light-green/40' : 'text-gray-700'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('gu');
                      setLanguageOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 ${
                      language === 'gu' ? 'font-bold text-primary bg-light-green/40' : 'text-gray-700'
                    }`}
                  >
                    <span>ગુજરાતી (Gujarati)</span>
                    {language === 'gu' && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setLanguageOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 ${
                      language === 'hi' ? 'font-bold text-primary bg-light-green/40' : 'text-gray-700'
                    }`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {language === 'hi' && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown (Logged in) OR Login & Register (Logged out) */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=150'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                  />
                  <span className="text-xs font-semibold text-gray-800 hidden md:inline-block max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="px-2 py-0.5 bg-light-green text-primary text-[10px] font-bold rounded-full capitalize">
                          {user.role}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          • {user.village}, {user.district}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-2 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      <span>{t.nav.dashboard}</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-2 font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-primary" />
                      <span>{t.nav.profile}</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 flex items-center space-x-2 font-semibold"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Admin Management</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-light-green/50 rounded-lg transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm hover:shadow transition-all"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {user ? (
            /* Logged-In Mobile Menu: Complete Dashboard Navigation */
            <div className="space-y-1">
              <div className="px-3 py-2 mb-2 bg-cream rounded-xl border border-gray-100 flex items-center space-x-3">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=150'}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-primary"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{user.role} • {user.district}</p>
                </div>
              </div>

              {authNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary bg-light-green/60 font-semibold'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-100 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  👤 {t.nav.profile}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  🛒 Cart ({totalItemCount})
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                  >
                    🛡️ Admin Management
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  🚪 {t.nav.logout}
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out Mobile Menu: Public Options Only */
            <div className="space-y-3 pt-1">
              <p className="text-xs text-gray-500 px-1">
                Welcome to Krishi Digital — Sign in to manage your crops, land telemetry, and Mandi intelligence.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl border border-primary text-primary font-bold text-xs text-center hover:bg-light-green/40 transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-primary text-white font-bold text-xs text-center hover:bg-primary-dark shadow-sm transition-colors"
                >
                  {t.nav.register}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
