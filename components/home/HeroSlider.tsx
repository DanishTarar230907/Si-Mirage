'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { brandAssets } from '@/config/brandAssets';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = brandAssets.hero;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section ref={containerRef} className="relative h-[85vh] max-h-[85vh] w-full overflow-hidden bg-background">
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <motion.div style={{ y }} className="relative w-full h-[110%] -top-[5%]">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Contrast Overlay */}
            <div 
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Hero Content (Flex Stacking, No Absolute Overlap) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full max-w-5xl pointer-events-auto"
          >
            <h2 className="text-white/90 text-[14px] font-semibold tracking-[2px] uppercase mb-6 drop-shadow-md">
              {slides[currentSlide].subtitle}
            </h2>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-10 tracking-tight leading-tight drop-shadow-2xl">
              {slides[currentSlide].title.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'font-medium italic' : ''}>{word} </span>
              ))}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-none uppercase tracking-[0.15em] text-[13px] font-bold hover:opacity-80 transition-opacity shadow-2xl min-w-[200px]"
              >
                {slides[currentSlide].cta1}
              </Link>
              <Link 
                href="/collections" 
                className="inline-flex items-center justify-center bg-transparent border border-white text-white px-8 py-4 rounded-none uppercase tracking-[0.15em] text-[13px] font-bold hover:bg-white hover:text-black transition-all duration-300 min-w-[200px]"
              >
                {slides[currentSlide].cta2}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 inset-x-0 z-20 container mx-auto px-8 flex items-end justify-between pointer-events-none">
        
        {/* Pagination Indicators */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-500 rounded-full ${
                currentSlide === idx ? 'w-16 h-1 bg-white' : 'w-2 h-1 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="hidden md:flex gap-4 pointer-events-auto">
          <button 
            onClick={prevSlide}
            className="w-14 h-14 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5 ml-[-2px]" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-14 h-14 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5 mr-[-2px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
