'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Video, Mic, Camera, Handshake } from 'lucide-react';
import { brandAssets } from '@/config/brandAssets';

export default function ContentCreatorsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.creator-image',
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    );

    gsap.fromTo('.creator-text',
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
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="creator-image relative aspect-[4/5] bg-surface">
            <Image
              src={brandAssets.promos.contentCreators}
              alt="Content Creator Studio"
              fill
              className="object-cover"
            />
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase luxury-tracking font-bold text-white/70">Recording</p>
                <p className="text-sm font-medium">Studio Setup 01</p>
              </div>
            </div>
          </div>

          <div className="lg:pl-10">
            <h4 className="creator-text text-primary luxury-tracking uppercase text-xs font-bold mb-6">Creator Series</h4>
            <h2 className="creator-text text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              BUILT FOR <br/>
              <span className="font-medium">MODERN CREATORS</span>
            </h2>
            <p className="creator-text text-foreground/70 font-light leading-relaxed mb-10 text-lg">
              Whether you're filming YouTube videos, creating Instagram content, or producing cinematic reels, Si Mirage helps you look your absolute best on camera with anti-glare technology and bold silhouettes.
            </p>
            
            <div className="creator-text grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                  <Handshake className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-bold uppercase luxury-tracking">Creator Program</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                  <Mic className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-bold uppercase luxury-tracking">Affiliate Program</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                  <Camera className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-sm font-bold uppercase luxury-tracking">Collabs</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">%</span>
                </div>
                <span className="text-sm font-bold uppercase luxury-tracking text-primary">Creator Discounts</span>
              </div>
            </div>

            <div className="creator-text flex flex-wrap gap-6">
              <Link href="/creators" className="group inline-flex items-center justify-center gap-4 bg-foreground text-background px-8 py-4 uppercase luxury-tracking text-[10px] font-bold hover:bg-primary hover:text-white luxury-transition">
                Join Creator Program
              </Link>
              <Link href="/about-creators" className="group inline-flex items-center justify-center gap-2 border-b border-foreground pb-1 text-[10px] uppercase luxury-tracking font-bold hover:text-primary hover:border-primary luxury-transition">
                Learn More <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
