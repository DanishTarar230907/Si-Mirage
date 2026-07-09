'use client';

import React from 'react';
import Image from 'next/image';
import { useCmsData } from '@/components/admin/AdminContext';
import { motion } from 'framer-motion';

export default function AboutContent() {
  const { cmsData } = useCmsData();
  const about = cmsData.about;

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] bg-black overflow-hidden flex items-center justify-center">
        <Image
          src={about.image || '/images/20250201_233639.jpg'}
          alt={about.title}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mt-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.3em] mb-4"
          >
            {about.subtitle}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-widest uppercase leading-tight"
          >
            {about.title}
          </motion.h1>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="border-t border-[#C5A059]/20 pt-16 flex flex-col md:flex-row gap-16 items-start">
          <div className="md:w-1/3">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059]">THE VISION</h3>
            <h2 className="text-3xl font-light mt-4 leading-snug uppercase tracking-wide">
              Architectural <br />
              <span className="font-semibold italic">Parity</span>
            </h2>
          </div>
          <div className="md:w-2/3 space-y-8">
            <p className="text-lg md:text-xl font-light leading-relaxed text-foreground/80 italic">
              &quot;Eyewear is not an accessory, but a structural frame that defines a cinematic landscape.&quot;
            </p>
            <p className="text-foreground/70 font-light leading-relaxed text-base">
              {about.story}
            </p>
            <p className="text-foreground/70 font-light leading-relaxed text-base">
              Every curve is analyzed for weight distribution and light refraction, resulting in a product that feels premium, balanced, and timeless.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
