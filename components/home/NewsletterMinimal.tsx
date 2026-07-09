'use client';

import { ArrowRight } from 'lucide-react';
import { useCmsData } from '@/components/admin/AdminContext';
import AdminEditable from '@/components/admin/AdminEditable';

export default function NewsletterMinimal() {
  const { cmsData } = useCmsData();
  const newsletter = cmsData.newsletter;

  return (
    <section className="py-24 md:py-32 bg-accent border-t border-b border-foreground/5">
      <div className="container mx-auto px-8 max-w-2xl text-center">
        <AdminEditable section="newsletter" field="heading" type="text">
          <h2 className="text-3xl md:text-5xl font-light mb-6 text-foreground uppercase tracking-wide">
            {newsletter.heading}
          </h2>
        </AdminEditable>
        
        <AdminEditable section="newsletter" field="description" type="textarea">
          <p className="text-foreground/70 font-light mb-12 text-lg">
            {newsletter.description}
          </p>
        </AdminEditable>

        <form className="relative max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="w-full bg-transparent border-b border-foreground/30 py-4 pl-4 pr-12 text-foreground font-light placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors text-sm"
            required
          />
          <button 
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-foreground/50 hover:text-primary transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <p className="text-[10px] uppercase luxury-tracking text-foreground/40 mt-6">
          By subscribing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </section>
  );
}
