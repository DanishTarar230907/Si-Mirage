'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Snappy but smooth spring for the Antigravity feel
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    document.documentElement.classList.add('hide-default-cursor');

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.documentElement.classList.remove('hide-default-cursor');
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .hide-default-cursor, .hide-default-cursor * {
            cursor: none !important;
          }
        }
      `}} />
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 64 : 16,
          height: isHovered ? 64 : 16,
        }}
        animate={{
          width: isHovered ? 64 : 16,
          height: isHovered ? 64 : 16,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="w-2 h-2 bg-black rounded-full"
          />
        )}
      </motion.div>
    </>
  );
}
