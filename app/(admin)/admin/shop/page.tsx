'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CinematicHero from '@/components/best-sellers/CinematicHero';
import StickyFilterNav from '@/components/best-sellers/StickyFilterNav';
import PremiumProductCard from '@/components/best-sellers/PremiumProductCard';
import PromotionalInterstitial from '@/components/best-sellers/PromotionalInterstitial';
import { useSearchParams } from 'next/navigation';
import { useCmsData, useAdminContext } from '@/components/admin/AdminContext';
import { Plus, Settings, Trash2, Edit } from 'lucide-react';

function AdminShopPageContent() {
  const { cmsData } = useCmsData();
  const { addCmsItem, deleteCmsItem, updateCmsData, isEditMode } = useAdminContext();
  const [activeFilter, setActiveFilter] = useState('all');
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category')?.toLowerCase() ?? 'all';

  // Redirect if category is a special sub-page
  useEffect(() => {
    if (selectedCategory === 'best-sellers') {
      router.replace('/admin/best-sellers');
    } else if (selectedCategory === 'new-arrivals') {
      router.replace('/admin/new-arrivals');
    }
  }, [selectedCategory, router]);

  const filteredProducts = useMemo(() => {
    const products = cmsData.shopProducts || [];
    if (activeFilter === 'all') return products;
    
    return products.filter((product) => {
      if (activeFilter === 'best-seller') return product.badge === 'Best Seller';
      if (activeFilter === 'new') return product.badge === 'New';
      if (activeFilter === 'limited') return product.badge === 'Limited';
      if (activeFilter === 'restocked') return product.badge === 'Restocked';
      return product.category.toLowerCase() === activeFilter;
    });
  }, [activeFilter, cmsData.shopProducts]);

  const handleAddProduct = () => {
    const newId = `shop-${Date.now()}`;
    const newProduct = {
      id: newId,
      name: 'Atelier Signature Frame',
      price: 'PKR 45,000',
      primaryImage: '/images/20250201_233511.jpg',
      hoverImage: '/images/20250201_234207.jpg',
      badge: 'New',
      category: 'Aviator',
      stock: 15,
      description: 'Sculptured design in premium acetate, featuring hand-polished 24k gold hardware.'
    };
    addCmsItem('shopProducts', newProduct);
  };

  if (selectedCategory === 'best-sellers' || selectedCategory === 'new-arrivals') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] relative pb-24">
      {/* FAB to Add Product in Edit Mode */}
      {isEditMode && (
        <button
          onClick={handleAddProduct}
          className="fixed bottom-8 right-8 z-50 bg-[#C5A059] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-[#b08e4f] transition-all transform hover:scale-110 group"
          title="Add New Product"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
          <span className="absolute right-16 bg-[#121212] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none rounded-sm">
            Add Product
          </span>
        </button>
      )}

      {/* Cinematic Hero Section */}
      <CinematicHero />

      {/* Sticky Filter Navigation */}
      <StickyFilterNav activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Product Grid Section */}
      <section className="container mx-auto px-6 py-16 md:px-10 lg:py-24">
        <div className="mb-12 flex justify-between items-end border-b border-black/5 pb-6">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C5A059]">
              Complete Collection (Workspace View)
            </p>
            <h2 className="font-serif text-3xl font-light text-[#121212] md:text-4xl lg:text-5xl">
              {filteredProducts.length} Pieces
            </h2>
          </div>
        </div>

        {/* Responsive Grid */}
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

            // In Edit Mode, we render the card with custom editing overlays!
            return (
              <div key={product.id} className="relative group/edit">
                <PremiumProductCard
                  product={{
                    ...product,
                    id: String(product.id),
                    price: typeof product.price === 'number' ? `PKR ${product.price.toLocaleString()}` : String(product.price || ''),
                    primaryImage: product.primaryImage || product.image || '',
                    hoverImage: product.hoverImage || product.image || '',
                    badge: (product.badge || null) as any,
                  }}
                  index={index}
                />
                
                {isEditMode && (
                  <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-black/95 border border-[#C5A059]/40 p-1.5 shadow-lg">
                    <button
                      onClick={() => {
                        const newName = prompt('Enter Product Name:', product.name);
                        const newPrice = prompt('Enter Product Price (e.g. 45000):', String(product.price));
                        if (newName && newPrice) {
                          const idx = cmsData.shopProducts.findIndex(p => p.id === product.id);
                          const arr = [...cmsData.shopProducts];
                          arr[idx] = { ...product, name: newName, price: Number(newPrice.replace(/[^0-9.]/g, '')) || product.price };
                          updateCmsData('shopProducts', arr);
                        }
                      }}
                      className="p-1 hover:bg-white/10 text-white rounded-sm transition-colors"
                      title="Edit Product Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                          const idx = cmsData.shopProducts.findIndex(p => p.id === product.id);
                          deleteCmsItem('shopProducts', idx);
                        }
                      }}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded-sm transition-colors"
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
          <div className="py-24 text-center">
            <p className="text-lg text-[#121212]/60">No products found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9]" />}>
      <AdminShopPageContent />
    </Suspense>
  );
}
