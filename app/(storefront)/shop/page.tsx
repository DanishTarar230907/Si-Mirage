'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Si Mirage Model ${i + 1}`,
  category: i % 3 === 0 ? 'Aviator' : i % 2 === 0 ? 'Wayfarer' : 'Round',
  price: 4999 + (i * 100),
  discountPrice: i % 4 === 0 ? 3999 : null,
  isNew: i < 3,
}));

export default function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <h1 className="text-4xl font-light mb-4 md:mb-0">ALL <span className="font-bold">COLLECTIONS</span></h1>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 border border-white/10 px-4 py-2 hover:border-primary transition-colors text-sm uppercase tracking-widest"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          
          <div className="relative group">
            <button className="flex items-center gap-2 border border-white/10 px-4 py-2 hover:border-primary transition-colors text-sm uppercase tracking-widest">
              Sort By <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar */}
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 flex-shrink-0"
          >
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-primary">Category</h3>
              <div className="flex flex-col gap-3 text-sm text-foreground/80">
                <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="accent-primary" /> Aviator
                </label>
                <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="accent-primary" /> Wayfarer
                </label>
                <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="accent-primary" /> Round
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isFilterOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-8 w-full transition-all duration-300`}>
          {mockProducts.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/product/${product.id}`} className="group cursor-pointer block">
                <div className="relative aspect-[4/5] bg-surface mb-6 overflow-hidden">
                  <Image
                    src={`https://placehold.co/600x800/111111/C0A062?text=Product+${product.id}+[Drive]`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-foreground text-background text-xs font-bold px-3 py-1 uppercase tracking-wider">
                        New
                      </span>
                    )}
                    {product.discountPrice && (
                      <span className="bg-primary text-background text-xs font-bold px-3 py-1 uppercase tracking-wider">
                        Sale
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-foreground/60 text-sm">{product.category}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {product.discountPrice ? (
                      <>
                        <span className="font-medium text-lg text-primary">Rs. {product.discountPrice}</span>
                        <span className="text-sm text-foreground/40 line-through">Rs. {product.price}</span>
                      </>
                    ) : (
                      <span className="font-medium text-lg">Rs. {product.price}</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
