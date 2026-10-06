import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  Wheat,
  CloudSun,
  TestTube2,
  Bug,
  Droplets,
  TrendingUp,
  ShoppingBag,
  Landmark,
  GraduationCap,
  BookOpen,
  PackageCheck,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { name: t.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.myFarm, path: '/my-farm', icon: Tractor },
    { name: t.nav.crops, path: '/crops', icon: Wheat },
    { name: t.nav.weather, path: '/weather', icon: CloudSun },
    { name: t.nav.soil, path: '/soil-health', icon: TestTube2 },
    { name: t.nav.disease, path: '/disease-detection', icon: Bug, badge: 'Demo AI' },
    { name: t.nav.irrigation, path: '/irrigation', icon: Droplets },
    { name: t.nav.market, path: '/market', icon: TrendingUp },
    { name: t.nav.marketplace, path: '/marketplace', icon: ShoppingBag },
    { name: t.nav.orders, path: '/orders', icon: PackageCheck },
    { name: t.nav.schemes, path: '/schemes', icon: Landmark },
    { name: t.nav.advisory, path: '/experts', icon: GraduationCap },
    { name: t.nav.knowledge, path: '/knowledge', icon: BookOpen },
    { name: t.nav.profile, path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-4.5rem)] sticky top-18 overflow-y-auto hidden md:flex py-4 px-3">
      {/* Farmer Mini Profile Badge */}
      {user && (
        <div className="mb-4 px-3 py-3 rounded-2xl bg-cream border border-gray-100 flex items-center space-x-3">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=150'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-secondary"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-gray-900 truncate">{user.name}</h4>
            <p className="text-[11px] text-gray-500 truncate">
              {user.landArea} Acres • {user.primaryCrop}
            </p>
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Admin Link if authorized */}
        {user?.role === 'admin' && (
          <div className="pt-3 mt-3 border-t border-gray-100">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Administration
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                }`
              }
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Admin Management</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-100 px-3">
        <p className="text-[10px] text-gray-400 font-medium">Digital Agriculture Mission</p>
        <p className="text-[10px] text-gray-400">v1.0 • Connected to MongoDB</p>
      </div>
    </aside>
  );
};
