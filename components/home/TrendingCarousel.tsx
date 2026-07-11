'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { useCmsData } from '@/components/admin/AdminContext';

export default function TrendingCarousel() {
  const { cmsData } = useCmsData();
  const products = cmsData.shopProducts || [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 bg-[#FAF9F6] overflow-hidden relative">
      <div className="container mx-auto px-8">
        
        <div className="flex items-end justify-between mb-16">
          <div>
            <h4 className="text-black/60 font-sans luxury-tracking uppercase text-xs font-bold mb-4">LATEST DROPS</h4>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-black uppercase tracking-widest">NEW ARRIVALS</h2>
          </div>
          
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 border border-black/20 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 border border-black/20 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            const rawPrice = product.price || 35000;
            const discountPrice = rawPrice * 0.9;
            return (
              <div key={product.id} className="min-w-[280px] md:min-w-[340px] lg:min-w-[380px] snap-start">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  category={product.category}
                  price={rawPrice}
                  discountPrice={discountPrice}
                  image={product.primaryImage || product.image || '/images/20250201_233511.jpg'}
                  hoverImage={product.hoverImage || product.image || '/images/20250201_234207.jpg'}
                  isNew={product.badge === 'New'}
                />
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
