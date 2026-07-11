'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCmsData } from '@/components/admin/AdminContext';
import { Play } from 'lucide-react';
import AdminEditable from '@/components/admin/AdminEditable';

export default function MediaShowcase() {
  const { cmsData } = useCmsData();
  const mediaShowcase = cmsData.mediaShowcase || [];

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current) {
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
    }
  }, [mediaShowcase.length]);

  const getLayoutClasses = (layout: string) => {
    return 'col-span-1 aspect-[3/4] md:aspect-[9/16]'; // Force tall vertical layout for all
  };

  return (
    <section className="py-32 bg-[#FAF9F6] text-black overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col mb-16">
          <h4 className="text-black/60 font-sans luxury-tracking uppercase text-xs font-bold mb-2">The Experience</h4>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-black tracking-widest uppercase">STORIES IN MOTION</h2>
        </div>

        {/* Strict 5-column layout */}
        <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {mediaShowcase.slice(0, 5).map((item, idx) => (
            <div 
              key={item.id || idx} 
              className={`media-item relative overflow-hidden group cursor-pointer bg-zinc-900 shadow-2xl ${getLayoutClasses(item.layout)}`}
            >
              <AdminEditable section="mediaShowcase" field="coverImage" index={idx} type="image" className="w-full h-full">
                <Image 
                  src={item.coverImage} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100" 
                />
              </AdminEditable>
              
              {/* Play Button Indicator */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-16 h-16 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 transform group-hover:scale-110 shadow-xl">
                  <Play className="w-6 h-6 ml-1 transition-colors" />
                </div>
              </div>

              {/* Exact Linear Gradient Overlay Requested */}
              <div 
                className="absolute inset-x-0 bottom-0 h-2/3 z-10 transition-opacity duration-500 opacity-80 group-hover:opacity-100 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
              />
              
              {/* Text Container */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none">
                <div className="pointer-events-auto">
                  <AdminEditable section="mediaShowcase" field="type" index={idx} type="text">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block text-white/70">
                      {item.type}
                    </span>
                  </AdminEditable>

                  <AdminEditable section="mediaShowcase" field="title" index={idx} type="text">
                    <h3 className="text-2xl lg:text-3xl font-light mb-1 drop-shadow-md text-white">{item.title}</h3>
                  </AdminEditable>

                  <AdminEditable section="mediaShowcase" field="subtitle" index={idx} type="text">
                    <p className="text-xs font-bold text-white/50 tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.subtitle}</p>
                  </AdminEditable>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
