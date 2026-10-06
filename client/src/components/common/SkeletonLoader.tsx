import React from 'react';

export const SkeletonLoader: React.FC<{ rows?: number; height?: string }> = ({
  rows = 4,
  height = 'h-10',
}) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`w-full ${height} bg-gray-200/80 rounded-xl skeleton-shimmer`}
        />
      ))}
    </div>
  );
};
