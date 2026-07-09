'use client';

import { useEffect, useRef } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCmsData } from '@/components/admin/AdminContext';
import AdminEditable from '@/components/admin/AdminEditable';

const ICONS = [Star, ShieldCheck, Truck, RotateCcw];

export default function PremiumServices() {
  const { cmsData } = useCmsData();
  const services = cmsData.services || [];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children as HTMLCollection, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      );
    }
  }, [services.length]);

  return (
    <section className="py-16 bg-[#FAFAFA] overflow-hidden">
      <div className="container mx-auto px-8">
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {services.map((service, idx) => {
            const IconComponent = ICONS[idx % ICONS.length];
            return (
              <div key={idx} className="flex flex-col items-center">
                <IconComponent className="w-7 h-7 text-black stroke-[1.5] mb-6 group-hover:scale-110 luxury-transition" />
                
                <AdminEditable section="services" field="title" index={idx} type="text">
                  <h3 className="text-sm font-bold uppercase tracking-[1.5px] mb-3 text-black">
                    {service.title}
                  </h3>
                </AdminEditable>

                <AdminEditable section="services" field="desc" index={idx} type="textarea">
                  <p className="text-[#666666] text-sm font-light leading-relaxed max-w-xs">
                    {service.desc}
                  </p>
                </AdminEditable>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
