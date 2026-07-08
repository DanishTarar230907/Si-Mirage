'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const announcements = [
  "FREE SHIPPING ABOVE PKR 10,000",
  "SUMMER SALE UP TO 40%",
  "AUTHENTIC PREMIUM SUNGLASSES"
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-foreground text-background py-2 px-4 text-center relative z-50 overflow-hidden h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-[10px] sm:text-xs font-bold luxury-tracking uppercase absolute"
        >
          {announcements[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
