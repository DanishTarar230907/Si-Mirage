'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationControls() {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-1 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full p-1.5 shadow-lg">
      <button 
        onClick={() => router.back()}
        className="p-2 text-foreground/70 hover:text-primary hover:bg-foreground/5 rounded-full transition-all duration-300"
        aria-label="Go back"
        title="Go back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="w-[1px] h-5 bg-foreground/10 mx-1" />
      <button 
        onClick={() => router.forward()}
        className="p-2 text-foreground/70 hover:text-primary hover:bg-foreground/5 rounded-full transition-all duration-300"
        aria-label="Go forward"
        title="Go forward"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
