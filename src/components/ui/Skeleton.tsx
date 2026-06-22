import React from 'react';
import { MapPin } from 'lucide-react';

// Reusable single line or block shimmer element
export const ShimmerBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded ${className}`} />
);

// 1. Product Card Skeleton (Supports both 'shop' and 'pos' layouts)
interface SkeletonProductCardProps {
  variant?: 'shop' | 'pos';
}

export const SkeletonProductCard: React.FC<SkeletonProductCardProps> = ({ variant = 'shop' }) => {
  if (variant === 'shop') {
    return (
      <div className="flex flex-col h-full bg-white transition-all duration-300 relative border border-transparent rounded-xl overflow-hidden p-1">
        {/* Aspect-[4/5] Shimmer Image */}
        <div className="w-full bg-gray-50 overflow-hidden rounded-xl aspect-[4/5] mb-3 relative skeleton-shimmer">
          {/* Favorite button placeholder */}
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm" />
        </div>
        
        {/* Text Details */}
        <div className="flex flex-col flex-1 px-1 gap-2">
          {/* Brand/Subtitle */}
          <ShimmerBlock className="h-3 w-12" />
          {/* Title */}
          <ShimmerBlock className="h-4 w-4/5" />
          <ShimmerBlock className="h-4 w-2/3" />
          {/* Price */}
          <ShimmerBlock className="h-5 w-1/3 mt-2" />
        </div>
      </div>
    );
  }

  // POS Cashier Card Variant
  return (
    <div className="card overflow-hidden flex flex-col h-full bg-white border border-[var(--border)] rounded-xl relative p-0">
      {/* Aspect-video Shimmer Image */}
      <div className="w-full bg-gray-50 aspect-video relative skeleton-shimmer" />

      {/* Details */}
      <div className="flex flex-col flex-1 p-4 gap-3 bg-white">
        <ShimmerBlock className="h-5 w-4/5" />
        <ShimmerBlock className="h-5 w-1/3 text-blue-600" />
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
          <ShimmerBlock className="h-3.5 w-16" />
          <ShimmerBlock className="h-5 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
};

// 2. Table Row Skeleton (For Inventory table loading states)
export const SkeletonTableRow: React.FC = () => {
  return (
    <tr className="border-b border-gray-100 bg-white">
      {/* ID column */}
      <td className="p-4 pl-6">
        <ShimmerBlock className="h-4 w-12 font-mono" />
      </td>
      {/* Product Name column */}
      <td className="p-4">
        <ShimmerBlock className="h-4 w-40" />
      </td>
      {/* Visual column */}
      <td className="p-4">
        <div className="w-10 h-10 rounded-md skeleton-shimmer" />
      </td>
      {/* Category column */}
      <td className="p-4">
        <ShimmerBlock className="h-5 w-20 rounded-full" />
      </td>
      {/* Price column */}
      <td className="p-4">
        <ShimmerBlock className="h-4 w-16 font-mono" />
      </td>
      {/* Stock column */}
      <td className="p-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full skeleton-shimmer" />
          <ShimmerBlock className="h-4 w-12" />
        </div>
      </td>
      {/* Actions column */}
      <td className="p-4 pr-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
          <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
        </div>
      </td>
    </tr>
  );
};

// 3. User Card Skeleton (For Admin Access Management grid)
export const SkeletonUserCard: React.FC = () => {
  return (
    <div className="card p-5 border border-gray-200 flex flex-col bg-white rounded-xl">
      <div className="flex justify-between items-start mb-4">
        {/* Shield/Users icon container placeholder */}
        <div className="w-12 h-12 rounded-full border border-gray-200 shadow-sm skeleton-shimmer" />
        {/* Badge placeholder */}
        <ShimmerBlock className="h-6 w-16 rounded-full" />
      </div>
      
      <div className="mb-4 gap-2 flex flex-col">
        <ShimmerBlock className="h-6 w-3/4" />
        <ShimmerBlock className="h-4 w-1/2" />
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
        <ShimmerBlock className="h-8 w-28 rounded-full" />
      </div>
    </div>
  );
};

// 4. Order Card Skeleton (Supports both Client My Orders and Admin Order Management layouts)
export const SkeletonOrderCard: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  return (
    <div className="card p-6 flex flex-col border border-gray-100 bg-white rounded-xl">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-2">
          <ShimmerBlock className="h-5 w-24" />
          <ShimmerBlock className="h-3.5 w-32" />
        </div>
        {/* Status Badge */}
        <ShimmerBlock className="h-7 w-20 rounded-full" />
      </div>

      {/* GCash / Payment pill */}
      <div className="flex gap-2 mb-6">
        <ShimmerBlock className="h-6 w-28 rounded-lg" />
      </div>

      {/* Address Block (Admin Only) */}
      {isAdmin && (
        <div className="flex gap-2 p-3 bg-gray-50 rounded-lg mb-6 border border-gray-100">
          <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <ShimmerBlock className="h-3.5 w-full" />
            <ShimmerBlock className="h-3.5 w-2/3" />
          </div>
        </div>
      )}

      {/* Items Section */}
      <div className="mb-6 flex-1">
        <div className="border-b border-gray-100 pb-2 mb-3">
          <ShimmerBlock className="h-3 w-28" />
        </div>
        <ul className="space-y-3">
          {[1, 2].map((i) => (
            <li key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-100 skeleton-shimmer" />
                <ShimmerBlock className="h-4 w-32" />
              </div>
              <ShimmerBlock className="h-4 w-12 font-mono" />
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Footer block */}
      <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-20 h-8 rounded-lg skeleton-shimmer" />
          <div className="w-20 h-8 rounded-lg skeleton-shimmer" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <ShimmerBlock className="h-3 w-16" />
          <ShimmerBlock className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
};

// 5. Admin Dashboard Skeleton
export const SkeletonDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <ShimmerBlock className="h-8 w-44" />
          <ShimmerBlock className="h-4.5 w-64" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-10 rounded-lg skeleton-shimmer" />
          <div className="w-32 h-10 rounded-lg skeleton-shimmer" />
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((cardIdx) => (
          <div key={cardIdx} className="p-6 rounded-xl flex flex-col relative border border-[var(--border)] bg-[var(--warm-white)]">
            <div className="flex items-start justify-between mb-8">
              <div className="w-8 h-8 rounded-md bg-[var(--parchment)] skeleton-shimmer" />
            </div>
            <div className="flex flex-col gap-2">
              <ShimmerBlock className="h-3.5 w-24" />
              <ShimmerBlock className="h-8 w-36" />
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)] border-dashed">
              <ShimmerBlock className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section (Charts + Pending orders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Trend Chart Skeleton */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-[var(--border)] flex flex-col bg-[var(--warm-white)]">
          <div className="flex items-center justify-between mb-12">
            <ShimmerBlock className="h-6 w-36" />
            <div className="w-36 h-7 rounded-full skeleton-shimmer" />
          </div>
          
          {/* Simulated Bars */}
          <div className="flex items-end justify-between gap-2 md:gap-4 h-48 mt-auto relative border-b border-gray-100 pb-2">
            {[30, 60, 45, 90, 70, 100, 50].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group justify-end h-full">
                <div 
                  className="w-full max-w-[36px] rounded-t-md skeleton-shimmer" 
                  style={{ height: `${h}%`, opacity: i === 5 ? 0.9 : 0.4 }}
                />
                <ShimmerBlock className="h-2 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Pending Orders list Skeleton */}
        <div className="p-0 rounded-xl border border-[var(--border)] flex flex-col bg-[var(--warm-white)] relative">
          <div className="p-6 flex items-center justify-between border-b border-[var(--border)]">
            <ShimmerBlock className="h-6 w-32" />
            <div className="w-6 h-6 rounded-full bg-[var(--parchment)] skeleton-shimmer" />
          </div>
          <div className="flex-1 flex flex-col divide-y divide-[var(--border)]">
            {[1, 2, 3].map((orderIdx) => (
              <div key={orderIdx} className="p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded bg-[var(--parchment)] overflow-hidden border border-[var(--border)] flex-shrink-0 skeleton-shimmer" />
                <div className="flex-1 flex flex-col gap-2 pt-0.5">
                  <div className="flex justify-between items-center">
                    <ShimmerBlock className="h-4 w-16" />
                    <ShimmerBlock className="h-3 w-10" />
                  </div>
                  <ShimmerBlock className="h-3.5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[var(--border)] text-center pb-6 flex justify-center">
            <ShimmerBlock className="h-3.5 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};
