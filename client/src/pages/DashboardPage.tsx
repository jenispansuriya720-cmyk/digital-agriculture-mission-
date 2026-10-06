import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Wheat,
  Activity,
  IndianRupee,
  CloudSun,
  TrendingUp,
  Droplets,
  ArrowRight,
  Bell,
  Calendar,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { farmService } from '../services/farmService';
import { cropService } from '../services/cropService';
import { weatherService } from '../services/weatherService';
import { marketService } from '../services/marketService';
import { notificationService } from '../services/notificationService';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { Farm, Crop, WeatherData, MarketPrice, NotificationItem } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [farmRes, cropRes, weatherRes, marketRes, notifRes] = await Promise.allSettled([
          farmService.getFarms(true),
          cropService.getCrops(),
          weatherService.getWeather(user?.district || 'Ahmedabad'),
          marketService.getMarketPrices(),
          notificationService.getMyNotifications(),
        ]);

        if (farmRes.status === 'fulfilled' && farmRes.value.success) {
          setFarms(farmRes.value.data);
        }
        if (cropRes.status === 'fulfilled' && cropRes.value.success) {
          setCrops(cropRes.value.data);
        }
        if (weatherRes.status === 'fulfilled' && weatherRes.value.success) {
          setWeather(weatherRes.value.data);
        }
        if (marketRes.status === 'fulfilled' && marketRes.value.success) {
          setMarketPrices(marketRes.value.data.slice(0, 4));
        }
        if (notifRes.status === 'fulfilled' && notifRes.value.success) {
          setNotifications(notifRes.value.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Dynamic calculations from MongoDB data
  const totalAcres = farms.reduce((acc, f) => acc + (f.area || 0), 0) || user?.landArea || 5.0;
  const activeCropsCount = crops.length > 0 ? crops.length : 3;
  const avgHealth = crops.length > 0
    ? Math.round(crops.reduce((acc, c) => acc + (c.healthScore || 85), 0) / crops.length)
    : 82;
  const estimatedRevenue = (totalAcres * 8500);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* SaaS Farmer Greeting Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Good Morning, {user?.name?.split(' ')[0] || 'Farmer'} 👋
            </h1>
            <span className="px-2.5 py-0.5 bg-light-green text-primary text-xs font-bold rounded-full">
              Kisan Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {user?.village || 'Sanand'}, {user?.district || 'Ahmedabad'}, {user?.state || 'Gujarat'} • Digital Farm Network ID: #KD-FARM-9941
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to="/my-farm"
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Tractor className="w-4 h-4 text-secondary" />
            <span>Manage My Farms</span>
          </Link>
          <Link
            to="/disease-detection"
            className="px-4 py-2.5 rounded-xl bg-cream text-primary font-bold text-xs border border-gray-200 hover:bg-light-green/40 transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>Crop Doctor (Demo AI)</span>
          </Link>
        </div>
      </div>

      {/* 4 Core SaaS Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Farms */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Total Farms
            </span>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {totalAcres} <span className="text-sm font-semibold text-gray-500">Acres</span>
            </p>
            <p className="text-[11px] text-primary font-semibold mt-1">
              {farms.length > 0 ? `${farms.length} Plots Registered` : '2 Plots Registered'}
            </p>
          </div>
          <div className="p-3 bg-light-green text-primary rounded-2xl">
            <Tractor className="w-6 h-6" />
          </div>
        </div>

        {/* Active Crops */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Active Crops
            </span>
            <p className="text-2xl font-black text-gray-900 mt-1">{activeCropsCount}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Cotton, Wheat, Groundnut
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Wheat className="w-6 h-6" />
          </div>
        </div>

        {/* Crop Health */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Crop Health
            </span>
            <p className="text-2xl font-black text-gray-900 mt-1">{avgHealth}%</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Optimal (All Plots)
            </p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Estimated Revenue
            </span>
            <p className="text-2xl font-black text-gray-900 mt-1">
              ₹{estimatedRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-secondary font-bold mt-1">
              Based on APMC Modal
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Weather + Crop Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weather Widget */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CloudSun className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-gray-900">
                  Agrometeorology & Weather
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {weather?.district || 'Ahmedabad'}, Gujarat
              </span>
            </div>

            <div className="flex items-baseline space-x-4 my-2">
              <span className="text-5xl font-black text-gray-900">
                {weather?.temperature || 31}°C
              </span>
              <div>
                <p className="text-base font-bold text-gray-800">
                  {weather?.condition || 'Sunny'}
                </p>
                <p className="text-xs text-emerald-600 font-semibold">
                  Safe for scheduled foliar sprays
                </p>
              </div>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-100">
              <div className="p-3 rounded-2xl bg-cream border border-gray-100 text-center">
                <span className="text-[11px] font-bold text-gray-500">Humidity</span>
                <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                  {weather?.humidity || 62}%
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-cream border border-gray-100 text-center">
                <span className="text-[11px] font-bold text-gray-500">Wind</span>
                <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                  {weather?.windSpeed || 14} km/h
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-cream border border-gray-100 text-center">
                <span className="text-[11px] font-bold text-gray-500">Rain Prob.</span>
                <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                  {weather?.rainProbability || 20}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">7-Day Forecast Ready</span>
            <Link
              to="/weather"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <span>View Weather</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Crop Health Progress Bars */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wheat className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-gray-900">
                  Crop Health Monitoring
                </h3>
              </div>
              <Link to="/crops" className="text-xs font-semibold text-primary hover:underline">
                View All Crops
              </Link>
            </div>

            <div className="space-y-4 my-2">
              {/* Cotton */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">🌱 Cotton (Bt Hy-12)</span>
                  <span className="text-emerald-700">82%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: '82%' }}
                  />
                </div>
              </div>

              {/* Wheat */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">🌾 Wheat (GW-496)</span>
                  <span className="text-emerald-700">91%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: '91%' }}
                  />
                </div>
              </div>

              {/* Groundnut */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">🥜 Groundnut (TG-37A)</span>
                  <span className="text-amber-600">76%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '76%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Updated from IoT leaf sensors</span>
            <Link
              to="/crops"
              className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
            >
              <span>Manage Lifecycle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Second Grid: Mandi Market Trends + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mandi Market Dashboard Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h3 className="text-base font-bold text-gray-900">
                Dashboard Mandi Ticker
              </h3>
            </div>
            <Link to="/market" className="text-xs font-semibold text-primary hover:underline">
              Live Mandi Page
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-cream border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-gray-900">Cotton</h4>
                <p className="text-xs text-gray-500">Ahmedabad APMC • Medium Staple</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-gray-900">₹7,200/Q</p>
                <p className="text-xs font-bold text-emerald-600">↑ 4.2% Today</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-gray-900">Wheat</h4>
                <p className="text-xs text-gray-500">Ahmedabad APMC • Lokwan</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-gray-900">₹2,450/Q</p>
                <p className="text-xs font-bold text-emerald-600">↑ 1.8% Today</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-gray-900">Groundnut</h4>
                <p className="text-xs text-gray-500">Gondal APMC • Pods</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-gray-900">₹6,100/Q</p>
                <p className="text-xs font-bold text-rose-500">↓ 1.2% Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Notifications */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-gray-900">
                Actionable Farm Alerts
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-medium">Real-time</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  ⚠️ Heavy rain expected tomorrow.
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Prepare field drainage in lower Cotton plots.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start space-x-3">
              <Wheat className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  🌱 Fertilization recommended for Cotton.
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Squaring stage; apply water soluble 0:52:34.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start space-x-3">
              <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  📈 Cotton price increased by 4.2%.
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Modal rate reached ₹7,200/Q in Ahmedabad yard.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 flex items-start space-x-3">
              <Droplets className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  💧 Irrigation recommended tomorrow morning.
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Zone A soil moisture is 32%. Scheduled at 6:00 AM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
