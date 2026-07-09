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
    <section ref={containerRef} className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="story-image relative aspect-[3/4] lg:aspect-auto lg:h-[800px] overflow-hidden bg-surface">
            <AdminEditable section="brandStory" field="image" type="image" className="w-full h-full">
              <Image
                src={story.image || '/images/20250201_233639.jpg'}
                alt="Si Mirage Craftsmanship"
                fill
                className="object-cover"
              />
            </AdminEditable>
          </div>
          
          <div className="lg:pl-10">
            <h4 className="story-text text-primary luxury-tracking uppercase text-xs font-bold mb-6">Our Heritage</h4>
            <AdminEditable section="brandStory" field="title" type="text">
              <h2 className="story-text text-4xl md:text-5xl lg:text-6xl font-light mb-10 leading-tight uppercase">
                {story.title}
              </h2>
            </AdminEditable>
            
            <AdminEditable section="brandStory" field="subtitle" type="textarea">
              <p className="story-text text-foreground/70 font-light leading-relaxed mb-6 text-lg">
                {story.subtitle}
              </p>
            </AdminEditable>
            
            <AdminEditable section="brandStory" field="description" type="textarea">
              <p className="story-text text-foreground/70 font-light leading-relaxed mb-12">
                {story.description || 'Every frame undergoes a meticulous 40-step manufacturing process. By combining aerospace-grade materials, rare Italian acetate, and zero-distortion UV400 lenses, we ensure that when you step into the light, you command the spotlight.'}
              </p>
            </AdminEditable>
            
            <div className="story-text grid grid-cols-2 gap-8 mb-12 border-t border-b border-foreground/10 py-8">
              <div>
                <AdminEditable section="brandStory" field="stat1_number" type="text">
                  <h5 className="text-3xl font-light mb-2 text-primary">{story.stat1_number}</h5>
                </AdminEditable>
                <AdminEditable section="brandStory" field="stat1_label" type="text">
                  <p className="text-xs uppercase luxury-tracking font-bold text-foreground">{story.stat1_label}</p>
                </AdminEditable>
              </div>
              <div>
                <AdminEditable section="brandStory" field="stat2_number" type="text">
                  <h5 className="text-3xl font-light mb-2 text-primary">{story.stat2_number}</h5>
                </AdminEditable>
                <AdminEditable section="brandStory" field="stat2_label" type="text">
                  <p className="text-xs uppercase luxury-tracking font-bold text-foreground">{story.stat2_label}</p>
                </AdminEditable>
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
