'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCustomerAuth } from '@/components/auth/CustomerAuthProvider';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { user } = useCustomerAuth();

  React.useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (authError) throw authError;

      // 2. If successful, manually insert into our public `customers` table
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('customers')
          .insert([
            {
              id: authData.user.id,
              name: name,
              email: email
            }
          ]);
        
        if (dbError) {
          console.error('Failed to create customer record:', dbError);
        }
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-24 px-4 relative z-20">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4 tracking-wide">
            CREATE <span className="font-medium text-[#C5A059]">ACCOUNT</span>
          </h1>
          <p className="text-foreground/60 text-sm font-light">
            Join Si Mirage to unlock exclusive collections and tailored experiences.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-surface p-8 md:p-12 border border-foreground/5 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-foreground">Welcome to Si Mirage</h2>
            <p className="text-foreground/60 text-sm leading-relaxed">
              We've sent a verification email to <span className="font-medium text-foreground">{email}</span>. 
              Please check your inbox to activate your account.
            </p>
            <Link href="/login" className="inline-block mt-4 bg-foreground text-background px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] hover:text-white transition-all">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6 bg-surface p-8 md:p-12 border border-foreground/5 shadow-2xl">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold ml-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-background border border-foreground/10 px-4 py-3 text-sm text-foreground focus:border-[#C5A059] focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>

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
            <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background border border-foreground/10 px-4 py-3 text-sm text-foreground focus:border-[#C5A059] focus:outline-none transition-colors"
              placeholder="Create a password (min 6 chars)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#C5A059] text-black px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
          
          <div className="pt-4 text-center border-t border-foreground/10 mt-6">
            <p className="text-[11px] text-foreground/50 uppercase tracking-widest">
              Already have an account?{' '}
              <Link href="/login" className="text-foreground font-bold hover:text-[#C5A059] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
