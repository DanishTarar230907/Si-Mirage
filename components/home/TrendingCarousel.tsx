'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { mockProducts } from '@/config/cmsMockData';

export default function TrendingCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="container mx-auto px-8">
        
        <div className="flex items-end justify-between mb-16">
          <div>
            <h4 className="text-foreground/50 luxury-tracking uppercase text-xs font-bold mb-4">Trending Now</h4>
            <h2 className="text-3xl md:text-5xl font-light">SEASONAL <span className="font-medium">ESSENTIALS</span></h2>
          </div>
          
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 border border-foreground/20 rounded-full flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 border border-foreground/20 rounded-full flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
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
          {mockProducts.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[340px] lg:min-w-[380px] snap-start">
              <ProductCard {...product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
