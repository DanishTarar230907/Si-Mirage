'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Check if user is in admin_users table
      const { data: adminUser, error: dbError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (dbError || !adminUser) {
        setError('Unauthorized: Your account is not registered as an administrator.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Redirect on success
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6 relative overflow-hidden font-sans text-[#f7f4ee]">
      {/* Editorial aesthetic background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a150e]/30 via-[#0d0d0d] to-[#0d0d0d] pointer-events-none" />
      <Link 
        href="/" 
        className="absolute top-10 left-10 text-[10px] tracking-[0.4em] text-[#C5A059]/40 hover:text-[#C5A059] uppercase transition-colors flex items-center gap-2 z-20 font-serif"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Storefront
      </Link>
      <div className="absolute bottom-10 right-10 text-[10px] tracking-[0.4em] text-[#C5A059]/20 uppercase pointer-events-none font-serif">
        Established 2026
      </div>

      <div className="w-full max-w-md z-10 space-y-10 border border-[#C5A059]/10 bg-[#121212]/80 backdrop-blur-md p-10 md:p-12 shadow-2xl relative">
        {/* Sleek top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl tracking-[0.25em] text-[#C5A059] uppercase">
            Si Mirage
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-[#f7f4ee]/40 uppercase">
            Atelier Administration Login
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-300 text-xs tracking-wider text-center leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] tracking-[0.3em] text-[#f7f4ee]/50 uppercase font-semibold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="name@simirage.com"
              className="w-full px-4 py-3 bg-[#181818] border border-[#f7f4ee]/10 text-sm tracking-wider placeholder-[#f7f4ee]/20 focus:border-[#C5A059] focus:outline-none transition-all duration-300 rounded-none text-[#f7f4ee]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] tracking-[0.3em] text-[#f7f4ee]/50 uppercase font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#181818] border border-[#f7f4ee]/10 text-sm tracking-wider placeholder-[#f7f4ee]/20 focus:border-[#C5A059] focus:outline-none transition-all duration-300 rounded-none text-[#f7f4ee]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 bg-[#C5A059] hover:bg-[#b08b47] active:bg-[#977436] disabled:bg-[#333] disabled:text-neutral-500 text-[#0d0d0d] font-bold text-xs tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-none"
          >
            {loading ? (
              <span className="animate-pulse">AUTHENTICATING...</span>
            ) : (
              <span>ENTER ATELIER</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
