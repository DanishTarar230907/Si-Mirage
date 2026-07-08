'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  primaryImage: string;
  hoverImage: string;
  badge: 'Limited' | 'Restocked' | 'Best Seller' | 'New' | null;
  videoSnippetUrl?: string;
  category: string;
}

interface PremiumProductCardProps {
  product: Product;
  index: number;
}

export default function PremiumProductCard({ product, index }: PremiumProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container - Minimalist with ultra-light border */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
        
        {/* Primary Image */}
        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: isHovered ? 0 : 1 }}
        />
        
        {/* Hover Image - Smooth fade transition */}
        <Image
          src={product.hoverImage}
          alt={`${product.name} alternate view`}
          fill
          className="object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Badge - Only gold for Best Seller */}
        {product.badge && (
          <div className="absolute left-4 top-4 z-10">
            <span
              className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                product.badge === 'Best Seller'
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-black text-white'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick Add Button - Slides up on hover */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: isHovered ? 0 : '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 right-0 z-20 p-4"
        >
          <button className="w-full bg-[#121212] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#C5A059] hover:text-black">
            Quick Add
          </button>
        </motion.div>

        {/* Subtle gradient overlay for button legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-500"
          style={{ opacity: isHovered ? 1 : 0 }}
        />
      </div>

      {/* Product Details - Minimalist spacing */}
      <div className="mt-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#121212]/50">
              {product.category}
            </p>
            <h3 className="mt-1 text-base font-medium tracking-wide text-[#121212]">
              {product.name}
            </h3>
          </div>
          <p className="text-sm font-medium text-[#121212]">{product.price}</p>
        </div>
      </div>
    </motion.article>
  );
}
