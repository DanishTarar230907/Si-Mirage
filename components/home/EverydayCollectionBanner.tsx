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
    <section ref={containerRef} className="relative h-[90vh] overflow-hidden bg-white flex items-center justify-end">
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <AdminEditable section="everydayBanner" field="image" type="image" className="w-full h-full">
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover opacity-90 min-h-[90vh]"
          />
        </AdminEditable>
        {/* Everyday Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      <div className="container mx-auto px-8 relative z-10 flex justify-end">
        <div className="max-w-xl everyday-content text-right">
          <h4 className="text-foreground/50 luxury-tracking uppercase text-xs font-bold mb-6 flex items-center justify-end gap-4">
            Daily Essentials
            <span className="w-12 h-[1px] bg-foreground/30"></span>
          </h4>
          
          <AdminEditable section="everydayBanner" field="title" type="text">
            <h2 className="text-5xl md:text-7xl font-light text-foreground mb-6 uppercase tracking-wide">
              {banner.title}
            </h2>
          </AdminEditable>
          
          <AdminEditable section="everydayBanner" field="subtitle" type="textarea">
            <p className="text-foreground/70 font-light leading-relaxed mb-10 text-lg">
              {banner.subtitle}
            </p>
          </AdminEditable>
          
          <div className="flex flex-col items-end gap-2 mb-8">
            <span className="text-sm font-bold uppercase luxury-tracking text-primary">Starting at PKR 2,999</span>
          </div>
          
          <Link href={banner.href}>
            <AdminEditable section="everydayBanner" field="cta" type="text">
              <span className="group inline-flex items-center justify-center gap-4 bg-foreground text-background px-10 py-5 uppercase luxury-tracking text-xs font-bold hover:bg-primary hover:text-white luxury-transition shadow-lg cursor-pointer">
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
