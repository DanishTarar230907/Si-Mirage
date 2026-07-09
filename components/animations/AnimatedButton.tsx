'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function AnimatedButton({ 
  children, 
  className = '', 
  onClick,
  variant = 'primary' 
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-[#D4AF37] text-black hover:bg-white',
    secondary: 'bg-[#1A1A1A] text-[#FAFAFA] hover:bg-[#D4AF37] hover:text-black',
    outline: 'border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
