'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Direction the content travels from. */
  direction?: Direction;
  /** Seconds to delay the reveal. */
  delay?: number;
  /** Travel distance in pixels. */
  distance?: number;
  /** Reveal only the first time it enters the viewport. */
  once?: boolean;
  as?: 'div' | 'section' | 'span' | 'li' | 'article';
}

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export default function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  distance,
  once = true,
  as = 'div',
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  const base = offset[direction];
  const from = distance
    ? {
        x: base.x === 0 ? 0 : Math.sign(base.x) * distance,
        y: base.y === 0 ? 0 : Math.sign(base.y) * distance,
      }
    : base;

  const variants: Variants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, x: from.x, y: from.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
    >
      {children}
    </MotionTag>
  );
}
