'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/components/auth/CustomerAuthProvider';
import { supabase } from '@/lib/supabase';
import { LogOut, Package, MapPin, Heart, Clock } from 'lucide-react';

export default function AccountPage() {
  const { user, isLoading, signOut } = useCustomerAuth();
  const router = useRouter();
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchCustomerProfile = async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setCustomerData(data);
        }
      };
      
      fetchCustomerProfile();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const displayName = customerData?.name || user.user_metadata?.full_name || 'Guest';

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-6 border-b border-foreground/10">
          <div>
            <h1 className="text-3xl md:text-5xl font-light text-foreground tracking-wide mb-2">
              MY <span className="font-medium text-[#C5A059]">ATELIER</span>
            </h1>
            <p className="text-foreground/60 font-light">
              Welcome back, <span className="text-foreground">{displayName}</span>
            </p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="mt-6 md:mt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground/60 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Sidebar */}
          <div className="col-span-1 space-y-6">
            <div className="bg-surface border border-foreground/5 p-6 rounded-sm shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-6">Profile Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-foreground/40 mb-1">Email</p>
                  <p className="text-sm text-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-foreground/40 mb-1">Member Since</p>
                  <p className="text-sm text-foreground">
                    {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-foreground/40 mb-1">Status</p>
                  <div className="inline-block px-2 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-[9px] uppercase font-bold tracking-widest">
                    VIP Member
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-foreground/5 p-6 rounded-sm shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-4">Quick Links</h3>
              <nav className="flex flex-col gap-3">
                <button className="flex items-center gap-3 text-sm text-foreground hover:text-[#C5A059] transition-colors py-2 border-b border-foreground/5">
                  <Package className="w-4 h-4" /> Order History
                </button>
                <button className="flex items-center gap-3 text-sm text-foreground hover:text-[#C5A059] transition-colors py-2 border-b border-foreground/5">
                  <MapPin className="w-4 h-4" /> Addresses
                </button>
                <button className="flex items-center gap-3 text-sm text-foreground hover:text-[#C5A059] transition-colors py-2">
                  <Heart className="w-4 h-4" /> Saved Items
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-surface border border-foreground/5 p-8 rounded-sm h-full min-h-[400px] flex flex-col items-center justify-center text-center shadow-sm">
              <Clock className="w-8 h-8 text-foreground/20 mb-4" />
              <h3 className="text-lg font-light text-foreground mb-2">No Recent Orders</h3>
              <p className="text-sm text-foreground/50 max-w-sm mb-6">
                You haven't placed any orders yet. Discover our latest collections and find your perfect silhouette.
              </p>
              <button 
                onClick={() => router.push('/shop')}
                className="bg-transparent border border-foreground text-foreground px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
              >
                Explore Collections
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
