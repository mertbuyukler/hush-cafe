"use client";

import React, { useState, useEffect } from 'react';
import type { Station } from '@/components/StationCard';
import type { Category } from '@/components/StationGrid';

export default function StationManager() {
  const [stations, setStations] = useState<Station[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [stRes, catRes] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/categories')
      ]);
      if (!stRes.ok || !catRes.ok) throw new Error('Failed to fetch data');
      
      setStations(await stRes.json());
      setCategories(await catRes.json());
    } catch (err) {
      setError('Could not load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setStreamUrl('');
    setCoverImageUrl('');
    setCategoryId('');
    setIsFeatured(false);
    setError('');
  };

  const handleEditClick = (st: Station) => {
    setEditingId(st.id);
    setName(st.name);
    setDescription(st.description || '');
    setStreamUrl(st.stream_url);
    setCoverImageUrl(st.cover_image_url || '');
    setCategoryId(st.category_id || '');
    setIsFeatured(!!st.is_featured);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, stName: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${stName}" station? This action cannot be undone.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/stations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        if (editingId === id) resetForm();
        await fetchData();
      } else {
        setError(data.error || 'Failed to delete station');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!name.trim() || !streamUrl.trim()) {
      setError('Name and Stream URL are required.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name,
      description,
      stream_url: streamUrl,
      cover_image_url: coverImageUrl,
      category_id: categoryId === '' ? null : Number(categoryId),
      is_featured: isFeatured
    };

    const url = editingId ? `/api/stations/${editingId}` : '/api/stations';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        resetForm();
        await fetchData();
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {error && (
        <div className="mb-6 bg-red-950/40 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-center shadow-lg">
          <span className="mr-3 text-xl">⚠️</span> {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 p-4 rounded-xl flex items-center shadow-lg">
          <span className="mr-3 text-xl">✅</span> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-inner sticky top-24">
            <h3 className="text-lg font-semibold text-zinc-200 mb-6">
              {editingId ? 'Edit Station' : 'Create Station'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Stream URL *</label>
                <input
                  type="url"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                >
                  <option value="">Uncategorized</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500 min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center pt-2 pb-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-zinc-300 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-zinc-300 cursor-pointer">
                  Featured Station
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-zinc-100 text-zinc-900 font-semibold rounded-lg px-4 py-2 hover:bg-white active:scale-95 transition-all disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-zinc-800 text-zinc-300 font-medium rounded-lg px-4 py-2 hover:bg-zinc-700 transition-all text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/80 border-b border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                    <th className="p-4 font-medium">Station</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium text-center">Featured</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {loading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-zinc-500 animate-pulse">Loading stations...</td></tr>
                  ) : stations.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No stations found. Create one.</td></tr>
                  ) : (
                    stations.map((st: any) => {
                      const cat = categories.find(c => c.id === st.category_id);
                      return (
                        <tr key={st.id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="p-4">
                            <p className="text-zinc-200 font-medium text-sm">{st.name}</p>
                            <p className="text-zinc-500 text-xs truncate max-w-[200px]">{st.stream_url}</p>
                          </td>
                          <td className="p-4">
                            {cat ? (
                              <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">{cat.name}</span>
                            ) : (
                              <span className="text-zinc-600 text-xs italic">-</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {st.is_featured ? <span className="text-yellow-500">★</span> : <span className="text-zinc-700">☆</span>}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditClick(st)} className="text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs">Edit</button>
                              <button onClick={() => handleDelete(st.id, st.name)} className="text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/30 hover:bg-red-900/50 text-xs border border-red-900/30">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
