'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mockMediaShowcase } from '@/config/cmsMockData';
import { Play } from 'lucide-react';

export default function MediaShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.media-item',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  const getLayoutClasses = (layout: string) => {
    switch(layout) {
      case '16:9': return 'col-span-1 md:col-span-2 row-span-1 aspect-video';
      case '9:16': return 'col-span-1 row-span-2 aspect-[9/16]';
      case '1:1': return 'col-span-1 row-span-1 aspect-square';
      default: return 'col-span-1 row-span-1 aspect-square';
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#050505] text-white overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h4 className="text-white/50 tracking-[0.2em] uppercase text-xs font-bold mb-4">The Experience</h4>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight">STORIES IN <span className="font-medium italic">MOTION</span></h2>
          </div>
          <p className="text-white/60 font-light max-w-md md:text-right text-sm">
            Cinematic campaigns, behind-the-scenes craftsmanship, and moments that define the Si Mirage lifestyle.
          </p>
        </div>

        {/* Strict CSS Grid Layout */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-auto">
          {mockMediaShowcase.map((item) => (
            <div 
              key={item.id} 
              className={`media-item relative overflow-hidden group cursor-pointer bg-zinc-900 shadow-2xl ${getLayoutClasses(item.layout)}`}
            >
              <Image 
                src={item.coverImage} 
                alt={item.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100" 
              />
              
              {/* Play Button Indicator */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-16 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 transform group-hover:scale-110 shadow-xl">
                  <Play className="w-6 h-6 ml-1 transition-colors" />
                </div>
              </div>

              {/* Exact Linear Gradient Overlay Requested */}
              <div 
                className="absolute inset-x-0 bottom-0 h-2/3 z-10 transition-opacity duration-500 opacity-80 group-hover:opacity-100"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
              />
              
              {/* Text Container */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block text-white/70">
                  {item.type}
                </span>
                <h3 className="text-2xl lg:text-3xl font-light mb-1 drop-shadow-md text-white">{item.title}</h3>
                <p className="text-xs font-bold text-white/50 tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.subtitle}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
