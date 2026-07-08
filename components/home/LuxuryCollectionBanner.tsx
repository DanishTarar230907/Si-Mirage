'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { brandAssets } from '@/config/brandAssets';

export default function LuxuryCollectionBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.luxury-content',
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
    <section ref={containerRef} className="relative h-[90vh] overflow-hidden bg-black flex items-center">
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src={brandAssets.collections.luxury}
          alt="The Luxury Collection"
          fill
          className="object-cover opacity-80"
        />
        {/* Luxury Gold/Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </motion.div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-xl luxury-content">
          <h4 className="text-primary luxury-tracking uppercase text-xs font-bold mb-6 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-primary"></span>
            Haute Couture
          </h4>
          <h2 className="text-5xl md:text-7xl font-light text-white mb-6">THE <span className="font-medium italic">LUXURY</span> <br/>EDIT</h2>
          <p className="text-white/70 font-light leading-relaxed mb-10 text-lg">
            Impeccable craftsmanship meets avant-garde design. Featuring 24k gold-plated accents, rare Italian acetate, and zero-distortion polarized lenses.
          </p>
          <Link href="/shop?category=luxury" className="group inline-flex items-center justify-center gap-4 bg-primary text-black px-10 py-5 uppercase luxury-tracking text-xs font-bold hover:bg-white luxury-transition shadow-2xl">
            Explore Luxury
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
