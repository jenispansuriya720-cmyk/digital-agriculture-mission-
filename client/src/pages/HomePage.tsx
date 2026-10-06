import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
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
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { marketService } from '../services/marketService';
import { weatherService } from '../services/weatherService';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [mandiTicker, setMandiTicker] = useState<any[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);

  useEffect(() => {
    marketService.getMarketPrices().then((res) => {
      if (res.success && res.data) {
        setMandiTicker(res.data.slice(0, 6));
      }
    }).catch(() => {});

    weatherService.getWeather('Ahmedabad').then((res) => {
      if (res.success && res.data) {
        setCurrentWeather(res.data);
      }
    }).catch(() => {});
  }, []);

  const services = [
    {
      title: 'My Farm',
      desc: 'Digital farm boundaries, interactive SVG map, soil mapping, and IoT sensor telemetry.',
      icon: Tractor,
      path: user ? '/my-farm' : '/login',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Crop Management',
      desc: 'Track phenological growth stages, harvest forecasting, and customized fertilizer schedules.',
      icon: Wheat,
      path: '/crops',
      color: 'bg-green-50 text-green-800 border-green-200',
    },
    {
      title: 'Weather Forecast',
      desc: 'Hyperlocal 7-day agrometeorological forecast, humidity, rain probability, and weather alerts.',
      icon: CloudSun,
      path: '/weather',
      color: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      title: 'Soil Health',
      desc: 'Real-time NPK, pH, moisture analysis, digital soil cards, and replenishment advice.',
      icon: TestTube2,
      path: '/soil-health',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Disease Detection',
      desc: 'Crop Doctor: Instant photo analysis of crop leaves for pests, rusts, and fungal blights.',
      icon: Bug,
      path: '/disease-detection',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      badge: 'Demo AI',
    },
    {
      title: 'Smart Irrigation',
      desc: 'Automated water calculation, soil moisture thresholds, and scheduled drip pumping.',
      icon: Droplets,
      path: '/irrigation',
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    },
    {
      title: 'Market Prices',
      desc: 'Live Mandi prices across APMC yards with price trends, modal rates, and market comparisons.',
      icon: TrendingUp,
      path: '/market',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      title: 'Government Schemes',
      desc: 'Direct eligibility verification for PM-KISAN, PMFBY crop insurance, and solar pump subsidies.',
      icon: Landmark,
      path: '/schemes',
      color: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    {
      title: 'Agri Marketplace',
      desc: 'Purchase certified seeds, bio-pesticides, drip lateral kits, and farm machinery online.',
      icon: ShoppingBag,
      path: '/marketplace',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      title: 'Expert Advisory',
      desc: 'Direct consultation with agricultural scientists and extension specialists from top universities.',
      icon: GraduationCap,
      path: '/experts',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F0]">
      {/* Mandi Ticker Bar */}
      {mandiTicker.length > 0 && (
        <div className="bg-primary-dark text-white text-xs py-2 px-4 overflow-hidden border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-secondary uppercase tracking-wider text-[11px] flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live APMC Mandi Ticker:</span>
            </div>
            <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar ml-4 py-0.5">
              {mandiTicker.map((m) => (
                <div key={m._id} className="flex items-center space-x-1.5 flex-shrink-0">
                  <span className="font-semibold">{m.crop} ({m.market.split(' ')[0]}):</span>
                  <span className="font-bold text-white">₹{m.modalPrice.toLocaleString()}/Q</span>
                  <span
                    className={`text-[10px] font-bold px-1 rounded ${
                      m.trend === 'up' ? 'text-secondary' : m.trend === 'down' ? 'text-rose-300' : 'text-gray-300'
                    }`}
                  >
                    {m.trend === 'up' ? `↑ +${m.changePercent}%` : m.trend === 'down' ? `↓ ${m.changePercent}%` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background Decorative Rings */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-light-green/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-light-green border border-secondary/30 shadow-xs">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wide uppercase">
                  Digital Agriculture Mission • AgriStack Integrated
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172018] tracking-tight leading-[1.12]">
                {t.hero.heading}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                {t.hero.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={user ? '/my-farm' : '/register'}
                  className="px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md shadow-primary/25 hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Tractor className="w-4 h-4 text-secondary" />
                  <span>{t.hero.exploreFarm}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#services-section"
                  className="px-6 py-3.5 rounded-2xl bg-white text-primary font-bold text-sm hover:bg-cream border border-gray-200 shadow-sm hover:shadow transition-all"
                >
                  {t.hero.exploreServices}
                </a>
              </div>

              {/* Badges / Guarantees */}
              <div className="pt-6 border-t border-gray-200/80 flex flex-wrap items-center gap-6 text-xs text-gray-600 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Real-time Mandi Rates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>AI Crop Disease Diagnosis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Verified Govt Subsidies</span>
                </div>
              </div>
            </div>

            {/* Right Visual Dashboard Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Hero Illustration Card */}
                <div className="bg-white rounded-3xl p-6 shadow-soft-lg border border-gray-100 relative overflow-hidden">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800"
                      alt="Modern Digital Indian Farming"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white">
                        <span className="px-2 py-0.5 bg-secondary text-primary-dark font-extrabold text-[10px] rounded-full uppercase">
                          Smart Sensor Live
                        </span>
                        <h4 className="text-sm font-bold mt-1">Surya Green Farm • Ahmedabad</h4>
                      </div>
                    </div>
                  </div>

                  {/* Micro Sensors Overlay Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-cream rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                        <span>Soil Moisture</span>
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <p className="text-base font-extrabold text-primary mt-1">68%</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">Optimal for Cotton</p>
                    </div>

                    <div className="p-3 bg-cream rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                        <span>Cotton Mandi</span>
                        <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                      </div>
                      <p className="text-base font-extrabold text-gray-900 mt-1">₹7,200/Q</p>
                      <p className="text-[10px] text-secondary font-semibold">↑ +4.2% Today</p>
                    </div>
                  </div>
                </div>

                {/* Floating Notification Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-3 hidden sm:flex max-w-xs animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="p-2 rounded-xl bg-light-green text-primary">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Irrigation Alert</p>
                    <p className="text-[11px] text-gray-500">Scheduled 6:00 AM for Zone A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Quick Stats Cards */}
      <section className="py-6 relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Weather */}
          <Link
            to="/weather"
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                🌦 Weather
              </span>
              <span className="p-2 bg-sky-50 text-sky-600 rounded-xl group-hover:scale-110 transition-transform">
                <CloudSun className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {currentWeather ? `${currentWeather.temperature}°C` : '31°C'}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {currentWeather ? currentWeather.district : 'Ahmedabad'}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {currentWeather ? currentWeather.condition : 'Sunny'}
              </span>
            </div>
          </Link>

          {/* Market */}
          <Link
            to="/market"
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                📈 Market
              </span>
              <span className="p-2 bg-emerald-50 text-primary rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-extrabold text-gray-900">₹7,200/Q</p>
                <p className="text-xs text-gray-500 font-medium">Cotton • Ahmedabad</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                ↑ +4.2%
              </span>
            </div>
          </Link>

          {/* Crop Health */}
          <Link
            to="/crops"
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                🌱 Crop Health
              </span>
              <span className="p-2 bg-light-green text-primary rounded-xl group-hover:scale-110 transition-transform">
                <Wheat className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-extrabold text-gray-900">82%</p>
                <p className="text-xs text-gray-500 font-medium">3 Active Crops</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-light-green px-2 py-0.5 rounded-md">
                Healthy
              </span>
            </div>
          </Link>

          {/* Soil Moisture */}
          <Link
            to="/soil-health"
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                💧 Soil Moisture
              </span>
              <span className="p-2 bg-cyan-50 text-cyan-600 rounded-xl group-hover:scale-110 transition-transform">
                <Droplets className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-extrabold text-gray-900">68%</p>
                <p className="text-xs text-gray-500 font-medium">Zone A Field</p>
              </div>
              <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                Optimal
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-light-green text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Digital Mission Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172018] tracking-tight">
            Complete Smart Farming Ecosystem
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Integrated tools designed specifically for Indian agriculture, connecting farm boundaries, IoT telemetry, Mandi markets, and scientific advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <Link
                key={srv.title}
                to={srv.path}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${srv.color} border shadow-xs group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {srv.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        {srv.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works (5 Steps) */}
      <section className="py-20 bg-cream border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Seamless Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-[#172018] tracking-tight mt-1">
              How Krishi Digital Works
            </h2>
            <p className="text-xs text-gray-600 mt-2">
              Transform your traditional farm into an intelligent, digitized agriculture hub in five easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              { step: '01', title: 'Register', desc: 'Create your digital farmer profile with Aadhaar & mobile.' },
              { step: '02', title: 'Add Your Farm', desc: 'Define your village, acreage, water sources, and coordinates.' },
              { step: '03', title: 'Add Crops', desc: 'Select varieties, sowing dates, and growth stages.' },
              { step: '04', title: 'Monitor Farm', desc: 'Receive real-time weather, soil NPK, and moisture telemetry.' },
              { step: '05', title: 'Smart Advice', desc: 'Get AI disease diagnosis, scheme matching, and best Mandi rates.' },
            ].map((st, i) => (
              <div
                key={st.step}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-secondary/70 tracking-tight font-sans">
                    {st.step}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 mt-2">{st.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{st.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] font-bold text-primary flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                  <span>Step {i + 1} of 5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 sm:p-14 text-white shadow-soft-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-96 h-96 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-secondary text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>National Mission Alignment</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Our Digital Agriculture Mission
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Krishi Digital aims to empower farmers through accessible digital technology, trusted agricultural information, market connectivity, expert advisory, and smart farming solutions. By bridging the gap between field sensors and government welfare architecture, every Indian farmer is equipped to make data-driven, sustainable decisions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
              <div>
                <p className="text-2xl font-black text-secondary">100%</p>
                <p className="text-xs text-emerald-200 mt-0.5">DBT Government Subsidies</p>
              </div>
              <div>
                <p className="text-2xl font-black text-secondary">20+ APMC</p>
                <p className="text-xs text-emerald-200 mt-0.5">Live Mandi Linkages</p>
              </div>
              <div>
                <p className="text-2xl font-black text-secondary">24/7</p>
                <p className="text-xs text-emerald-200 mt-0.5">Kisan Support & AI Care</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="px-6 py-3 rounded-xl bg-secondary text-primary-dark font-bold text-xs sm:text-sm hover:bg-secondary-light transition-all shadow-md"
              >
                Join the Mission Today
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition-all border border-white/20"
              >
                Read Mission Document
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
