"use client";

import React from 'react';

export const AssetCardSkeleton: React.FC = () => {
  return (
    <div className="h-[480px] w-full bg-navy-900/60 rounded-2xl border border-navy-800/80 animate-pulse flex flex-col justify-between overflow-hidden">
      <div className="h-48 w-full bg-navy-800" />
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-navy-800 rounded w-3/4" />
          <div className="h-3 bg-navy-800 rounded w-full" />
          <div className="h-3 bg-navy-800 rounded w-5/6" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-navy-800">
          <div className="h-8 bg-navy-800 rounded" />
          <div className="h-8 bg-navy-800 rounded" />
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="h-10 bg-navy-800 rounded-xl w-full" />
      </div>
    </div>
  );
};