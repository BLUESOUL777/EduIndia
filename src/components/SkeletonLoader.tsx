import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  count = 1, 
  height = 'h-4', 
  width = 'w-full' 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton rounded ${height} ${width} ${className}`}
        />
      ))}
    </>
  );
};

// Specific skeleton components for common use cases
export const CourseCardSkeleton: React.FC = () => (
  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
    <SkeletonLoader height="h-40" className="rounded-lg" />
    <SkeletonLoader height="h-6" width="w-3/4" />
    <SkeletonLoader height="h-4" width="w-full" />
    <SkeletonLoader height="h-4" width="w-1/2" />
    <div className="flex justify-between items-center">
      <SkeletonLoader height="h-8" width="w-20" />
      <SkeletonLoader height="h-8" width="w-16" />
    </div>
  </div>
);

export const LessonCardSkeleton: React.FC = () => (
  <div className="bg-card border border-border rounded-lg p-4 space-y-3">
    <div className="flex space-x-4">
      <SkeletonLoader height="h-16" width="w-16" className="rounded-lg" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader height="h-5" width="w-3/4" />
        <SkeletonLoader height="h-4" width="w-1/2" />
        <SkeletonLoader height="h-3" width="w-1/4" />
      </div>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <SkeletonLoader height="h-8" width="w-1/3" />
      <SkeletonLoader height="h-4" width="w-2/3" />
    </div>
    
    {/* Stats grid skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-2">
          <SkeletonLoader height="h-8" width="w-16" />
          <SkeletonLoader height="h-4" width="w-full" />
        </div>
      ))}
    </div>
    
    {/* Content skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <SkeletonLoader height="h-6" width="w-1/2" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex space-x-3">
              <SkeletonLoader height="h-10" width="w-10" className="rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonLoader height="h-4" width="w-3/4" />
                <SkeletonLoader height="h-3" width="w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <SkeletonLoader height="h-6" width="w-1/2" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <SkeletonLoader height="h-4" width="w-1/2" />
              <SkeletonLoader height="h-6" width="w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;