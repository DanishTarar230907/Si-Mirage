'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Undo2, ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function ProductDetailClient({ product }: { product: any }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, title: '', comment: '' });
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const allImages: string[] = [];
  if (product.image_url) allImages.push(product.image_url);
  if (product.hover_image_url) allImages.push(product.hover_image_url);
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: string) => {
      if (!allImages.includes(img)) allImages.push(img);
    });
  }
  if (product.product_images && Array.isArray(product.product_images)) {
    const sorted = [...product.product_images].sort((a, b) => a.display_order - b.display_order);
    sorted.forEach(pi => {
      if (!allImages.includes(pi.image_url)) allImages.push(pi.image_url);
    });
  }
  if (allImages.length === 0) allImages.push('/images/20250201_233239.jpg');

  const activeImgUrl = allImages[activeImage] || allImages[0];
  const hasVariants = product.product_variants && product.product_variants.length > 0;
  const currentPrice = hasVariants ? Number(product.price) + Number(product.product_variants[selectedVariant].price_adjustment || 0) : Number(product.price);
  const stock = hasVariants ? product.product_variants[selectedVariant].stock_quantity : product.stock_quantity;
  const reviewsCount = product.product_reviews?.length || 0;
  const avgRating = reviewsCount > 0 
    ? (product.product_reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsCount).toFixed(1) 
    : 5.0;

  const handleAddToCart = () => {
    addItem({
      id: hasVariants ? `${product.id}-${product.product_variants[selectedVariant].id}` : product.id,
      productId: product.id,
      name: product.name,
      variantName: hasVariants ? product.product_variants[selectedVariant].name : undefined,
      price: product.discount_price || currentPrice,
      quantity,
      image: activeImgUrl,
      sku: hasVariants ? product.product_variants[selectedVariant].sku : product.sku,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewStatus('submitting');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, productId: product.id })
      });
      if (res.ok) {
        setReviewStatus('success');
        setReviewForm({ name: '', rating: 5, title: '', comment: '' });
      } else {
        setReviewStatus('idle');
        alert('Failed to submit review');
      }
    } catch (e) {
      setReviewStatus('idle');
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="container mx-auto px-6 py-8 md:py-16">
        
        <nav className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-black/40 mb-12">
          <Link href="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#C5A059] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category?.toLowerCase()}`} className="hover:text-[#C5A059] transition-colors">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
          
          {/* LEFT COL: Image Gallery (Scrollable) */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-6">
            <div className="hidden md:flex flex-col gap-4 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar">
              {allImages.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-24 flex-shrink-0 bg-white border transition-all duration-300 ${activeImage === index ? 'border-[#C5A059] shadow-md scale-105' : 'border-black/5 hover:border-black/20'}`}
                >
                  <Image src={img} alt={`Thumb ${index}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>

            <div className="relative w-full aspect-[4/5] bg-white overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImgUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center transform transition-transform duration-[20s] group-hover:scale-110 cursor-zoom-in"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-6 left-6 flex gap-2">
                {product.discount_price && <span className="bg-[#121212] text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest">Sale</span>}
                {product.is_new && <span className="bg-white text-black border border-black/10 text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest">New</span>}
                {product.badge && <span className="bg-[#C5A059] text-black text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest">{product.badge}</span>}
              </div>
            </div>
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-4 overflow-x-auto pb-4 no-scrollbar">
              {allImages.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-24 flex-shrink-0 bg-white border ${activeImage === index ? 'border-[#C5A059]' : 'border-transparent'}`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COL: Sticky Product Info */}
          <div className="w-full lg:w-[40%] sticky top-32 flex flex-col">
            <h1 className="text-4xl md:text-5xl font-serif text-[#121212] mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/10">
              <div className="flex text-[#C5A059]">
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`w-4 h-4 ${star <= Math.round(Number(avgRating)) ? 'fill-current' : 'fill-current opacity-30'}`} />)}
              </div>
              <span className="text-sm text-black/60 cursor-pointer hover:text-[#C5A059] transition-colors">{reviewsCount} Reviews</span>
            </div>
            
            <div className="flex items-end gap-4 mb-8">
              <span className="text-3xl font-light text-[#121212]">Rs. {product.discount_price || currentPrice}</span>
              {product.discount_price && <span className="text-xl text-black/40 line-through pb-1">Rs. {currentPrice}</span>}
            </div>
            
            <p className="text-black/70 leading-relaxed font-light mb-8 text-sm md:text-base">
              {product.short_description || product.description}
            </p>

            {hasVariants && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs tracking-widest uppercase font-semibold text-black">Variant: <span className="font-normal text-black/60 ml-2">{product.product_variants[selectedVariant].name}</span></h3>
                  {product.product_variants[selectedVariant].sku && <span className="text-[10px] text-black/40 font-mono tracking-wider">SKU: {product.product_variants[selectedVariant].sku}</span>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.product_variants.map((variant: any, idx: number) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(idx)}
                      className={`px-5 py-3 text-[11px] font-medium uppercase tracking-widest transition-all duration-300 ${selectedVariant === idx ? 'bg-[#121212] text-white' : 'bg-white text-black/70 hover:bg-black/5 border border-black/10'}`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              {stock > 0 ? (
                stock <= 5 ? (
                  <div className="inline-flex items-center gap-2 text-red-700 text-xs font-semibold uppercase tracking-widest bg-red-50 px-4 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    Only {stock} remaining
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-green-700 text-xs font-semibold uppercase tracking-widest bg-green-50 px-4 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    In Stock
                  </div>
                )
              ) : (
                <div className="inline-flex items-center gap-2 text-black/50 text-xs font-semibold uppercase tracking-widest bg-black/5 px-4 py-2">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-black/20 bg-white px-4 h-14 w-full sm:w-32 justify-between">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-black/60 hover:text-[#C5A059] p-2"><Minus className="w-4 h-4" /></button>
                <span className="font-medium text-black">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= stock} className="text-black/60 hover:text-[#C5A059] p-2"><Plus className="w-4 h-4" /></button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className={`flex-1 h-14 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs font-semibold transition-all duration-300 ${stock > 0 ? (added ? 'bg-green-600 text-white' : 'bg-[#121212] text-white hover:bg-[#C5A059]') : 'bg-black/10 text-black/40 cursor-not-allowed'}`}
              >
                {added ? 'Added to Bag' : (stock > 0 ? 'Add to Bag' : 'Sold Out')}
              </button>
            </div>

            {/* Luxury Brand Guarantees */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-black/10 mb-10">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-[#C5A059]" />
                <span className="text-[9px] tracking-widest uppercase text-black/60 font-semibold">Complimentary<br/>Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Undo2 className="w-5 h-5 text-[#C5A059]" />
                <span className="text-[9px] tracking-widest uppercase text-black/60 font-semibold">30-Day<br/>Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <span className="text-[9px] tracking-widest uppercase text-black/60 font-semibold">Atelier<br/>Warranty</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="flex flex-col border-t border-black/10">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <div key={tab} className="border-b border-black/10">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === tab ? null : tab)}
                    className="w-full flex justify-between items-center py-5 text-xs font-semibold uppercase tracking-widest text-[#121212] hover:text-[#C5A059] transition-colors"
                  >
                    {tab === 'reviews' ? `Client Reviews (${reviewsCount})` : tab}
                    <motion.div animate={{ rotate: openAccordion === tab ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="w-4 h-4" /></motion.div>
                  </button>
                  <AnimatePresence>
                    {openAccordion === tab && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pt-2 text-sm text-black/70 font-light leading-relaxed">
                          
                          {/* Description Tab Content */}
                          {tab === 'description' && (
                            <div className="whitespace-pre-line">
                              {product.long_description || product.description}
                              {product.features && (
                                <ul className="list-disc pl-5 mt-6 space-y-2">
                                  {Array.isArray(product.features) ? product.features.map((f: string, i: number) => <li key={i}>{f}</li>) : <li>Premium construction</li>}
                                </ul>
                              )}
                            </div>
                          )}

                          {/* Specifications Tab Content */}
                          {tab === 'specifications' && (
                            <div className="grid grid-cols-1 gap-y-3">
                              {product.specifications ? Object.entries(product.specifications).map(([key, val]: any, i) => (
                                <div key={i} className="flex justify-between border-b border-black/5 pb-2">
                                  <span className="font-medium text-black capitalize">{key.replace('_', ' ')}</span>
                                  <span>{val}</span>
                                </div>
                              )) : <p>No technical specifications available.</p>}
                            </div>
                          )}

                          {/* Reviews Tab Content */}
                          {tab === 'reviews' && (
                            <div className="flex flex-col gap-8">
                              {reviewsCount > 0 ? product.product_reviews.map((r: any) => (
                                <div key={r.id} className="border-b border-black/5 pb-6 last:border-0">
                                  <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                      <span className="font-semibold text-black">{r.customer_name}</span>
                                      {r.is_verified_purchase && <span className="text-[9px] bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded-sm uppercase tracking-widest">Verified</span>}
                                    </div>
                                    <span className="text-[10px] text-black/40">{new Date(r.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex text-[#C5A059] mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`w-3 h-3 ${star <= r.rating ? 'fill-current' : 'fill-current opacity-30'}`} />)}
                                  </div>
                                  {r.title && <h5 className="font-medium text-black mb-1">{r.title}</h5>}
                                  <p>{r.comment}</p>
                                </div>
                              )) : <p className="italic text-black/50">Be the first to review this exceptional piece.</p>}
                              
                              {/* Write a Review Form */}
                              <div className="mt-8 bg-white p-6 border border-black/5">
                                <h4 className="text-xs font-semibold uppercase tracking-widest text-black mb-6">Write a Review</h4>
                                {reviewStatus === 'success' ? (
                                  <div className="bg-green-50 text-green-800 p-4 text-center text-sm border border-green-200">Thank you for your review. It has been submitted for approval.</div>
                                ) : (
                                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                                    <div>
                                      <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2 text-black/60">Rating</label>
                                      <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <button type="button" key={star} onClick={() => setReviewForm({...reviewForm, rating: star})}>
                                            <Star className={`w-5 h-5 ${star <= reviewForm.rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-black/20'}`} />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2 text-black/60">Name</label>
                                      <input required type="text" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full bg-transparent border-b border-black/20 pb-2 outline-none focus:border-[#C5A059] transition-colors" placeholder="Your name" />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2 text-black/60">Title</label>
                                      <input required type="text" value={reviewForm.title} onChange={e => setReviewForm({...reviewForm, title: e.target.value})} className="w-full bg-transparent border-b border-black/20 pb-2 outline-none focus:border-[#C5A059] transition-colors" placeholder="Review title" />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2 text-black/60">Comment</label>
                                      <textarea required value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full bg-transparent border-b border-black/20 pb-2 outline-none focus:border-[#C5A059] transition-colors resize-none" placeholder="Share your experience..." />
                                    </div>
                                    <button disabled={reviewStatus === 'submitting'} type="submit" className="mt-4 w-full bg-[#121212] text-white py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors disabled:opacity-50">
                                      {reviewStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                  </form>
                                )}
                              </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
