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
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      '.luxury-content',
      { opacity: 0, y: 42 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 72%',
        },
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] overflow-hidden bg-black">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src={brandAssets.collections.luxury}
          alt="The Luxury Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[90vh] w-full max-w-7xl items-center px-6 py-24 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="luxury-content max-w-2xl rounded-[2px] border border-white/10 bg-black/20 p-8 backdrop-blur-sm sm:p-12 lg:p-14"
        >
          <p className="mb-6 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C5A059]">
            <span className="h-[1px] w-12 bg-[#C5A059]" />
            Haute Couture
          </p>
          <h2 className="mb-6 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            THE <span className="font-medium italic text-[#F5F5F7]">LUXURY</span>
            <br />
            EDIT
          </h2>
          <p className="mb-10 max-w-xl text-base leading-8 text-[#8E8E93] sm:text-lg">
            Impeccable craftsmanship meets avant-garde design. Discover sculpted silhouettes, rare Italian acetate, and precision lenses crafted for the most discerning clientele.
          </p>
          <Link
            href="/shop?category=luxury"
            className="group inline-flex items-center gap-3 border border-[#C5A059] bg-transparent px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F5F5F7] transition-all duration-300 hover:bg-[#C5A059] hover:text-black"
          >
            Explore Luxury
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
