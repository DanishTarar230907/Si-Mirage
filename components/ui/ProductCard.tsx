'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Search, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  id: string | number;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image: string;
  hoverImage?: string;
  isNew?: boolean;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  discountPrice,
  image,
  hoverImage,
  isNew,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with strict 4/5 aspect ratio */}
      <div className="relative w-full aspect-[4/5] bg-surface overflow-hidden mb-6">
        
        {/* Primary Image */}
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover object-center transition-opacity duration-700 ease-in-out ${isHovered && hoverImage ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Secondary Hover Image */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${name} alternate view`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover object-center transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isNew && (
            <span className="bg-foreground text-background text-[10px] font-bold tracking-[0.1em] px-3 py-1 uppercase">
              NEW
            </span>
          )}
          {discountPrice && (
            <span className="bg-primary text-background text-[10px] font-bold tracking-[0.1em] px-3 py-1 uppercase">
              SALE
            </span>
          )}
        </div>

        {/* Hover Action Buttons */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          <button className="w-full bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 py-3 text-xs font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 shadow-lg">
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/90 backdrop-blur-sm text-black hover:bg-white transition-colors duration-300 py-3 text-xs font-medium uppercase flex items-center justify-center gap-2 shadow-lg">
              <Heart className="w-4 h-4" /> Wishlist
            </button>
            <button className="flex-1 bg-white/90 backdrop-blur-sm text-black hover:bg-white transition-colors duration-300 py-3 text-xs font-medium uppercase flex items-center justify-center gap-2 shadow-lg">
              <Search className="w-4 h-4" /> Quick View
            </button>
          </div>
        </div>

        {/* Gradient shadow on hover to make buttons legible */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Product Details (Strict Center Alignment) */}
      <div className="flex flex-col items-center text-center px-4">
        
        {/* Category Subtitle */}
        <span className="text-[10px] text-foreground/50 tracking-[0.2em] uppercase mb-2">
          {category}
        </span>
        
        {/* Title (Bolder) */}
        <Link href={`/product/${id}`} className="text-sm md:text-base font-bold tracking-wide text-foreground hover:text-primary transition-colors">
          {name}
        </Link>
        
        {/* Ratings */}
        <div className="flex items-center justify-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-primary fill-primary' : 'text-foreground/20 fill-foreground/20'}`} />
          ))}
          <span className="text-[10px] text-foreground/50 ml-1 mt-[1px]">(12)</span>
        </div>

        {/* Price (Distinct 8px margin top) */}
        <div className="flex items-center justify-center gap-3 text-sm mt-3">
          {discountPrice ? (
            <>
              <span className="text-foreground/50 line-through font-medium">{formatPrice(price)}</span>
              <span className="text-primary font-bold">{formatPrice(discountPrice)}</span>
            </>
          ) : (
            <span className="text-foreground font-medium">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
