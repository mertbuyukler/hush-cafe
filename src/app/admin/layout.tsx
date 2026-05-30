"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative z-40">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative z-40 pb-24">
      <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 p-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Hush Cafe <span className="text-zinc-500 font-normal">Admin</span></h1>
          <button 
            onClick={handleLogout}
            className="text-sm bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-4 sm:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
