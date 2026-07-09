'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCmsData } from '@/components/admin/AdminContext';

export default function ReviewCarousel() {
  const { cmsData } = useCmsData();
  const reviews = cmsData.testimonials || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle out of bounds
  useEffect(() => {
    if (currentIndex >= reviews.length) {
      setCurrentIndex(0);
    }
  }, [reviews.length, currentIndex]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.review-header',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  if (reviews.length === 0) return null;

  return (


    <section ref={containerRef} className="py-24 md:py-32 bg-surface overflow-hidden">
      <div className="container mx-auto px-8 max-w-4xl text-center">
        
        <div className="review-header mb-16">
          <h4 className="text-primary luxury-tracking uppercase text-xs font-bold mb-4">Testimonials</h4>
          <h2 className="text-3xl md:text-5xl font-light text-foreground">THE <span className="font-medium">VERDICT</span></h2>
        </div>

        <div className="relative h-[300px] md:h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute w-full flex flex-col items-center"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-foreground/80 italic">
                &quot;{reviews[currentIndex].review}&quot;
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image src={reviews[currentIndex].avatar} alt={reviews[currentIndex].name} fill className="object-cover" />
                </div>
                <div className="text-left">
                  <h5 className="font-bold text-sm uppercase luxury-tracking text-foreground">{reviews[currentIndex].name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-foreground/50">{reviews[currentIndex].location}</span>
                    <span className="w-1 h-1 rounded-full bg-foreground/20" />
                    <span className="text-[10px] text-green-600 font-bold uppercase luxury-tracking flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12">
          <button 
            onClick={prev}
            className="w-12 h-12 border border-foreground/10 rounded-full flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${currentIndex === idx ? 'bg-primary' : 'bg-foreground/20'}`}
              />
            ))}
          </div>
          <button 
            onClick={next}
            className="w-12 h-12 border border-foreground/10 rounded-full flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
