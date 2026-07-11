'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { fadeUp, staggerContainer, LUXURY_EASE } from '@/lib/animations';

export default function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const y = useTransform(smoothScrollY, [0, 1], [0, 300]);
  const scale = useTransform(smoothScrollY, [0, 1], [1, 1.1]);
  const opacity = useTransform(smoothScrollY, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[85vh] w-full overflow-hidden bg-black"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y, opacity, scale }}
        className="absolute inset-0"
      >
        <Image
          src="/images/20250201_233639.jpg"
          alt="Summer Solstice Campaign"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F9F9F9]" />
        
        {/* Soft radial glow for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] mix-blend-overlay" />
      </motion.div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center px-6"
        >
          <motion.p
            variants={fadeUp}
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C5A059]"
          >
            The Atelier Collection
          </motion.p>
          
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: LUXURY_EASE } }
            }}
            className="font-serif text-5xl font-light tracking-[0.1em] text-white md:text-7xl lg:text-8xl drop-shadow-lg"
          >
            CURATED EXCELLENCE
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center justify-center gap-6"
          >
            <div className="h-[1px] w-12 sm:w-24 bg-white/30" />
            <p className="text-[11px] font-medium tracking-[0.3em] text-white/90 uppercase">
              Discover the new standard
            </p>
            <div className="h-[1px] w-12 sm:w-24 bg-white/30" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/50">Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-10 w-[1px] bg-white/30"
          />
        </div>
      </motion.div>
    </section>
  );
}
