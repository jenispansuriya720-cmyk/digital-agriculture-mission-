import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-light-green text-primary flex items-center justify-center text-3xl mb-4 shadow-sm">
        🌾
      </div>
      <h1 className="text-4xl font-black text-gray-900">404</h1>
      <h2 className="text-lg font-bold text-gray-700 mt-1">Page Not Found</h2>
      <p className="text-xs text-gray-500 mt-2 max-w-sm">
        The digital agriculture resource or route you requested could not be located on the platform.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors inline-flex items-center space-x-1.5 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Krishi Digital Home</span>
      </Link>
    </div>
  );
};
