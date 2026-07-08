'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { brandAssets } from '@/config/brandAssets';

export default function BrandStoryEditorial() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.story-text',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    );

    gsap.fromTo('.story-image',
      { opacity: 0, scale: 0.95, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
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
    <section ref={containerRef} className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="story-image relative aspect-[3/4] lg:aspect-auto lg:h-[800px] overflow-hidden bg-surface">
            <Image
              src={brandAssets.story.image}
              alt="Si Mirage Craftsmanship"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="lg:pl-10">
            <h4 className="story-text text-primary luxury-tracking uppercase text-xs font-bold mb-6">Our Heritage</h4>
            <h2 className="story-text text-4xl md:text-5xl lg:text-6xl font-light mb-10 leading-tight">
              CRAFTED FOR THE <br/>
              <span className="font-medium italic">VISIONARIES</span>
            </h2>
            
            <p className="story-text text-foreground/70 font-light leading-relaxed mb-6 text-lg">
              Si Mirage was born from a desire to break the monotony of conventional eyewear. We don't just design sunglasses; we craft cinematic experiences that you wear.
            </p>
            
            <p className="story-text text-foreground/70 font-light leading-relaxed mb-12">
              Every frame undergoes a meticulous 40-step manufacturing process. By combining aerospace-grade materials, rare Italian acetate, and zero-distortion UV400 lenses, we ensure that when you step into the light, you command the spotlight.
            </p>
            
            <div className="story-text grid grid-cols-2 gap-8 mb-12 border-t border-b border-foreground/10 py-8">
              <div>
                <h5 className="text-3xl font-light mb-2 text-primary">40+</h5>
                <p className="text-xs uppercase luxury-tracking font-bold text-foreground">Step Process</p>
              </div>
              <div>
                <h5 className="text-3xl font-light mb-2 text-primary">100%</h5>
                <p className="text-xs uppercase luxury-tracking font-bold text-foreground">UV400 Protection</p>
              </div>
            </div>

            <div className="story-text">
              <Link href="/about" className="inline-flex items-center gap-4 border-b border-foreground pb-2 text-xs uppercase luxury-tracking font-bold hover:text-primary hover:border-primary luxury-transition">
                Read Our Full Story <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
