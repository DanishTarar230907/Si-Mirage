'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCmsData } from '@/components/admin/AdminContext';
import { ArrowUpRight } from 'lucide-react';
import AdminEditable from '@/components/admin/AdminEditable';

export default function CreativeShowcase() {
  const { cmsData } = useCmsData();
  const creativeShowcase = cmsData.creativeShowcase || [];

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current) {
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
    }
  }, [creativeShowcase.length]);

  const getGridClasses = (idx: number) => {
    switch(idx) {
      case 0: return 'col-span-1 md:col-span-2 row-span-2'; // Left tall
      case 1: return 'col-span-1 md:col-span-2 row-span-1'; // Right wide top
      case 2: return 'col-span-1 md:col-span-1 row-span-1'; // Right bottom 1
      case 3: return 'col-span-1 md:col-span-1 row-span-1'; // Right bottom 2
      default: return 'hidden';
    }
  };

  return (
    <section className="py-32 bg-[#FAF9F6] overflow-hidden relative">
      <div className="container mx-auto px-8">
        
        <div className="flex flex-col items-center justify-center text-center mb-16 gap-4">
          <h4 className="text-black/60 font-sans luxury-tracking uppercase text-xs font-bold">Creative Studio</h4>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-black uppercase tracking-widest">THE CREATIVE STUDIO</h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px]">
          {creativeShowcase.slice(0, 4).map((item, idx) => (
            <div 
              key={item.id || idx} 
              className={`creative-item relative overflow-hidden group cursor-pointer bg-background ${getGridClasses(idx)}`}
            >
              <AdminEditable section="creativeShowcase" field="coverImage" index={idx} type="image" className="w-full h-full">
                <Image 
                  src={item.coverImage} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
              </AdminEditable>

              {/* Elegant Gradient Overlay - fully clear by default, darkens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 pointer-events-none" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white pointer-events-none">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 pointer-events-auto">
                  <AdminEditable section="creativeShowcase" field="category" index={idx} type="text">
                    <span className="text-[10px] uppercase luxury-tracking font-bold mb-2 block text-white/70">
                      {item.category}
                    </span>
                  </AdminEditable>

                  <AdminEditable section="creativeShowcase" field="title" index={idx} type="text">
                    <h3 className="text-xl md:text-2xl font-medium mb-1">{item.title}</h3>
                  </AdminEditable>

                  <AdminEditable section="creativeShowcase" field="description" index={idx} type="textarea">
                    <p className="text-sm font-light text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                      {item.description}
                    </p>
                  </AdminEditable>
                </div>
              </div>

              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
