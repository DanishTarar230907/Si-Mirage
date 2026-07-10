'use client';

import React from 'react';
import Image from 'next/image';
import { useCmsData } from '@/components/admin/AdminContext';
import { motion, useReducedMotion } from 'framer-motion';
import { AtSign, Send, Mail } from 'lucide-react';

export default function TeamContent() {
  const { cmsData } = useCmsData();
  const team = cmsData.team || [];
  const prefersReduced = useReducedMotion();

  const headerItem = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section className="dark-section relative overflow-hidden py-24 md:py-32">
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <motion.p
            custom={0}
            variants={headerItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-primary"
          >
            The Creators
          </motion.p>
          <motion.h2
            custom={1}
            variants={headerItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="mb-6 text-4xl font-light uppercase leading-tight tracking-widest md:text-6xl"
          >
            MEET THE <span className="font-semibold italic gold-text">CREW</span>
          </motion.h2>
          <motion.div
            custom={2}
            variants={headerItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="gold-rule mx-auto mb-6 w-24"
          />
          <motion.p
            custom={3}
            variants={headerItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-lg font-light leading-relaxed text-white/60"
          >
            The visionaries behind Si Mirage. Our creative crew works relentlessly
            to design, engineer, and command the architectural language of premium
            eyewear.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => {
            const memberImage =
              member.image && !member.image.includes('Team+Member')
                ? member.image
                : `/images/20250201_233639.jpg`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={prefersReduced ? undefined : { y: -8 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-[2px] border border-white/10 bg-white/[0.03]"
              >
                <Image
                  src={memberImage}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Social icons revealed on hover */}
                <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  {[AtSign, Send, Mail].map((Icon, i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  ))}
                </div>

                <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="mb-1 text-xl font-bold uppercase tracking-wider text-white">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
