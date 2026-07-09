'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCustomerAuth } from '@/components/auth/CustomerAuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useCustomerAuth();

  React.useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // Let the useEffect handle the redirect once onAuthStateChange populates user
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-24 px-4 relative z-20">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4 tracking-wide">
            WELCOME <span className="font-medium text-[#C5A059]">BACK</span>
          </h1>
          <p className="text-foreground/60 text-sm font-light">
            Sign in to access your orders, wishlists, and exclusive benefits.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-surface p-8 md:p-12 border border-foreground/5 shadow-2xl">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-foreground/10 px-4 py-3 text-sm text-foreground focus:border-[#C5A059] focus:outline-none transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Password</label>
              <Link href="#" className="text-[10px] text-[#C5A059] hover:text-foreground transition-colors">Forgot Password?</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background border border-foreground/10 px-4 py-3 text-sm text-foreground focus:border-[#C5A059] focus:outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-foreground text-background px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
          
          <div className="pt-4 text-center border-t border-foreground/10 mt-6">
            <p className="text-[11px] text-foreground/50 uppercase tracking-widest">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#C5A059] font-bold hover:text-foreground transition-colors">
                Register Here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
