import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-24 md:pb-12 border-t border-dark-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6 text-secondary" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                KRISHI DIGITAL
              </span>
            </Link>
            <p className="text-sm font-semibold text-secondary">
              Digital Agriculture Mission
            </p>
            <p className="text-xs text-gray-300 max-w-sm leading-relaxed">
              One Platform. Every Farmer. Smarter Agriculture. Connecting Indian agriculture with smart IoT sensors, mandi transparency, advisory scientists, and verified government services.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Unified AgriStack & Krishi Ecosystem Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/my-farm" className="hover:text-secondary transition-colors">My Farm</Link>
              </li>
              <li>
                <Link to="/market" className="hover:text-secondary transition-colors">Market / Mandi</Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-secondary transition-colors">Government Schemes</Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-secondary transition-colors">Agri Marketplace</Link>
              </li>
              <li>
                <Link to="/knowledge" className="hover:text-secondary transition-colors">Knowledge Center</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">About Mission</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/crops" className="hover:text-secondary transition-colors">Crop Management</Link>
              </li>
              <li>
                <Link to="/soil-health" className="hover:text-secondary transition-colors">Soil Health</Link>
              </li>
              <li>
                <Link to="/weather" className="hover:text-secondary transition-colors">Weather Forecast</Link>
              </li>
              <li>
                <Link to="/disease-detection" className="hover:text-secondary transition-colors">Crop Doctor (Demo AI)</Link>
              </li>
              <li>
                <Link to="/irrigation" className="hover:text-secondary transition-colors">Smart Irrigation</Link>
              </li>
              <li>
                <Link to="/experts" className="hover:text-secondary transition-colors">Expert Advisory</Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Support & Contact
            </h4>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>1800-180-1551 (Kisan Helpline)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>support@krishidigital.gov.in</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>Ministry of Agriculture & Farmers Welfare, New Delhi / Gandhinagar</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-400">
              <p>Demo Admin: admin@krishidigital.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Krishi Digital — Digital Agriculture Mission. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
