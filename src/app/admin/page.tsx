"use client";

import React, { useState } from 'react';
import CategoryManager from '@/components/admin/CategoryManager';
import StationManager from '@/components/admin/StationManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stations' | 'categories'>('stations');

  return (
    <div className="space-y-8">
      
      {/* Admin Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Dashboard</h2>
        
        <div className="flex p-1 bg-zinc-900 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('stations')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'stations' 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            Stations
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'categories' 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            Categories
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'stations' ? <StationManager /> : <CategoryManager />}
      </div>
      
    </div>
  );
}
