'use client';

import React from 'react';
import Image from 'next/image';
import { useCmsData } from '@/components/admin/AdminContext';
import { motion } from 'framer-motion';

export default function TeamContent() {
  const { cmsData } = useCmsData();
  const team = cmsData.team || [];

  return (
    <div className="bg-background text-foreground py-24 md:py-32">
      <div className="container mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.35em] mb-4"
          >
            The Creators
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-6xl font-light mb-6 uppercase tracking-widest leading-tight"
          >
            MEET THE <span className="font-semibold italic">CREW</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-foreground/70 font-light leading-relaxed text-lg"
          >
            The visionaries behind Si Mirage. Our creative crew works relentlessly to design, engineer, and command the architectural language of premium eyewear.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => {
            const memberImage = member.image && !member.image.includes('Team+Member')
              ? member.image 
              : `/images/20250201_233639.jpg`; // Fallback to premium story image

            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative overflow-hidden bg-black/40 aspect-[3/4] border border-white/5"
              >
                <Image
                  src={memberImage}
                  alt={member.name}
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-1">{member.name}</h3>
                  <p className="text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase">{member.role}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
