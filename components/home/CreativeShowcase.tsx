'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mockCreativeShowcase } from '@/config/cmsMockData';
import { ArrowUpRight } from 'lucide-react';

export default function CreativeShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.creative-item',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  const getGridClasses = (size: string) => {
    switch(size) {
      case 'large': return 'col-span-1 md:col-span-2 row-span-2';
      case 'tall': return 'col-span-1 row-span-2';
      case 'wide': return 'col-span-1 md:col-span-2 row-span-1';
      case 'medium': return 'col-span-1 row-span-1';
      default: return 'col-span-1 row-span-1'; // small
    }
  };

  return (
    <section className="py-24 md:py-32 bg-surface overflow-hidden relative">
      <div className="container mx-auto px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h4 className="text-primary luxury-tracking uppercase text-xs font-bold mb-4">Creative Studio</h4>
            <h2 className="text-3xl md:text-5xl font-light">VISUAL <span className="font-medium">STORIES</span></h2>
          </div>
          <p className="text-foreground/70 font-light max-w-md md:text-right">
            Explore our latest brand campaigns, editorial photography, and creative explorations.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
          {mockCreativeShowcase.map((item) => (
            <div 
              key={item.id} 
              className={`creative-item relative overflow-hidden group cursor-pointer bg-background ${getGridClasses(item.size)}`}
            >
              <Image 
                src={item.coverImage} 
                alt={item.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
              {/* Elegant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] uppercase luxury-tracking font-bold mb-2 block text-white/70">
                    {item.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-medium mb-1">{item.title}</h3>
                  <p className="text-sm font-light text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
