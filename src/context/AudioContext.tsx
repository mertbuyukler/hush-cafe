"use client";

import React, { createContext, useContext, useState, useRef } from 'react';
import type { Station } from '@/components/StationCard';

interface AudioContextType {
  isPlaying: boolean;
  togglePlayPause: () => void;
  playStation: (station: Station) => void;
  volume: number;
  handleVolumeChange: (newVolume: number) => void;
  currentStation: Station | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = () => {
    if (!audioRef.current || !currentStation) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  };

  const playStation = (station: Station) => {
    setCurrentStation(station);
    
    if (audioRef.current) {
      audioRef.current.src = station.stream_url;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      togglePlayPause,
      playStation,
      volume,
      handleVolumeChange,
      currentStation,
      audioRef
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
