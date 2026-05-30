"use client";

import React, { useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';

export default function AudioPlayer() {
  const { 
    isPlaying, 
    togglePlayPause, 
    volume, 
    handleVolumeChange, 
    currentStation, 
    audioRef 
  } = useAudio();

  // Ensure volume is set initially on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  if (!currentStation) {
    // Inactive state when no station is selected
    return (
      <div className="bg-zinc-900/95 backdrop-blur-md text-zinc-500 fixed bottom-0 left-0 w-full border-t border-zinc-800 flex items-center justify-center z-50 h-[72px] md:h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] transition-all">
        <p className="text-xs md:text-sm font-mono tracking-wider">SELECT A STATION TO PLAY</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/95 backdrop-blur-md text-zinc-100 p-3 md:p-4 fixed bottom-0 left-0 w-full border-t border-zinc-800 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] h-[72px] md:h-20 transition-all">
      
      {/* Hidden HTML5 Audio Element */}
      <audio 
        ref={audioRef as React.RefObject<HTMLAudioElement>} 
        preload="none" 
      />

      {/* Now Playing Info */}
      <div className="flex items-center w-1/3 md:w-1/3 overflow-hidden">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800 rounded-md flex items-center justify-center mr-3 border border-zinc-700 shrink-0 overflow-hidden">
          {currentStation.cover_image_url ? (
            <img src={currentStation.cover_image_url} alt={currentStation.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">📻</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm truncate">{currentStation.name}</h4>
          <p className="text-xs text-zinc-400 truncate hidden md:block">{currentStation.description || 'Playing now'}</p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center justify-center w-1/3 md:w-1/3 shrink-0">
        <button 
          onClick={togglePlayPause}
          className="w-10 h-10 md:w-12 md:h-12 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center hover:scale-105 hover:bg-white transition-all shadow-lg active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className={`text-lg md:text-xl ${isPlaying ? '' : 'ml-1'}`}>
            {isPlaying ? '⏸' : '▶'}
          </span>
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-end w-1/3 md:w-1/3 space-x-2 md:space-x-3 pr-2 md:pr-4 shrink-0">
        <span className="text-zinc-500 text-sm hidden sm:block">🔉</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-16 md:w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-300 hover:accent-white transition-all"
          aria-label="Volume"
        />
        <span className="text-zinc-400 text-sm hidden sm:block">🔊</span>
      </div>

    </div>
  );
}
