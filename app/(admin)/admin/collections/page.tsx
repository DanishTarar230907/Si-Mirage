'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Edit, Settings } from 'lucide-react';
import { useCmsData, useAdminContext } from '@/components/admin/AdminContext';

export default function AdminCollectionsPage() {
  const { cmsData } = useCmsData();
  const { isEditMode, setActiveSection } = useAdminContext();

  const collections = [
    {
      id: 'luxuryBanner',
      title: cmsData.luxuryBanner.title,
      description: cmsData.luxuryBanner.subtitle,
      image: cmsData.luxuryBanner.image,
      href: '/admin/best-sellers',
      name: 'Luxury Atelier'
    },
    {
      id: 'everydayBanner',
      title: cmsData.everydayBanner.title,
      description: cmsData.everydayBanner.subtitle,
      image: cmsData.everydayBanner.image,
      href: '/admin/shop',
      name: 'Everyday Essentials'
    },
    {
      id: 'newArrivals',
      title: 'New Arrivals',
      description: 'Freshly launched silhouettes for the modern connoisseur.',
      image: '/images/20250201_233523.jpg',
      href: '/admin/new-arrivals',
      name: 'New Arrivals'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-24">
      {/* Cinematic Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="/images/20250202_003823.jpg"
          alt="Collections Campaign"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C5A059]"
            >
              SI MIRAGE COLLECTIONS
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-serif text-6xl font-light tracking-[0.15em] text-white md:text-8xl lg:text-9xl"
            >
              CURATED CAPSULES
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 flex items-center justify-center gap-4"
            >
              <div className="h-[1px] w-16 bg-white/40" />
              <p className="text-sm font-light tracking-[0.2em] text-white/80 uppercase">
                Shaped for Bold Living
              </p>
              <div className="h-[1px] w-16 bg-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="container mx-auto px-6 py-24 md:px-10 lg:py-32">
        <div className="mb-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C5A059]">
            Explore (Workspace)
          </p>
          <h2 className="font-serif text-3xl font-light text-[#121212] md:text-4xl lg:text-5xl">
            Our Collections
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative group/collection"
            >
              <Link href={collection.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] border border-black/10 hover:border-[#C5A059]/50 transition-colors">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                
                <div className="mt-6">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">
                    Collection
                  </p>
                  <h3 className="mb-3 text-2xl font-light text-[#121212] group-hover:text-[#C5A059] transition-colors">
                    {collection.name}
                  </h3>
                  <p className="mb-5 text-sm leading-7 text-[#121212]/70">
                    {collection.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#121212] transition-colors group-hover:text-[#C5A059]">
                    Discover <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
              
              {isEditMode && (collection.id === 'luxuryBanner' || collection.id === 'everydayBanner') && (
                <div className="absolute top-4 right-4 z-30">
                  <button
                    onClick={() => setActiveSection(collection.id)}
                    className="flex items-center gap-1.5 bg-black/90 text-[#C5A059] border border-[#C5A059]/30 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold hover:bg-[#C5A059] hover:text-black transition-all"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Collection
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
