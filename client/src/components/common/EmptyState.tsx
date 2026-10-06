import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🌾',
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-3xl bg-cream border border-gray-200/80 max-w-md mx-auto my-6 shadow-soft">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-gray-100">
        {typeof icon === 'string' ? (
          icon
        ) : (
          React.createElement(icon, { className: 'w-8 h-8 text-primary' })
        )}
      </div>
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-sm hover:shadow transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
