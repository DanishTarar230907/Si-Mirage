'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useCmsData } from '@/components/admin/AdminContext';
import AdminEditable from '@/components/admin/AdminEditable';

export default function EverydayCollectionBanner() {
  const { cmsData } = useCmsData();
  const banner = cmsData.everydayBanner;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.everyday-content',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-white flex items-center justify-center">
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <AdminEditable section="everydayBanner" field="image" type="image" className="w-full h-full">
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover opacity-100 min-h-[90vh]"
          />
        </AdminEditable>
        {/* Subtle Dark Gradient Overlay for better contrast behind the box */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </motion.div>

      <div className="container mx-auto px-8 relative z-10 flex items-center justify-center">
        <div className="max-w-2xl w-full everyday-content text-center bg-white/10 backdrop-blur-md border border-white/20 p-12 md:p-20 shadow-2xl">
          <h4 className="text-white/80 font-sans luxury-tracking uppercase text-xs font-bold mb-6">
            Seasonal Collection
          </h4>
          
          <AdminEditable section="everydayBanner" field="title" type="text">
            <h2 className="text-4xl md:text-6xl font-serif font-light text-white mb-6 uppercase tracking-wide">
              {banner.title}
            </h2>
          </AdminEditable>
          
          <AdminEditable section="everydayBanner" field="subtitle" type="textarea">
            <p className="text-white/90 font-sans font-light leading-relaxed mb-10 text-base md:text-lg">
              {banner.subtitle}
            </p>
          </AdminEditable>
          
          <div className="flex flex-col items-center justify-center gap-2 mb-8">
            <span className="text-[10px] font-bold uppercase luxury-tracking text-white/60">Starting at PKR 2,999</span>
          </div>
          
          <Link href={banner.href}>
            <AdminEditable section="everydayBanner" field="cta" type="text">
              <span className="group inline-flex items-center justify-center gap-4 bg-white text-black px-10 py-4 uppercase font-sans tracking-[0.15em] text-[10px] font-bold hover:bg-white/80 transition-colors shadow-lg cursor-pointer">
                {banner.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </AdminEditable>
          </Link>
        </div>
      </div>
    </section>

  );
}
