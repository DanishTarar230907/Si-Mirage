'use client';

import { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCmsData } from '@/components/admin/AdminContext';
import AdminEditable from '@/components/admin/AdminEditable';

export default function BrandVideoHero() {
  const { cmsData } = useCmsData();
  const video = cmsData.videoHero;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo('.video-content',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="relative h-[80vh] md:h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <AdminEditable section="videoHero" field="src" type="video" className="w-full h-full">
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 min-h-[80vh]"
          />
        </AdminEditable>

        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center video-content flex flex-col items-center">
        <button className="group w-24 h-24 md:w-32 md:h-32 border border-white/30 rounded-full flex items-center justify-center mb-8 hover:bg-white hover:border-white luxury-transition backdrop-blur-sm shadow-2xl relative">
          <div className="absolute inset-0 rounded-full bg-white/20 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-0 animate-ping transition-all duration-1000" />
          <Play className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:text-black ml-2 transition-colors" />
        </button>
        <AdminEditable section="videoHero" field="poster" type="image">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-light text-white tracking-tight drop-shadow-2xl">
            WATCH OUR <span className="font-medium italic">STORY</span>
          </h2>
        </AdminEditable>
      </div>

    </section>
  );
}
