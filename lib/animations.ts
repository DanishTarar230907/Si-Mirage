// lib/animations.ts
import { Variants } from 'framer-motion';

// Standardized easing curve for luxury smooth feel (similar to Apple/Gentle Monster)
export const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]; // Custom cubic-bezier
export const SPRING_TRANSITION = { type: 'spring', stiffness: 100, damping: 20 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: LUXURY_EASE } 
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: LUXURY_EASE } }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.8, ease: LUXURY_EASE } 
  },
  exit: { opacity: 0, transition: { duration: 0.4, ease: LUXURY_EASE } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.8, ease: LUXURY_EASE } 
  },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: LUXURY_EASE } }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: LUXURY_EASE } 
  },
};

// A soft reveal suitable for large text
export const textReveal: Variants = {
  hidden: { opacity: 0, y: "100%", clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 1, ease: LUXURY_EASE }
  }
};

// Subtle background scale parallax effect
export const parallaxScale: Variants = {
  hidden: { scale: 1.1 },
  visible: { 
    scale: 1, 
    transition: { duration: 1.5, ease: 'easeOut' } 
  }
};

// Page transition variants for app/template.tsx
export const pageTransition: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)', scale: 0.98 },
  enter: { 
    opacity: 1, 
    filter: 'blur(0px)', 
    scale: 1,
    transition: { duration: 0.8, ease: LUXURY_EASE } 
  },
  exit: { 
    opacity: 0, 
    filter: 'blur(10px)', 
    scale: 1.02,
    transition: { duration: 0.5, ease: LUXURY_EASE } 
  }
};
