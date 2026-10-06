import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  Calendar,
  Sparkles,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { schemeService } from '../services/schemeService';
import { useAuth } from '../context/AuthContext';
import { Scheme } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

const SCHEME_CATEGORIES = [
  'All',
  'Financial Support',
  'Crop Insurance',
  'Equipment Subsidy',
  'Irrigation',
  'Soil Health',
  'Organic Farming',
];

export const SchemesPage: React.FC = () => {
  const { user } = useAuth();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  // "Find Schemes For Me" Recommendation Engine
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [recommendForm, setRecommendForm] = useState({
    state: user?.state || 'Gujarat',
    landArea: String(user?.landArea || '5'),
    crop: user?.primaryCrop || 'Cotton',
    farmerType: 'Small & Marginal Farmer',
    irrigationType: 'Drip Irrigation',
  });
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendedCount, setRecommendedCount] = useState<number | null>(null);

  const fetchSchemes = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const res = await schemeService.getSchemes(params);
      if (res.success && res.data) {
        setSchemes(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchemes();
  };

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecommending(true);
    try {
      const res = await schemeService.recommendSchemes({
        state: recommendForm.state,
        landArea: Number(recommendForm.landArea),
        crop: recommendForm.crop,
        farmerType: recommendForm.farmerType,
        irrigationType: recommendForm.irrigationType,
      });

      if (res.success && res.data) {
        setSchemes(res.data);
        setRecommendedCount(res.data.length);
        setIsRecommendOpen(false);
      }
    } catch (err) {
      alert('Error fetching tailored scheme recommendations');
    } finally {
      setIsRecommending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <Landmark className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Government Agriculture Schemes & Subsidies
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Direct DBT financial transfers, PMFBY insurance coverage, solar pumps, and micro-irrigation grants
          </p>
        </div>

        <button
          onClick={() => setIsRecommendOpen(!isRecommendOpen)}
          className="px-5 py-3 rounded-2xl bg-secondary text-primary-dark font-black text-xs sm:text-sm hover:bg-secondary-light transition-all flex items-center space-x-2 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Find Schemes For Me</span>
        </button>
      </div>

      {/* "Find Schemes For Me" Recommendation Panel */}
      {isRecommendOpen && (
        <div className="bg-gradient-to-br from-cream to-light-green/40 p-6 sm:p-8 rounded-3xl border border-secondary/30 shadow-soft animate-in fade-in slide-in-from-top-4">
          <div className="max-w-2xl mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Personalized Scheme Matcher
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Enter your land holding and crop details to automatically filter schemes where you qualify for direct subsidies.
            </p>
          </div>

          <form onSubmit={handleRecommendSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">State</label>
              <select
                value={recommendForm.state}
                onChange={(e) => setRecommendForm({ ...recommendForm, state: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
              >
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="All India">All India</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Land Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                value={recommendForm.landArea}
                onChange={(e) => setRecommendForm({ ...recommendForm, landArea: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Primary Crop</label>
              <input
                type="text"
                value={recommendForm.crop}
                onChange={(e) => setRecommendForm({ ...recommendForm, crop: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Farmer Type</label>
              <select
                value={recommendForm.farmerType}
                onChange={(e) => setRecommendForm({ ...recommendForm, farmerType: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
              >
                <option value="Small & Marginal Farmer">Small & Marginal Farmer (&lt; 5 Acres)</option>
                <option value="Medium Farmer">Medium Farmer (5 - 15 Acres)</option>
                <option value="Large Landholder">Large Landholder (&gt; 15 Acres)</option>
                <option value="Women Farmer">Women Farmer</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isRecommending}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all shadow-md disabled:opacity-50"
              >
                {isRecommending ? 'Matching...' : 'Show Matched Schemes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {SCHEME_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setRecommendedCount(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat && recommendedCount === null
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-cream'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes e.g. PM-KISAN, Drip, Solar pump..."
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

        <span className="text-xs text-gray-500 font-semibold hidden sm:inline-block">
          Showing {schemes.length} Schemes
        </span>
      </div>

      {/* Schemes Grid */}
      {isLoading ? (
        <SkeletonLoader rows={4} height="h-36" />
      ) : schemes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
          <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No matching schemes found</h3>
          <p className="text-xs text-gray-400 mt-1">Try resetting filters or searching with general terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => {
            const isExpanded = expandedScheme === scheme._id;

            return (
              <div
                key={scheme._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-light-green text-primary">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{scheme.deadline}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                    {scheme.title}
                  </h3>

                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Highlights Box */}
                  <div className="my-4 p-3.5 rounded-2xl bg-cream border border-gray-100">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Benefits Provided</p>
                    <p className="text-xs font-bold text-primary mt-0.5">{scheme.benefits}</p>
                  </div>

                  {/* Collapsible Details */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-gray-100 text-xs animate-in fade-in">
                      <div>
                        <p className="font-bold text-gray-800 mb-1">Eligibility Criteria:</p>
                        <ul className="space-y-1 text-gray-600">
                          {scheme.eligibility.map((el, idx) => (
                            <li key={idx} className="flex items-start space-x-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                              <span>{el}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {scheme.documents && scheme.documents.length > 0 && (
                        <div>
                          <p className="font-bold text-gray-800 mb-1">Required Documents:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {scheme.documents.map((doc, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[11px]"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedScheme(isExpanded ? null : scheme._id)}
                    className="text-xs font-semibold text-gray-600 hover:text-primary flex items-center space-x-1"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Details & Documents'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <a
                    href={scheme.applicationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-secondary" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
