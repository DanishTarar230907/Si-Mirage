'use client';

import { useEffect, useRef } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const services = [
  { icon: Star, title: "Premium Materials", desc: "Handcrafted Mazzucchelli acetate." },
  { icon: ShieldCheck, title: "Polarized Clarity", desc: "Advanced UV400 lenses with anti-reflection." },
  { icon: Truck, title: "Complimentary Delivery", desc: "Free express shipping nationwide." },
  { icon: RotateCcw, title: "Lifetime Warranty", desc: "Guaranteed craftsmanship on all frames." },
];

export default function PremiumServices() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(containerRef.current?.children as HTMLCollection, 
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
  }, []);

  return (
    <section className="py-16 bg-[#FAFAFA] overflow-hidden">
      <div className="container mx-auto px-8">
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {services.map((Service, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <Service.icon className="w-7 h-7 text-black stroke-[1.5] mb-6 group-hover:scale-110 luxury-transition" />
              <h3 className="text-sm font-bold uppercase tracking-[1.5px] mb-3 text-black">{Service.title}</h3>
              <p className="text-[#666666] text-sm font-light leading-relaxed max-w-xs">{Service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
