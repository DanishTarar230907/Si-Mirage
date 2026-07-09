'use client';

import { useAdminContext } from './AdminContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye, Edit3, Save, Globe, RefreshCw, ShoppingCart, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminWorkspaceBar() {
  const {
    isEditMode,
    setEditMode,
    hasUnsavedChanges,
    saveDraft,
    publishChanges,
    discardChanges,
    isLoading,
    user
  } = useAdminContext();
  
  const pathname = usePathname();


  const pages = [
    { name: 'Home', href: '/admin' },
    { name: 'Shop', href: '/admin/shop' },
    { name: 'Collections', href: '/admin/collections' },
    { name: 'Best Sellers', href: '/admin/best-sellers' },
    { name: 'New Arrivals', href: '/admin/new-arrivals' },
    { name: 'Team', href: '/admin/team' },
    { name: 'About', href: '/admin/about' },
  ];

  return (
    <div className="sticky top-0 z-[70] w-full bg-[#121212] border-b border-[#C5A059]/20 text-[#FAFAFA] font-sans text-xs select-none">
      <div className="container mx-auto px-6 h-12 flex items-center justify-between">
        
        {/* Left Side: Brand and Mode indicator */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-serif tracking-[0.2em] font-light text-white hover:text-[#C5A059] transition-colors">
            SI MIRAGE <span className="font-sans font-bold text-[9px] tracking-widest text-[#C5A059]">STUDIO</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/10" />
          
          {/* Mode Toggle Switches */}
          <div className="flex bg-white/5 p-0.5 rounded-sm border border-white/10">
            <button
              onClick={() => setEditMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-[1px] transition-all uppercase tracking-wider text-[10px] font-bold ${
                isEditMode ? 'bg-[#C5A059] text-black shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Mode
            </button>
            <button
              onClick={() => setEditMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-[1px] transition-all uppercase tracking-wider text-[10px] font-bold ${
                !isEditMode ? 'bg-[#C5A059] text-black shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </div>

        {/* Center: Quick navigation inside Visual CMS */}
        <div className="hidden lg:flex items-center gap-5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Quick Jump:</span>
          {pages.map((p) => {
            const isActive = pathname === p.href;
            return (
              <Link
                key={p.name}
                href={p.href}
                className={`uppercase tracking-[0.15em] text-[10px] transition-colors ${
                  isActive ? 'text-[#C5A059] font-bold border-b border-[#C5A059]/40' : 'text-white/60 hover:text-white'
                }`}
              >
                {p.name}
              </Link>
            );
          })}
          <div className="h-4 w-[1px] bg-white/10" />
          <Link
            href="/admin/orders"
            className={`flex items-center gap-1.5 uppercase tracking-[0.15em] text-[10px] transition-colors ${
              pathname === '/admin/orders' ? 'text-[#C5A059] font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Orders
          </Link>
        </div>

        {/* Right Side: Save & Publish Action Controls */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-sm animate-pulse">
              Unsaved Changes
            </span>
          )}
          
          <button
            onClick={saveDraft}
            disabled={!hasUnsavedChanges || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors uppercase tracking-wider text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          
          <button
            onClick={publishChanges}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-sm bg-[#C5A059] hover:bg-[#b08e4f] text-black font-bold transition-colors uppercase tracking-wider text-[10px] disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5" /> {isLoading ? 'Publishing...' : 'Publish Live'}
          </button>

          {hasUnsavedChanges && (
            <button
              onClick={discardChanges}
              className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-sm transition-all"
              title="Discard changes"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {user && (
            <>
              <div className="h-4 w-[1px] bg-white/10 mx-1" />
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to sign out?')) {
                    supabase.auth.signOut();
                  }
                }}
                className="p-1.5 text-white/60 hover:text-[#C5A059] hover:bg-white/5 rounded-sm transition-all flex items-center justify-center"
                title={`Log Out (${user.email})`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>

  );
}
