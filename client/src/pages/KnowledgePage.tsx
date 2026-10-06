import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Clock,
  Eye,
  ArrowRight,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import { articleService } from '../services/articleService';
import { Article } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

const KNOWLEDGE_CATEGORIES = [
  'All',
  'Crop Guides',
  'Organic Farming',
  'Soil Health',
  'Water Management',
  'Pest Management',
  'Modern Farming',
  'Government Updates',
];

export const KnowledgePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const res = await articleService.getArticles(params);
      if (res.success && res.data) {
        setArticles(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = articles.filter((a) => a._id !== featuredArticle?._id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Knowledge Center & Farm Guides
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Scientifically validated agronomic guides, pest management bulletins, and government scheme updates
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {KNOWLEDGE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
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
              placeholder="Search guides e.g. soil health, cotton irrigation, bio-pest..."
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
          {articles.length} Guides Available
        </span>
      </div>

      {isLoading ? (
        <SkeletonLoader rows={4} height="h-40" />
      ) : (
        <>
          {/* Featured Article Card */}
          {featuredArticle && !search && selectedCategory === 'All' && (
            <Link
              to={`/knowledge/${featuredArticle.slug}`}
              className="block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-6 aspect-video lg:aspect-auto">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                        ★ Featured Extension Guide
                      </span>
                      <span className="text-xs text-primary font-bold">
                        {featuredArticle.category}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {featuredArticle.summary}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span>By <strong>{featuredArticle.author}</strong></span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{featuredArticle.readTime}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{featuredArticle.viewsCount} views</span>
                      </span>
                    </div>

                    <span className="text-xs font-bold text-primary flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Guide</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Regular Articles Grid */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Latest Agronomic Articles ({regularArticles.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <Link
                  key={article._id}
                  to={`/knowledge/${article.slug}`}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-primary shadow-xs">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-gray-50 mt-auto flex items-center justify-between text-[11px] text-gray-400">
                    <span className="truncate">{article.author}</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.viewsCount} views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
