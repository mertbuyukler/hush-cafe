"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        // Force a hard refresh to re-evaluate the middleware with the new cookie
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800 shadow-2xl relative z-50 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 border border-zinc-700">
          <span className="text-2xl">🔒</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Admin Login</h1>
        <p className="text-zinc-400 text-sm mt-2">Enter the master password to access the panel.</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors shadow-inner"
            required
            autoFocus
          />
        </div>
        
        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 text-sm p-3 rounded-lg flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-100 text-zinc-900 font-semibold rounded-xl px-4 py-3.5 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
