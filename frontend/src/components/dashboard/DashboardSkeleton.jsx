import React from 'react';
import { Skeleton } from '../ui/skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* 1. Obligations & Action Items Mockup */}
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>

      {/* 2. Strategic & Tactical Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
        <div>
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>

      {/* 3. Engagement Health Banner Mockup */}
      <div className="h-64 w-full rounded-2xl bg-gray-100 dark:bg-gray-800 dark:border-gray-700 flex p-8 gap-8 items-center border border-gray-200">
        <div className="w-1/3 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="w-2/3 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 opacity-50" />
            <Skeleton className="h-2 w-full opacity-50" />
          </div>
        </div>
      </div>

      {/* 4. KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>

      {/* 5. 3D Infographics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Skeleton className="h-[400px] rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>

      {/* 6. Active Engagements Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
            <Skeleton className="h-[500px] rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
