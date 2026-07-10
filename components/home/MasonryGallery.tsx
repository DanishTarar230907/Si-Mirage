'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCmsData } from '@/components/admin/AdminContext';

export default function MasonryGallery() {
  const { cmsData } = useCmsData();
  const instagramImages = cmsData.gallery || [];

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.gallery-item',
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  // Simple layout mapping for a masonry-like look using CSS Grid
  const gridClasses = [
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-2 aspect-[1/2]",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
  ];

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden relative">
      <div className="container mx-auto px-8">
        
        <div className="text-center mb-16">
          <h4 className="text-black tracking-[1.5px] uppercase text-[10px] xl:text-xs font-bold mb-4 flex items-center justify-center gap-2">
            <Camera className="w-4 h-4 text-black stroke-[1.5]" /> @simirage.official
          </h4>
          <h2 className="text-3xl md:text-5xl font-light text-black">JOIN THE <span className="font-medium">MIRAGE</span></h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 auto-rows-fr">
          {instagramImages.map((src, idx) => (
            <div 
              key={idx} 
              className={`gallery-item relative overflow-hidden group cursor-pointer ${gridClasses[idx] || "col-span-1 row-span-1 aspect-square"}`}
              onClick={() => setSelectedImage(src)}
            >
              <Image 
                src={src} 
                alt={`Instagram post ${idx + 1}`} 
                fill 
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" />
              </div>
            </div>
          ))}

        </div>

        <div className="mt-14 flex justify-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 border border-black/15 bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-all duration-300 hover:border-primary hover:bg-black hover:text-white"
          >
            <Camera className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            Follow @simirage.official
          </a>
        </div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-2xl aspect-[4/5] md:aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={selectedImage} alt="Expanded Instagram post" fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
