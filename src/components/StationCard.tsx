"use client";

import React from 'react';
import { useAudio } from '@/context/AudioContext';

export interface Station {
  id: number;
  name: string;
  description: string;
  stream_url: string;
  cover_image_url: string | null;
  category_id: number | null;
  is_featured: number | boolean;
}

export default function StationCard({ station }: { station: Station }) {
  const { playStation, currentStation, isPlaying, togglePlayPause } = useAudio();

  // Check if this card's station is the one currently loaded in the global player
  const isCurrentlyPlaying = currentStation?.id === station.id;

  const handleCardClick = () => {
    if (isCurrentlyPlaying) {
      // If it's already the active station, just toggle play/pause
      togglePlayPause();
    } else {
      // If it's a new station, send it to the global context to start playing
      playStation(station);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-zinc-900 rounded-xl overflow-hidden border ${
        isCurrentlyPlaying ? 'border-zinc-400 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-zinc-800 hover:border-zinc-600'
      } transition-all duration-300 cursor-pointer flex flex-col group`}
    >
      <div className="aspect-square bg-zinc-800 flex items-center justify-center relative overflow-hidden">
        {station.cover_image_url ? (
          <img 
            src={station.cover_image_url} 
            alt={station.name} 
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isCurrentlyPlaying ? 'scale-105' : 'group-hover:scale-105'
            }`} 
          />
        ) : (
          <span className={`text-zinc-600 transition-all duration-500 ${
            isCurrentlyPlaying ? 'text-6xl scale-110 text-zinc-400' : 'text-5xl group-hover:scale-110 group-hover:text-zinc-500'
          }`}>
            🎵
          </span>
        )}
        
        {/* Play/Pause overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
            <span className={`text-black text-2xl ${isCurrentlyPlaying && isPlaying ? '' : 'ml-1'}`}>
              {isCurrentlyPlaying && isPlaying ? '⏸' : '▶'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold transition-colors ${
            isCurrentlyPlaying ? 'text-white' : 'text-zinc-100 group-hover:text-white'
          }`}>
            {station.name}
          </h3>
          {isCurrentlyPlaying && isPlaying && (
            <span className="flex space-x-1 items-end h-4 w-4">
              <span className="w-1 bg-zinc-400 h-2 animate-[bounce_1s_infinite]"></span>
              <span className="w-1 bg-zinc-400 h-4 animate-[bounce_1s_infinite_0.2s]"></span>
              <span className="w-1 bg-zinc-400 h-3 animate-[bounce_1s_infinite_0.4s]"></span>
            </span>
          )}
        </div>
        {station.description && (
          <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {station.description}
          </p>
        )}
      </div>
    </div>
  );
}
