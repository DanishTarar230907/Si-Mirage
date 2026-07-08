'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, User, Heart, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';

type NavPanelItem = {
  title: string;
  description: string;
  href: string;
  image: string;
};

const navPanels: Record<string, { items: NavPanelItem[]; intro: string }> = {
  Home: {
    intro: 'Discover our signature frames and editorial collections.',
    items: [
      {
        title: 'The Signature Aviator',
        description: '24k gold detail and sculptural comfort.',
        href: '/shop?category=aviator',
        image: '/images/20250201_233511.jpg',
      },
      {
        title: 'Midnight Edit',
        description: 'Shadow-toned frames for a cinematic presence.',
        href: '/shop?category=round',
        image: '/images/20250201_233523.jpg',
      },
      {
        title: 'Luxury Atelier',
        description: 'Rare acetate and precision lenses.',
        href: '/shop?category=luxury',
        image: '/images/20250201_233639.jpg',
      },
    ],
  },
  Shop: {
    intro: 'Explore curated styles designed for everyday elegance.',
    items: [
      {
        title: 'Aviator',
        description: 'Bold geometry. Lightweight engineering.',
        href: '/shop?category=aviator',
        image: '/images/20250201_233904.jpg',
      },
      {
        title: 'Wayfarer',
        description: 'Clean lines and effortless presence.',
        href: '/shop?category=wayfarer',
        image: '/images/20250201_234207.jpg',
      },
      {
        title: 'Round',
        description: 'A softer silhouette with rich detail.',
        href: '/shop?category=round',
        image: '/images/20250201_234211.jpg',
      },
    ],
  },
  Collections: {
    intro: 'Browse the premium capsule stories behind every frame.',
    items: [
      {
        title: 'Luxury Collection',
        description: 'Italian acetate and precious metal accents.',
        href: '/collections',
        image: '/images/20250201_233730.jpg',
      },
      {
        title: 'Everyday Essentials',
        description: 'Refined comfort for daily life.',
        href: '/collections',
        image: '/images/20250201_233723.jpg',
      },
      {
        title: 'Studio Limited',
        description: 'Small-batch styles with elevated finish.',
        href: '/collections',
        image: '/images/20250202_003807.jpg',
      },
    ],
  },
  'New Arrivals': {
    intro: 'Fresh from the atelier, just in time for the season.',
    items: [
      {
        title: 'Velvet Noir',
        description: 'A deep matte finish with a premium edge.',
        href: '/shop?category=new-arrivals',
        image: '/images/20250202_003823.jpg',
      },
      {
        title: 'Solstice Gold',
        description: 'A luminous frame for golden hour dressing.',
        href: '/shop?category=new-arrivals',
        image: '/images/20250202_003827.jpg',
      },
      {
        title: 'Riviera Soft',
        description: 'A lightweight silhouette with sculpted comfort.',
        href: '/shop?category=new-arrivals',
        image: '/images/20250202_003049.jpg',
      },
    ],
  },
  'Best Sellers': {
    intro: 'Our most loved silhouettes, consistently refined.',
    items: [
      {
        title: 'Parisian Edge',
        description: 'An all-time favorite with a sharp profile.',
        href: '/shop?category=best-sellers',
        image: '/images/20250202_000611.jpg',
      },
      {
        title: 'Monarch Frame',
        description: 'Bold presence with exceptional balance.',
        href: '/shop?category=best-sellers',
        image: '/images/20250202_000707.jpg',
      },
      {
        title: 'Noir Profile',
        description: 'Minimal yet unmistakably luxurious.',
        href: '/shop?category=best-sellers',
        image: '/images/20250202_000818.jpg',
      },
    ],
  },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
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

      <header className={`border-b border-foreground/10 py-5 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur' : 'bg-[#FFFFFF]'}`}>
        <div className="container mx-auto grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-12 xl:px-16">
          <div className="flex items-center justify-start">
            <button
              className="z-50 -ml-2 p-2 xl:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>

            <nav className="hidden items-center gap-5 pr-4 xl:flex xl:gap-8">
              {leftLinks.map((link) => {
                const panel = navPanels[link.name];
                const isOpen = activePanel === link.name;

                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setActivePanel(link.name)}
                    onMouseLeave={() => setActivePanel(null)}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setActivePanel(null)}
                      className={`group relative py-2 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors xl:text-xs ${
                        pathname === link.href ? 'text-foreground' : 'text-foreground/80 hover:text-primary'
                      }`}
                    >
                      {link.name}
                      <span className={`absolute bottom-0 left-0 h-[1px] w-full origin-left bg-foreground transition-transform duration-300 ${
                        pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`} />
                    </Link>

                    <AnimatePresence>
                      {panel && isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute left-0 top-full mt-3 w-[430px] rounded-[2px] border border-black/10 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)]"
                        >
                          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">
                            {link.name}
                          </p>
                          <p className="mb-4 text-sm leading-6 text-foreground/70">{panel.intro}</p>
                          <div className="grid gap-3">
                            {panel.items.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="group flex items-center gap-3 rounded-sm border border-black/5 bg-[#FAFAFA] p-3 transition-colors hover:border-[#C5A059]"
                              >
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm">
                                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground group-hover:text-primary">
                                    {item.title}
                                  </p>
                                  <p className="mt-1 text-sm text-foreground/60">{item.description}</p>
                                </div>
                                <ArrowRight className="ml-auto h-4 w-4 text-[#C5A059]" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="z-10 flex justify-center">
            <Link href="/" className="flex items-center transition-opacity duration-300 hover:opacity-80">
              <Image
                src="/logo.png"
                alt="Si Mirage Logo"
                width={160}
                height={50}
                className="h-8 w-auto object-contain xl:h-10"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-5 xl:gap-8">
            <button className="hidden text-foreground transition-transform duration-300 hover:scale-105 hover:text-primary md:block">
              <Search className="h-5 w-5 stroke-[1.5]" />
            </button>
            <Link href="/wishlist" className="hidden text-foreground transition-transform duration-300 hover:scale-105 hover:text-primary md:block">
              <Heart className="h-5 w-5 stroke-[1.5]" />
            </Link>
            <Link href="/account" className="hidden text-foreground transition-transform duration-300 hover:scale-105 hover:text-primary md:block">
              <User className="h-5 w-5 stroke-[1.5]" />
            </Link>
            <Link href="/cart" className="group relative flex items-center gap-2 text-foreground transition-transform duration-300 hover:scale-105 hover:text-primary">
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              <span className="mt-0.5 text-xs font-bold tracking-[0.1em]">(0)</span>
              <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
              animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
              exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 top-[60px] z-40 flex flex-col bg-white/95 pt-10 backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-6 overflow-y-auto px-8 pb-32">
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
                      className="block text-3xl font-light tracking-wide transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                    {navPanels[link.name] && (
                      <p className="mt-2 text-sm leading-6 text-foreground/60">{navPanels[link.name].intro}</p>
                    )}
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="my-4 h-px w-full bg-foreground/10"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-6"
                >
                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-xl font-light tracking-wide transition-colors hover:text-primary">
                    <Heart className="h-6 w-6 stroke-[1.5]" /> Wishlist
                  </Link>
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-xl font-light tracking-wide transition-colors hover:text-primary">
                    <User className="h-6 w-6 stroke-[1.5]" /> Account
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-left text-xl font-light tracking-wide transition-colors hover:text-primary">
                    <Search className="h-6 w-6 stroke-[1.5]" /> Search
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
