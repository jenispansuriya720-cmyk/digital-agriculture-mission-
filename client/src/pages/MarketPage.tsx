import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { marketService } from '../services/marketService';
import { MarketPrice } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const MarketPage: React.FC = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchCrop, setSearchCrop] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedState, setSelectedState] = useState('All');

  const fetchPrices = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (searchCrop.trim()) params.crop = searchCrop.trim();
      if (selectedDistrict !== 'All') params.district = selectedDistrict;
      if (selectedState !== 'All') params.state = selectedState;

      const res = await marketService.getMarketPrices(params);
      if (res.success && res.data) {
        setPrices(res.data);
        setMeta(res.meta);
        if (res.data.length > 0 && !selectedCrop) {
          setSelectedCrop(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedDistrict, selectedState]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrices();
  };

  // Comparison bar chart data for top 5 crops
  const comparisonData = prices.slice(0, 6).map((p) => ({
    name: `${p.crop} (${p.market.split(' ')[0]})`,
    modal: p.modalPrice,
    min: p.minPrice,
    max: p.maxPrice,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              APMC Mandi Intelligence & Prices
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time modal price benchmarks, daily price swings, and market comparisons across Agricultural Produce Market Committees
          </p>
        </div>

        {/* Best Market Highlight Card */}
        {meta?.bestMarket && (
          <div className="p-4 rounded-2xl bg-cream border border-gray-200/80 flex items-center space-x-3.5 shadow-xs">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Peak Modal Benchmark</p>
              <p className="text-sm font-extrabold text-gray-900">
                {meta.bestMarket.crop} • ₹{meta.bestMarket.modalPrice.toLocaleString()}/Q
              </p>
              <p className="text-[11px] text-primary font-semibold">{meta.bestMarket.market}</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchCrop}
              onChange={(e) => setSearchCrop(e.target.value)}
              placeholder="Search crop e.g. Cotton, Wheat..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-primary font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-gray-500">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>District:</span>
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white font-medium"
          >
            <option value="All">All Districts</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Rajkot">Rajkot</option>
            <option value="Mehsana">Mehsana</option>
            <option value="Vadodara">Vadodara</option>
            <option value="Junagadh">Junagadh</option>
            <option value="Surat">Surat</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white font-medium"
          >
            <option value="All">All States</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
          </select>
        </div>
      </div>

      {/* Selected Crop Price Trend Chart */}
      {selectedCrop && selectedCrop.priceHistory && selectedCrop.priceHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Historical Price Trend
                </span>
                <span className="px-2 py-0.5 bg-light-green text-primary text-xs font-bold rounded-full">
                  {selectedCrop.crop} ({selectedCrop.variety})
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                {selectedCrop.market} • Modal Price: ₹{selectedCrop.modalPrice.toLocaleString()}/Q
              </h3>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center space-x-1 text-sm font-bold px-3 py-1 rounded-xl ${
                  selectedCrop.trend === 'up'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selectedCrop.trend === 'down'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {selectedCrop.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>
                  {selectedCrop.trend === 'up'
                    ? `+${selectedCrop.changePercent}% Trend`
                    : `${selectedCrop.changePercent}% Trend`}
                </span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedCrop.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  domain={['dataMin - 100', 'dataMax + 100']}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  unit="₹"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Modal Price']}
                />
                <Line
                  type="monotone"
                  dataKey="modalPrice"
                  stroke="#166534"
                  strokeWidth={3}
                  dot={{ fill: '#22C55E', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Mandi Prices Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">
            Daily APMC Price Board ({prices.length} Records)
          </h3>
          <span className="text-xs text-gray-500 font-medium">Click any row to chart price history</span>
        </div>

        {isLoading ? (
          <SkeletonLoader rows={5} height="h-14" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/60">
                  <th className="py-3 px-4 rounded-l-xl">Crop & Variety</th>
                  <th className="py-3 px-4">Market / APMC</th>
                  <th className="py-3 px-4">Min Price</th>
                  <th className="py-3 px-4">Max Price</th>
                  <th className="py-3 px-4">Modal Price</th>
                  <th className="py-3 px-4 rounded-r-xl">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prices.map((p) => {
                  const isSelected = selectedCrop?._id === p._id;
                  return (
                    <tr
                      key={p._id}
                      onClick={() => setSelectedCrop(p)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-light-green/40 font-bold' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {p.crop}
                        <span className="block text-[11px] font-normal text-gray-500">
                          {p.variety}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        {p.market}
                        <span className="block text-[11px] text-gray-400">{p.district}, {p.state}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-semibold">
                        ₹{p.minPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-semibold">
                        ₹{p.maxPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-black text-gray-900 text-sm">
                        ₹{p.modalPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            p.trend === 'up'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.trend === 'down'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '—'}
                          <span>{p.changePercent > 0 ? `+${p.changePercent}%` : `${p.changePercent}%`}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Market Comparison Bar Chart */}
      {comparisonData.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Cross-Market Modal Comparison
              </h3>
              <p className="text-xs text-gray-500">
                Compare price spreads across regional mandis to identify the most lucrative selling yard
              </p>
            </div>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="₹" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="modal" name="Modal Rate (₹/Q)" fill="#166534" radius={[6, 6, 0, 0]} />
                <Bar dataKey="min" name="Min Rate (₹/Q)" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="max" name="Max Rate (₹/Q)" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
