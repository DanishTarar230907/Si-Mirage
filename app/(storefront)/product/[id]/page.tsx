'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Undo2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);

  const product = {
    name: `Si Mirage Model ${id}`,
    price: 5999,
    discountPrice: 4999,
    stock: 3, // Low stock for urgency
    description: "Designed for the bold, this premium frame features cinematic styling with uncompromised durability. Complete with polarized lenses and aerospace-grade hinges.",
    colors: [
      { name: 'Midnight Black', hex: '#000000' },
      { name: 'Metallic Silver', hex: '#C0C0C0' },
      { name: 'Champagne Gold', hex: '#F7E7CE' },
    ]
  };

  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
            {[0, 1, 2, 3].map((index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative w-20 h-24 flex-shrink-0 bg-surface border transition-colors ${activeImage === index ? 'border-primary' : 'border-transparent hover:border-white/20'}`}
              >
                <Image
                  src={`https://placehold.co/400x500/111111/C0A062?text=Thumb+${index}+[Drive]`}
                  alt={`Thumbnail ${index}`}
                  fill
                  sizes="80px"
                  className="object-cover opacity-80"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-full aspect-[4/5] bg-surface flex-grow group cursor-zoom-in overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={`https://placehold.co/800x1000/111111/C0A062?text=Main+Image+${activeImage}+[Drive]`}
                  alt="Main Product"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-primary text-background text-xs font-bold px-3 py-1 uppercase tracking-wider">Sale</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl md:text-5xl font-light mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-primary">
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm text-foreground/60 underline cursor-pointer hover:text-primary">24 Reviews</span>
            </div>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-medium text-primary">Rs. {product.discountPrice}</span>
              <span className="text-xl text-foreground/40 line-through pb-1">Rs. {product.price}</span>
            </div>
            
            <p className="text-foreground/80 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          <div className="h-px w-full bg-white/10 my-6" />

          {/* Color Selector */}
          <div className="mb-8">
            <h3 className="text-sm tracking-widest uppercase font-bold mb-4">Color: <span className="font-normal text-foreground/60">{product.colors[selectedColor].name}</span></h3>
            <div className="flex gap-4">
              {product.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === idx ? 'border-primary p-1' : 'border-transparent p-0'}`}
                >
                  <div className="w-full h-full rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* Stock Indicator */}
          <div className="mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-red-950/30 text-red-400 px-4 py-2 text-sm border border-red-900/50"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Only {product.stock} left in stock - order soon.
            </motion.div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center border border-white/20 px-4 h-14 w-full sm:w-32 justify-between">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-foreground/60 hover:text-primary transition-colors p-2"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-foreground/60 hover:text-primary transition-colors p-2"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button className="flex-1 h-14 bg-primary text-background flex items-center justify-center gap-3 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Add To Cart
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-white/10">
            <div className="flex flex-col items-center text-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <span className="text-xs tracking-wider uppercase text-foreground/80">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <Undo2 className="w-6 h-6 text-primary" />
              <span className="text-xs tracking-wider uppercase text-foreground/80">30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="text-xs tracking-wider uppercase text-foreground/80">1 Year Warranty</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
