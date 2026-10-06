import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  User,
  Share2,
  Bookmark,
  CheckCircle2,
  Sprout,
} from 'lucide-react';
import { articleService } from '../services/articleService';
import { Article } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      articleService
        .getArticle(slug)
        .then((res) => {
          if (res.success && res.data) {
            setArticle(res.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <SkeletonLoader rows={6} height="h-28" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <h3 className="text-lg font-bold text-gray-800">Article not found</h3>
        <Link to="/knowledge" className="mt-4 inline-block text-xs font-bold text-primary">
          ← Back to Knowledge Center
        </Link>
      </div>
    );
  }

  return (
    <article className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/knowledge"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Center</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-soft space-y-6">
        {/* Category & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 bg-light-green text-primary font-bold text-xs rounded-full">
            {article.category}
          </span>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.viewsCount} views</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
          {article.title}
        </h1>

        {/* Author metadata */}
        <div className="flex items-center justify-between py-4 border-y border-gray-100 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-light-green text-primary flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{article.author}</p>
              <p className="text-[11px] text-gray-400">{article.authorTitle}</p>
            </div>
          </div>
          <span className="text-gray-400">
            Published: {new Date(article.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Hero Image */}
        <div className="aspect-video rounded-3xl overflow-hidden shadow-xs border border-gray-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Summary Lead */}
        <div className="p-4 rounded-2xl bg-cream border border-gray-100 text-xs sm:text-sm font-medium text-gray-800 leading-relaxed italic">
          &ldquo;{article.summary}&rdquo;
        </div>

        {/* Body Content */}
        <div className="prose prose-emerald max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
          {article.content}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Tags:</span>
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-cream text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
