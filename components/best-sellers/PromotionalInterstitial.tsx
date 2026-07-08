'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function PromotionalInterstitial() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="my-16 md:my-24"
    >
      <div className="relative h-[60vh] w-full overflow-hidden bg-[#121212]">
        {/* Background Image */}
        <Image
          src="/images/20250202_003823.jpg"
          alt="The Atelier Edit"
          fill
          className="object-cover opacity-60"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C5A059]"
            >
              The Atelier Edit
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6 font-serif text-4xl font-light leading-tight text-white md:text-5xl lg:text-6xl"
            >
              Discover the craftsmanship
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8 max-w-lg text-base leading-8 text-white/80"
            >
              Hand-finished frames with rare Italian acetate, precision lenses, and the attention to detail that defines true luxury.
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ x: 8 }}
              className="group inline-flex items-center gap-3 border border-white/30 bg-transparent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-all hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-black"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
