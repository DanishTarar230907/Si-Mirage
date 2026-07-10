'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    // Respect users who prefer reduced motion: skip momentum scrolling entirely.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Basic anchor handling that works whether or not Lenis is active.
    const handleAnchorClick = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(element as HTMLElement, { offset: -80 });
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return null;
}
