'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'New Arrivals', href: '/shop?category=new-arrivals' },
    { name: 'Best Sellers', href: '/shop?category=best-sellers' },
  ];

  return (
    <div className="sticky top-0 z-[60] w-full flex flex-col shadow-sm">
      <AnnouncementBar />
      
      <header className="bg-[#FFFFFF] border-b border-foreground/10 py-5 transition-all duration-300">
        {/* Container with generous padding and strict CSS Grid (1fr auto 1fr) */}
        <div className="container mx-auto px-6 md:px-12 xl:px-16 grid grid-cols-[1fr_auto_1fr] items-center">
          
          {/* Left: Navigation (Desktop) / Hamburger (Mobile) */}
          <div className="flex items-center justify-start">
            <button 
              className="xl:hidden z-50 p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>

            <nav className="hidden xl:flex items-center gap-5 xl:gap-8 pr-4">
              {leftLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[10px] xl:text-xs tracking-[0.15em] uppercase font-medium transition-colors hover:text-primary group py-2 ${
                    pathname === link.href ? 'text-foreground' : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                  <span className={`absolute left-0 bottom-0 w-full h-[1px] bg-foreground transition-transform duration-300 origin-left ${
                    pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Focal Point Logo */}
          <div className="flex justify-center z-10">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
              <Image
                src="/logo.png"
                alt="Si Mirage Logo"
                width={160}
                height={50}
                className="object-contain h-8 xl:h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Right: Utility Icons */}
          <div className="flex items-center justify-end gap-5 xl:gap-8">
            <button className="text-foreground hover:text-primary transition-transform hover:scale-105 duration-300 hidden md:block">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <Link href="/wishlist" className="text-foreground hover:text-primary transition-transform hover:scale-105 duration-300 hidden md:block">
              <Heart className="w-5 h-5 stroke-[1.5]" />
            </Link>
            <Link href="/account" className="text-foreground hover:text-primary transition-transform hover:scale-105 duration-300 hidden md:block">
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>
            <Link href="/cart" className="text-foreground hover:text-primary transition-transform hover:scale-105 duration-300 relative flex items-center gap-2 group">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="text-xs font-bold tracking-[0.1em] mt-0.5">(0)</span>
              <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          </div>
          
        </div>

        {/* Mobile Full-Screen Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
              animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
              exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 top-[60px] z-40 bg-white/95 backdrop-blur-xl lg:hidden flex flex-col pt-10"
            >
              <div className="flex flex-col px-8 gap-8 overflow-y-auto pb-32">
                {leftLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-3xl font-light tracking-wide hover:text-primary transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="h-px w-full bg-foreground/10 my-4" 
                />
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-6"
                >
                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-light tracking-wide flex items-center gap-4 hover:text-primary transition-colors">
                    <Heart className="w-6 h-6 stroke-[1.5]" /> Wishlist
                  </Link>
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-light tracking-wide flex items-center gap-4 hover:text-primary transition-colors">
                    <User className="w-6 h-6 stroke-[1.5]" /> Account
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-light tracking-wide flex items-center gap-4 hover:text-primary transition-colors text-left">
                    <Search className="w-6 h-6 stroke-[1.5]" /> Search
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
