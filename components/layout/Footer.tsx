'use client';

import Link from 'next/link';
import Image from 'next/image';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-foreground/10 text-foreground">
      <div className="container mx-auto px-6 md:px-12 xl:px-16">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-32 mb-24 items-start">
          
          {/* Column 1: Explore */}
          <nav className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-foreground">Explore</h4>
            <Link href="/shop" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">All Collections</Link>
            <Link href="/shop?category=luxury" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">The Luxury Edit</Link>
            <Link href="/shop?category=new-arrivals" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">New Arrivals</Link>
            <Link href="/about" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">Our Story</Link>
          </nav>

          {/* Column 2: Insider */}
          <nav className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-foreground">Insider</h4>
            <Link href="/creators" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">Creator Program</Link>
            <Link href="/careers" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">Careers</Link>
            <Link href="/press" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">Press</Link>
          </nav>

          {/* Column 3: Support */}
          <nav className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-foreground">Support</h4>
            <Link href="/contact" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">Contact Us</Link>
            <Link href="/faq" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">FAQ</Link>
            <Link href="/shipping" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">Shipping & Returns</Link>
            <Link href="/warranty" className="text-sm font-light text-foreground/70 hover:text-primary transition-colors inline-block w-fit">Warranty</Link>
          </nav>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-foreground">Newsletter</h4>
            <p className="text-sm font-light text-foreground/70 leading-relaxed mb-2">Join our mailing list for early access to new releases.</p>
            
            <form className="flex w-full group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-transparent border-b border-foreground/20 py-3 text-sm font-light placeholder:text-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                required
              />
              <button 
                type="submit"
                className="border-b border-foreground/20 py-3 text-foreground/50 group-hover:text-foreground hover:text-primary transition-colors"
              >
                <ArrowRightIcon />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-center border-t border-foreground/10 pt-12 pb-6 gap-8">
          
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="Si Mirage" width={120} height={35} className="object-contain" />
          </Link>

          {/* Horizontally Centered SVG Social Icons */}
          <div className="flex items-center justify-center gap-8">
            <a href="#" className="text-foreground/50 hover:text-foreground transition-colors duration-300" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="text-foreground/50 hover:text-foreground transition-colors duration-300" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a href="#" className="text-foreground/50 hover:text-foreground transition-colors duration-300" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </div>
          
          <div className="flex items-center gap-6 mt-4">
            <Link href="/privacy" className="text-[10px] uppercase tracking-[0.1em] font-medium text-foreground/50 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] uppercase tracking-[0.1em] font-medium text-foreground/50 hover:text-primary transition-colors">Terms of Service</Link>
          </div>

          <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-foreground/40 mt-2">
            &copy; {new Date().getFullYear()} Si Mirage. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
