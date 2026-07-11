'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useCmsData } from '@/components/admin/AdminContext';
import AdminEditable from '@/components/admin/AdminEditable';

export default function BrandStoryEditorial() {
  const { cmsData } = useCmsData();
  const story = cmsData.brandStory;
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
    <section ref={containerRef} className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Text and Title on the left */}
          <div className="lg:pr-10">
            <h4 className="story-text text-black/60 font-sans luxury-tracking uppercase text-xs font-bold mb-6">Our Heritage</h4>
            <AdminEditable section="brandStory" field="title" type="text">
              <h2 className="story-text text-3xl md:text-5xl font-serif font-light text-black mb-10 leading-tight uppercase tracking-widest">
                {story.title}
              </h2>
            </AdminEditable>
            
            <AdminEditable section="brandStory" field="subtitle" type="textarea">
              <p className="story-text text-black/70 font-sans font-light leading-relaxed mb-6 text-lg">
                {story.subtitle}
              </p>
            </AdminEditable>
            
            <AdminEditable section="brandStory" field="description" type="textarea">
              <p className="story-text text-black/70 font-sans font-light leading-relaxed mb-12">
                {story.description || 'Every frame undergoes a meticulous 40-step manufacturing process. By combining aerospace-grade materials, rare Italian acetate, and zero-distortion UV400 lenses, we ensure that when you step into the light, you command the spotlight.'}
              </p>
            </AdminEditable>

            <div className="story-text">
              <Link href="/about" className="inline-flex items-center gap-4 border-b-2 border-black pb-2 text-xs uppercase font-sans tracking-[0.15em] font-bold text-black hover:text-black/70 hover:border-black/70 transition-colors">
                Read Our Full Story <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Stats in 2x2 grid on the right */}
          <div className="story-image grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center p-12 border border-black/10 bg-white shadow-sm">
              <AdminEditable section="brandStory" field="stat1_number" type="text">
                <h5 className="text-4xl md:text-5xl font-serif font-light mb-2 text-black">{story.stat1_number}</h5>
              </AdminEditable>
              <AdminEditable section="brandStory" field="stat1_label" type="text">
                <p className="text-[10px] uppercase font-sans tracking-widest font-bold text-black/50 text-center">{story.stat1_label}</p>
              </AdminEditable>
            </div>
            <div className="flex flex-col items-center justify-center p-12 border border-black/10 bg-white shadow-sm">
              <AdminEditable section="brandStory" field="stat2_number" type="text">
                <h5 className="text-4xl md:text-5xl font-serif font-light mb-2 text-black">{story.stat2_number}</h5>
              </AdminEditable>
              <AdminEditable section="brandStory" field="stat2_label" type="text">
                <p className="text-[10px] uppercase font-sans tracking-widest font-bold text-black/50 text-center">{story.stat2_label}</p>
              </AdminEditable>
            </div>
            {/* Added 2 more stats statically to complete the 2x2 grid shown in mockup */}
            <div className="flex flex-col items-center justify-center p-12 border border-black/10 bg-white shadow-sm">
              <h5 className="text-4xl md:text-5xl font-serif font-light mb-2 text-black">200K</h5>
              <p className="text-[10px] uppercase font-sans tracking-widest font-bold text-black/50 text-center">CUSTOMERS</p>
            </div>
            <div className="flex flex-col items-center justify-center p-12 border border-black/10 bg-white shadow-sm">
              <h5 className="text-4xl md:text-5xl font-serif font-light mb-2 text-black">38</h5>
              <p className="text-[10px] uppercase font-sans tracking-widest font-bold text-black/50 text-center">COUNTRIES</p>
            </div>
          </div>
          
        </div>
      </div>

    </section>
  );
}
