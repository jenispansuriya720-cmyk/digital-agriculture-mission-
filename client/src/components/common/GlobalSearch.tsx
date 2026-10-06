import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sprout, ShoppingBag, Landmark, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import api from '../../services/api';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    crops: any[];
    products: any[];
    schemes: any[];
    articles: any[];
    experts: any[];
  }>({ crops: [], products: [], schemes: [], articles: [], experts: [] });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ crops: [], products: [], schemes: [], articles: [], experts: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [cropsRes, prodsRes, schemesRes, articlesRes, expertsRes] = await Promise.allSettled([
          api.get(`/crops?crop=${encodeURIComponent(query)}`),
          api.get(`/products?search=${encodeURIComponent(query)}`),
          api.get(`/schemes?search=${encodeURIComponent(query)}`),
          api.get(`/articles?search=${encodeURIComponent(query)}`),
          api.get(`/experts?specialization=${encodeURIComponent(query)}`),
        ]);

        setResults({
          crops: cropsRes.status === 'fulfilled' ? cropsRes.value.data.data.slice(0, 3) : [],
          products: prodsRes.status === 'fulfilled' ? prodsRes.value.data.data.slice(0, 3) : [],
          schemes: schemesRes.status === 'fulfilled' ? schemesRes.value.data.data.slice(0, 3) : [],
          articles: articlesRes.status === 'fulfilled' ? articlesRes.value.data.data.slice(0, 3) : [],
          experts: expertsRes.status === 'fulfilled' ? expertsRes.value.data.data.slice(0, 3) : [],
        });
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.crops.length +
    results.products.length +
    results.schemes.length +
    results.articles.length +
    results.experts.length;

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-20">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 'cotton', 'urea', 'irrigation', 'subsidy', 'expert'..."
            className="w-full bg-transparent text-sm sm:text-base outline-none text-gray-800 placeholder-gray-400 font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-gray-200 rounded-full text-gray-400 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="py-8 text-center text-xs text-gray-500 font-medium">
              Searching agricultural database...
            </div>
          )}

          {!isLoading && query && totalResults === 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">
              No results found for &ldquo;<span className="font-semibold text-gray-800">{query}</span>&rdquo;. Try searching for &lsquo;cotton&rsquo;, &lsquo;wheat&rsquo;, &lsquo;seeds&rsquo;, or &lsquo;scheme&rsquo;.
            </div>
          )}

          {!query && (
            <div className="py-6 px-2 text-center">
              <Sprout className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800">Unified Agriculture Search</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Quickly discover crops, certified marketplace inputs, mandi rates, government subsidies, and expert agronomists.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {['Cotton', 'Wheat', 'Fertilizer', 'Drip', 'PM-KISAN', 'Tomato'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs bg-light-green/60 text-primary font-medium rounded-lg hover:bg-light-green transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Crops */}
          {results.crops.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Sprout className="w-3.5 h-3.5 text-primary" />
                <span>Crops</span>
              </div>
              <div className="space-y-1">
                {results.crops.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => handleSelect('/crops')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-light-green/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{c.icon || '🌱'}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{c.cropName} ({c.variety})</p>
                        <p className="text-[11px] text-gray-500">{c.growthStage} stage • Health: {c.healthScore}%</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketplace Products */}
          {results.products.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <ShoppingBag className="w-3.5 h-3.5 text-secondary" />
                <span>Marketplace Products</span>
              </div>
              <div className="space-y-1">
                {results.products.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => handleSelect('/marketplace')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-light-green/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{p.name}</p>
                        <p className="text-[11px] text-gray-500">₹{p.price} • {p.brand}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schemes */}
          {results.schemes.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Landmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Government Schemes</span>
              </div>
              <div className="space-y-1">
                {results.schemes.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => handleSelect('/schemes')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{s.title}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{s.benefits}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Articles */}
          {results.articles.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Knowledge & Guides</span>
              </div>
              <div className="space-y-1">
                {results.articles.map((a) => (
                  <div
                    key={a._id}
                    onClick={() => handleSelect(`/knowledge/${a.slug}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{a.title}</p>
                      <p className="text-[11px] text-gray-500">{a.category} • {a.readTime}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experts */}
          {results.experts.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span>Agronomists & Scientists</span>
              </div>
              <div className="space-y-1">
                {results.experts.map((e) => (
                  <div
                    key={e._id}
                    onClick={() => handleSelect('/experts')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img src={e.avatar} alt={e.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{e.name}</p>
                        <p className="text-[11px] text-gray-500">{e.title} • ⭐ {e.rating}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
