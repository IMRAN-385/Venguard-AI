"use client";

import React from 'react';

export const AssetCardSkeleton: React.FC = () => {
  return (
    <div className="h-[460px] w-full bg-card border border-slate-800/80 rounded-2xl animate-pulse flex flex-col justify-between overflow-hidden">
      <div className="h-48 w-full bg-slate-900" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-5 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800/80 rounded w-full" />
          <div className="h-3 bg-slate-800/80 rounded w-5/6" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
          <div className="h-7 bg-slate-900 rounded" />
          <div className="h-7 bg-slate-900 rounded" />
        </div>
      </div>
      <div className="p-5 pt-0">
        <div className="h-10 bg-slate-900 rounded-xl w-full" />
      </div>
    </div>
  );
};