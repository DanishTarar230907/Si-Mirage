'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

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
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 20 });
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXVal = (e.clientX - rect.left) / width - 0.5;
    const mouseYVal = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseXVal);
    y.set(mouseYVal);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <motion.article
        initial={{ opacity: 0, y: 60, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative perspective-1000 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseLeave();
        }}
      >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        className="relative"
      >
        {/* Card Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] border border-black/10 hover:border-[#C5A059]/50 transition-colors duration-500">
          
          {/* Primary Image */}
          <motion.div
            style={{ transformStyle: 'preserve-3d', translateZ: 20 }}
            className="absolute inset-0"
          >
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 ease-in-out"
              style={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 1.1 : 1 }}
            />
          </motion.div>
          
          {/* Hover Image */}
          <motion.div
            style={{ transformStyle: 'preserve-3d', translateZ: 20 }}
            className="absolute inset-0"
          >
            <Image
              src={product.hoverImage}
              alt={`${product.name} alternate view`}
              fill
              className="object-cover transition-all duration-700 ease-in-out"
              style={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.1 : 1 }}
            />
          </motion.div>

          {/* Badge */}
          {product.badge && (
            <motion.div
              style={{ transformStyle: 'preserve-3d', translateZ: 40 }}
              className="absolute left-4 top-4 z-10"
            >
              <span
                className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] backdrop-blur-md ${
                  product.badge === 'Best Seller'
                    ? 'bg-[#C5A059]/90 text-black'
                    : 'bg-black/90 text-white'
                }`}
              >
                {product.badge}
              </span>
            </motion.div>
          )}

          {/* Quick Add Button */}
          <motion.div
            style={{ transformStyle: 'preserve-3d', translateZ: 50 }}
            initial={{ y: '100%' }}
            animate={{ y: isHovered ? 0 : '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 z-20 p-4"
          >
            <button className="w-full bg-[#121212] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#C5A059] hover:scale-105">
              Quick Add
            </button>
          </motion.div>

          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500"
            style={{ opacity: isHovered ? 1 : 0.5 }}
          />
        </div>

        {/* Product Details */}
        <motion.div
          style={{ transformStyle: 'preserve-3d', translateZ: 30 }}
          className="mt-6 space-y-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">
                {product.category}
              </p>
              <h3 className="mt-1 text-base font-medium tracking-wide text-[#121212] group-hover:text-[#C5A059] transition-colors">
                {product.name}
              </h3>
            </div>
            <p className="text-sm font-medium text-[#121212]">{product.price}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
    </Link>
  );
}
