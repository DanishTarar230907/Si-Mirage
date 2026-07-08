'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

const filterOptions: FilterOption[] = [
  { label: 'All Frames', value: 'all', count: 16 },
  { label: 'Best Sellers', value: 'best-seller', count: 8 },
  { label: 'Limited Edition', value: 'limited', count: 5 },
  { label: 'Restocked', value: 'restocked', count: 3 },
  { label: 'Aviator', value: 'aviator', count: 2 },
  { label: 'Wayfarer', value: 'wayfarer', count: 2 },
  { label: 'Round', value: 'round', count: 2 },
  { label: 'Square', value: 'square', count: 2 },
];

interface StickyFilterNavProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

export default function StickyFilterNav({ activeFilter, onFilterChange }: StickyFilterNavProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`z-50 transition-all duration-500 ${
        isSticky
          ? 'fixed top-0 left-0 right-0 bg-[#F9F9F9]/95 backdrop-blur-md border-b border-black/5 shadow-sm'
          : 'relative bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex items-center gap-8 overflow-x-auto py-5 scrollbar-hide">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className="group relative flex flex-col items-center gap-2 whitespace-nowrap"
              >
                <span
                  className={`text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300 ${
                    isActive ? 'text-[#121212]' : 'text-[#121212]/40 hover:text-[#121212]/70'
                  }`}
                >
                  {option.label}
                  {option.count && (
                    <span className="ml-2 text-[10px] font-normal opacity-50">
                      ({option.count})
                    </span>
                  )}
                </span>
                
                {/* Animated Underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#C5A059]"
                  initial={false}
                  animate={{
                    width: isActive ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
