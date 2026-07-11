'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CinematicHero from '@/components/best-sellers/CinematicHero';
import StickyFilterNav from '@/components/best-sellers/StickyFilterNav';
import PremiumProductCard from '@/components/best-sellers/PremiumProductCard';
import PromotionalInterstitial from '@/components/best-sellers/PromotionalInterstitial';

export default function NewArrivalsClient({ products }: { products: any[] }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    
    return products.filter((product) => {
      if (activeFilter === 'new') return product.badge === 'New';
      if (activeFilter === 'limited') return product.badge === 'Limited';
      return product.category.toLowerCase() === activeFilter;
    });
  }, [activeFilter, products]);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Cinematic Hero Section */}
      <CinematicHero />

      {/* Sticky Filter Navigation */}
      <StickyFilterNav activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Product Grid Section */}
      <section className="container mx-auto px-6 py-16 md:px-10 lg:py-24">
        <div className="mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C5A059]">
            Fresh Drops
          </p>
          <h2 className="font-serif text-3xl font-light text-[#121212] md:text-4xl lg:text-5xl">
            {filteredProducts.length} New Arrivals
          </h2>
        </div>

        {/* Responsive Grid: 4 cols desktop, 2 tablet, 1-2 mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, index) => {
            // Insert promotional banner after 6th product
            if (index === 6) {
              return (
                <div key="promo" className="col-span-full">
                  <PromotionalInterstitial />
                </div>
              );
            }

            return (
              <PremiumProductCard
                key={product.id}
                product={product}
                index={index}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center"
          >
            <p className="text-lg text-[#121212]/60">No products found in this category.</p>
          </motion.div>
        )}
      </section>

      {/* Footer Spacer */}
      <div className="h-24" />
    </div>
  );
}
