'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCmsData } from '@/components/admin/AdminContext';

export default function CategoryCircleGrid() {
  const { cmsData } = useCmsData();
  const categories = cmsData.categories;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.category-circle', 
      { opacity: 0, scale: 0.8, y: 30 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.05,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-foreground">SHOP BY <span className="font-medium">SILHOUETTE</span></h2>
          <p className="text-foreground/60 max-w-xl mx-auto font-light">Find your perfect frame shape.</p>
        </div>
        
        {/* Horizontal scroll container on mobile, grid on desktop */}
        <div ref={containerRef} className="flex md:grid md:grid-cols-5 gap-6 md:gap-10 overflow-x-auto pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar px-4 md:px-0 -mx-4 md:mx-0">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={`/shop?category=${cat.name.toLowerCase().replace(' ', '-')}`}
              className="category-circle flex-shrink-0 w-36 md:w-auto snap-center flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 bg-surface shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 150px, 200px"
                  className="object-cover group-hover:scale-110 luxury-transition opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
              <h3 className="text-xs font-bold uppercase luxury-tracking text-foreground group-hover:text-primary transition-colors text-center mt-3">{cat.name}</h3>
              <p className="text-xs text-foreground/70 mt-1">{cat.count} Items</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
