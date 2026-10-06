import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tractor, TrendingUp, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const { totalItemCount } = useCart();

  const items = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Farm', path: user ? '/my-farm' : '/login', icon: Tractor },
    { name: 'Market', path: '/market', icon: TrendingUp },
    { name: 'Shop', path: '/marketplace', icon: ShoppingBag, badge: totalItemCount },
    { name: 'Profile', path: user ? '/profile' : '/login', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1 shadow-lg">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                  isActive ? 'text-primary font-bold' : 'text-gray-500 font-medium'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-secondary text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
