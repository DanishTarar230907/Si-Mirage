'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Palette, Monitor, Zap } from 'lucide-react';
import { brandAssets } from '@/config/brandAssets';

export default function GraphicDesignersSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.designer-text',
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    );

    gsap.fromTo('.designer-image',
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-surface overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="order-2 lg:order-1">
            <h4 className="designer-text text-primary luxury-tracking uppercase text-xs font-bold mb-6">Professional Series</h4>
            <h2 className="designer-text text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              DESIGNED FOR <br/>
              <span className="font-medium">CREATIVE MINDS</span>
            </h2>
            <p className="designer-text text-foreground/70 font-light leading-relaxed mb-10 text-lg max-w-lg">
              Engineered for designers who spend long hours creating without compromising comfort or style. Eliminate eye strain while maintaining a sophisticated studio appearance.
            </p>
            
            <div className="designer-text grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="flex flex-col gap-3 border-l border-foreground/10 pl-4">
                <Monitor className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold uppercase luxury-tracking">Blue-Light<br/>Protection</span>
              </div>
              <div className="flex flex-col gap-3 border-l border-foreground/10 pl-4">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold uppercase luxury-tracking">Ultra<br/>Lightweight</span>
              </div>
              <div className="flex flex-col gap-3 border-l border-foreground/10 pl-4 bg-primary/5 p-4 rounded-sm border-l-primary">
                <Palette className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold uppercase luxury-tracking text-primary">15% Student<br/>Discount</span>
              </div>
            </div>

            <div className="designer-text">
              <Link href="/shop?category=professionals" className="inline-flex items-center gap-4 border-b border-foreground pb-2 text-xs uppercase luxury-tracking font-bold hover:text-primary hover:border-primary luxury-transition">
                Shop The Collection <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 designer-image relative aspect-square lg:aspect-[4/5] bg-background shadow-2xl p-4">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={brandAssets.promos.graphicDesigners}
                alt="Graphic Designer Workspace"
                fill
                className="object-cover hover:scale-105 luxury-transition duration-1000"
              />
              {/* Subtle UI Overlay elements to mimic designer workspace */}
              <div className="absolute top-6 right-6 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 shadow-lg">
                <span className="text-xs font-bold uppercase luxury-tracking text-black flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Creative Flow State
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
