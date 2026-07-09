'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CinematicHero from '@/components/best-sellers/CinematicHero';
import StickyFilterNav from '@/components/best-sellers/StickyFilterNav';
import PremiumProductCard from '@/components/best-sellers/PremiumProductCard';
import PromotionalInterstitial from '@/components/best-sellers/PromotionalInterstitial';
import { useCmsData } from '@/components/admin/AdminContext';
import { useSearchParams } from 'next/navigation';

function ShopPageContent() {
  const { cmsData } = useCmsData();
  const shopProducts = cmsData.shopProducts || [];
  const [activeFilter, setActiveFilter] = useState('all');
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category')?.toLowerCase() ?? 'all';

  // Redirect to dedicated pages
  useEffect(() => {
    if (selectedCategory === 'best-sellers') {
      router.replace('/best-sellers');
    } else if (selectedCategory === 'new-arrivals') {
      router.replace('/new-arrivals');
    }
  }, [selectedCategory, router]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return shopProducts;
    
    return shopProducts.filter((product) => {
      if (activeFilter === 'best-seller') return product.badge === 'Best Seller';
      if (activeFilter === 'new') return product.badge === 'New';
      if (activeFilter === 'limited') return product.badge === 'Limited';
      if (activeFilter === 'restocked') return product.badge === 'Restocked';
      return product.category.toLowerCase() === activeFilter;
    });
  }, [activeFilter, shopProducts]);


  // Show loading or return null while redirecting
  if (selectedCategory === 'best-sellers' || selectedCategory === 'new-arrivals') {
    return null;
  }

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
            Complete Collection
          </p>
          <h2 className="font-serif text-3xl font-light text-[#121212] md:text-4xl lg:text-5xl">
            {filteredProducts.length} Pieces
          </h2>
        </div>

        {/* Responsive Grid: 4 cols desktop, 2 tablet, 1-2 mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, index) => {
            // Insert promotional banner after 10th product
            if (index === 10) {
              return (
                <div key="promo" className="col-span-full">
                  <PromotionalInterstitial />
                </div>
              );
            }

            return (
              <PremiumProductCard
                key={product.id}
                product={{
                  id: String(product.id),
                  name: product.name,
                  category: product.category,
                  price: typeof product.price === 'number' ? `PKR ${product.price.toLocaleString()}` : String(product.price),
                  badge: product.badge || null,
                  primaryImage: product.primaryImage || product.image || "/images/20250201_233239.jpg",
                  hoverImage: product.hoverImage || product.image || "/images/20250201_234207.jpg"
                }}
                index={index}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-lg text-[#121212]/60">No products found in this category.</p>
          </div>
        )}
      </section>

      {/* Footer Spacer */}
      <div className="h-24" />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9]" />}>
      <ShopPageContent />
    </Suspense>
  );
}
