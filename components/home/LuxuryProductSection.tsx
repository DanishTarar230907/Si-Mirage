'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LuxuryProductSection({ onExplore }: { onExplore?: () => void }) {
  return (
    <section className="relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/20250201_233639.jpg"
          alt="Luxury eyewear editorial"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[86vh] w-full max-w-7xl items-center px-6 py-24 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl rounded-[2px] border border-white/10 bg-black/20 p-8 backdrop-blur-sm sm:p-12 lg:p-14"
        >
          <p className="mb-6 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C5A059]">
            <span className="h-[1px] w-12 bg-[#C5A059]" />
            The Luxury Edit
          </p>
          <h2 className="mb-6 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Sculpted silhouettes.
            <br />
            Quiet opulence.
          </h2>
          <p className="mb-10 max-w-xl text-base leading-8 text-[#8E8E93] sm:text-lg">
            Refined craftsmanship, rare materials, and precision lenses designed to elevate each frame into a collectible heirloom.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/shop?category=luxury"
              onClick={onExplore}
              className="group inline-flex items-center gap-3 border border-[#C5A059] bg-transparent px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F5F5F7] transition-all duration-300 hover:bg-[#C5A059] hover:text-black"
            >
              Explore Luxury
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
