'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Undo2, Edit, Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCmsData, useAdminContext } from '@/components/admin/AdminContext';
import AdminSectionWrapper from '@/components/admin/AdminSectionWrapper';

export default function AdminProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { cmsData } = useCmsData();
  const { updateCmsData, isEditMode } = useAdminContext();
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);

  // Find product dynamically from state
  const foundProduct = (cmsData.shopProducts || []).find(p => p.id === id);
  
  // Default values if not found or fallback
  const product = foundProduct || {
    id: id,
    name: `Si Mirage Model ${id}`,
    price: 5999,
    discountPrice: 4999,
    stock: 3,
    description: "Designed for the bold, this premium frame features cinematic styling with uncompromised durability. Complete with polarized lenses and aerospace-grade hinges.",
    colors: [
      { name: 'Midnight Black', hex: '#000000' },
      { name: 'Metallic Silver', hex: '#C0C0C0' },
      { name: 'Champagne Gold', hex: '#F7E7CE' },
    ],
    primaryImage: '/images/20250201_233239.jpg',
    hoverImage: '/images/20250201_233511.jpg'
  };

  const images = [
    product.primaryImage || product.image || '/images/20250201_233239.jpg',
    product.hoverImage || product.image || '/images/20250201_233511.jpg',
    '/images/20250201_233523.jpg',
    '/images/20250201_233639.jpg'
  ];

  const handleEditField = (field: string, promptText: string, currentValue: any) => {
    const newVal = prompt(promptText, currentValue);
    if (newVal === null) return;
    
    // Find index in cmsData.shopProducts
    const idx = cmsData.shopProducts.findIndex(p => p.id === id);
    if (idx === -1) return;
    
    const arr = [...cmsData.shopProducts];
    arr[idx] = {
      ...arr[idx],
      [field]: field === 'price' || field === 'discountPrice' || field === 'stock' ? Number(newVal.replace(/[^0-9]/g, '')) : newVal
    };
    updateCmsData('shopProducts', arr);
  };

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 text-foreground">
      <AdminSectionWrapper sectionId="shopProducts" sectionName="Product Details Editor">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
              {images.map((imgSrc, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-24 flex-shrink-0 bg-surface border transition-colors ${activeImage === index ? 'border-primary' : 'border-transparent hover:border-white/20'}`}
                >
                  <Image
                    src={imgSrc}
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
                    src={images[activeImage]}
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
          <div className="flex flex-col relative">
            {isEditMode && foundProduct && (
              <div className="absolute top-0 right-0 z-30 flex gap-2">
                <button
                  onClick={() => handleEditField('name', 'Product Name:', product.name)}
                  className="flex items-center gap-1 bg-black/90 text-[#C5A059] border border-[#C5A059]/40 px-2 py-1 text-[9px] uppercase tracking-widest font-bold hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Edit className="w-3 h-3" /> Edit Name
                </button>
              </div>
            )}

            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl font-light mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-foreground/60 underline cursor-pointer hover:text-primary">24 Reviews</span>
              </div>
              
              <div className="flex items-end gap-4 mb-6">
                <span className="text-3xl font-medium text-primary">
                  Rs. {typeof product.discountPrice === 'number' ? product.discountPrice.toLocaleString() : (product.price ? (Number(product.price.toString().replace(/[^0-9]/g, '')) * 0.9).toLocaleString() : '4,999')}
                </span>
                <span className="text-xl text-foreground/40 line-through pb-1">
                  Rs. {typeof product.price === 'number' ? product.price.toLocaleString() : (product.price ? product.price.toLocaleString() : '5,999')}
                </span>
                
                {isEditMode && foundProduct && (
                  <button
                    onClick={() => handleEditField('price', 'Raw Price Number (e.g. 35000):', product.price)}
                    className="p-1 hover:bg-white/5 border border-white/10 text-white rounded-sm ml-2 text-[9px] uppercase tracking-widest"
                  >
                    Set Price
                  </button>
                )}
              </div>
              
              <div className="relative">
                <p className="text-foreground/80 leading-relaxed font-light pr-8">
                  {product.description || 'Description details...'}
                </p>
                {isEditMode && foundProduct && (
                  <button
                    onClick={() => handleEditField('description', 'Description Text:', product.description)}
                    className="absolute top-0 right-0 p-1 hover:bg-white/5 text-white/60 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="h-px w-full bg-white/10 my-6" />

            {/* Color Selector */}
            <div className="mb-8">
              <h3 className="text-sm tracking-widest uppercase font-bold mb-4">Color: <span className="font-normal text-foreground/60">Midnight Black</span></h3>
              <div className="flex gap-4">
                {[
                  { name: 'Midnight Black', hex: '#000000' },
                  { name: 'Metallic Silver', hex: '#C0C0C0' },
                  { name: 'Champagne Gold', hex: '#F7E7CE' },
                ].map((color, idx) => (
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
            <div className="mb-8 flex items-center gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-red-950/30 text-red-400 px-4 py-2 text-sm border border-red-900/50"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Only {product.stock || 5} left in stock - order soon.
              </motion.div>
              {isEditMode && foundProduct && (
                <button
                  onClick={() => handleEditField('stock', 'Stock Quantity:', product.stock)}
                  className="px-2.5 py-1.5 border border-white/10 hover:border-[#C5A059] text-[9px] uppercase tracking-widest font-bold"
                >
                  Adjust Stock
                </button>
              )}
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
      </AdminSectionWrapper>
    </div>
  );
}
