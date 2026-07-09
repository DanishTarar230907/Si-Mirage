'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CinematicHero from '@/components/best-sellers/CinematicHero';
import StickyFilterNav from '@/components/best-sellers/StickyFilterNav';
import PremiumProductCard from '@/components/best-sellers/PremiumProductCard';
import PromotionalInterstitial from '@/components/best-sellers/PromotionalInterstitial';
import { useCmsData, useAdminContext } from '@/components/admin/AdminContext';
import { Edit, Trash2 } from 'lucide-react';

export default function AdminBestSellersPage() {
  const { cmsData } = useCmsData();
  const { updateCmsData, deleteCmsItem, isEditMode } = useAdminContext();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    // Filter shopProducts where badge includes 'Best Seller'
    const products = (cmsData.shopProducts || []).filter(
      p => p.badge === 'Best Seller'
    );
    
    if (activeFilter === 'all') return products;
    
    return products.filter((product) => {
      if (activeFilter === 'best-seller') return product.badge === 'Best Seller';
      if (activeFilter === 'limited') return product.badge === 'Limited';
      if (activeFilter === 'restocked') return product.badge === 'Restocked';
      return product.category.toLowerCase() === activeFilter;
    });
  }, [activeFilter, cmsData.shopProducts]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-24">
      {/* Cinematic Hero Section */}
      <CinematicHero />

      {/* Sticky Filter Navigation */}
      <StickyFilterNav activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Product Grid Section */}
      <section className="container mx-auto px-6 py-16 md:px-10 lg:py-24">
        <div className="mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C5A059]">
            Featured Collection (Workspace View)
          </p>
          <h2 className="font-serif text-3xl font-light text-[#121212] md:text-4xl lg:text-5xl">
            {filteredProducts.length} Pieces
          </h2>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, index) => {
            // Insert promotional banner after 8th product
            if (index === 8) {
              return (
                <div key="promo" className="col-span-full">
                  <PromotionalInterstitial />
                </div>
              );
            }

            return (
              <div key={product.id} className="relative group/edit">
                <PremiumProductCard
                  product={{
                    ...product,
                    primaryImage: product.primaryImage || product.image,
                    hoverImage: product.hoverImage || product.image
                  }}
                  index={index}
                />
                
                {isEditMode && (
                  <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-black/95 border border-[#C5A059]/40 p-1.5 shadow-lg">
                    <button
                      onClick={() => {
                        const newName = prompt('Enter Product Name:', product.name);
                        const newPrice = prompt('Enter Product Price (e.g. PKR 45,000):', product.price);
                        if (newName && newPrice) {
                          const idx = cmsData.shopProducts.findIndex(p => p.id === product.id);
                          const arr = [...cmsData.shopProducts];
                          arr[idx] = { ...product, name: newName, price: newPrice };
                          updateCmsData('shopProducts', arr);
                        }
                      }}
                      className="p-1 hover:bg-white/10 text-white rounded-sm"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove "${product.name}"?`)) {
                          const idx = cmsData.shopProducts.findIndex(p => p.id === product.id);
                          deleteCmsItem('shopProducts', idx);
                        }
                      }}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded-sm animate-fade-in"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
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
    </div>
  );
}
