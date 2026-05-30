"use client";

import React, { useEffect, useState } from 'react';
import StationCard, { Station } from './StationCard';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function StationGrid() {
  const [stations, setStations] = useState<Station[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both stations and categories simultaneously
        const [stationsRes, categoriesRes] = await Promise.all([
          fetch('/api/stations'),
          fetch('/api/categories')
        ]);
        
        if (!stationsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data from the server.');
        }
        
        const stationsData = await stationsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setStations(stationsData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading stations.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-400 text-lg animate-pulse">Loading stations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 my-8">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
        <p className="text-zinc-500 text-lg">No stations available yet.</p>
        <p className="text-zinc-600 text-sm mt-2">Check back later for new music.</p>
      </div>
    );
  }

  // --- Client-Side Filtering Logic ---
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? station.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const featuredStations = filteredStations.filter(s => s.is_featured);
  const regularStations = filteredStations.filter(s => !s.is_featured);

  return (
    <div className="space-y-12 pb-12">
      
      {/* Search and Filter Controls */}
      <div className="space-y-6 mb-16 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50">
        
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for a station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors placeholder:text-zinc-600 shadow-inner"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null 
                ? 'bg-zinc-100 text-zinc-900 shadow-md scale-105' 
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800'
            }`}
          >
            All Genres
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id 
                  ? 'bg-zinc-100 text-zinc-900 shadow-md scale-105' 
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State for Filters */}
      {filteredStations.length === 0 && (
        <div className="text-center py-16 border border-zinc-800/50 rounded-2xl bg-zinc-900/20">
          <p className="text-zinc-400 text-lg">No stations match your search criteria.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="mt-4 text-sm text-zinc-300 hover:text-white underline decoration-zinc-600 underline-offset-4 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Featured Stations Grid */}
      {featuredStations.length > 0 && (
        <section className="animate-in fade-in duration-500">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Featured</h2>
            <div className="ml-6 h-px bg-gradient-to-r from-zinc-800 to-transparent flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredStations.map(station => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </section>
      )}

      {/* All Stations Grid */}
      {regularStations.length > 0 && (
        <section className="animate-in fade-in duration-500">
          <div className="flex items-center mb-8 pt-4">
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">All Stations</h2>
            <div className="ml-6 h-px bg-gradient-to-r from-zinc-800 to-transparent flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {regularStations.map(station => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
