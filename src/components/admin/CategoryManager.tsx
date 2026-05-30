"use client";

import React, { useState, useEffect } from 'react';
import type { Category } from '@/components/StationGrid';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Could not load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setError('');
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, catName: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${catName}" category? Stations using this category will be uncategorized.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        if (editingId === id) resetForm();
        await fetchCategories();
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch (err) {
      setError('An unexpected error occurred during deletion.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!name.trim() || !slug.trim()) {
      setError('Name and slug are required.');
      setIsSubmitting(false);
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError('Slug can only contain lowercase letters, numbers, and hyphens.');
      setIsSubmitting(false);
      return;
    }

    const payload = { name: name.trim(), slug: slug.trim() };
    const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
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
        await fetchCategories();
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
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-inner sticky top-24">
            <h3 className="text-lg font-semibold text-zinc-200 mb-6">
              {editingId ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-zinc-100 text-zinc-900 font-semibold rounded-lg px-4 py-2.5 hover:bg-white active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-zinc-800 text-zinc-300 font-medium rounded-lg px-4 py-2.5 hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/80 border-b border-zinc-800 text-sm text-zinc-400">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Slug</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {loading ? (
                    <tr><td colSpan={3} className="p-8 text-center text-zinc-500 animate-pulse">Loading categories...</td></tr>
                  ) : categories.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center text-zinc-500">No categories found.</td></tr>
                  ) : (
                    categories.map((cat: Category) => (
                      <tr key={cat.id} className="hover:bg-zinc-800/30 transition-colors group">
                        <td className="p-4 text-zinc-200 font-medium">{cat.name}</td>
                        <td className="p-4 text-zinc-400 font-mono text-sm">{cat.slug}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(cat)} className="text-zinc-400 hover:text-white px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-sm">Edit</button>
                            <button onClick={() => handleDelete(cat.id, cat.name)} className="text-red-400 hover:text-red-300 px-3 py-1 rounded bg-red-950/30 hover:bg-red-900/50 text-sm border border-red-900/30">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
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
