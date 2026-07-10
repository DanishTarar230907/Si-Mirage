import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Playfair_Display, Inter } from 'next/font/google';

import SmoothScroll from '@/components/animations/SmoothScroll';
import CustomerAuthProvider from '@/components/auth/CustomerAuthProvider';
import NavigationControls from '@/components/layout/NavigationControls';
import CustomCursor from '@/components/animations/CustomCursor';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerAuthProvider>
      <div className={`${playfair.variable} ${inter.variable} flex flex-col min-h-screen`}>
        <CustomCursor />
        <SmoothScroll />
        <NavigationControls />
        <Navbar />
        <main className="flex-grow relative z-10">
          {children}
        </main>
        <Footer />
      </div>
    </CustomerAuthProvider>
  );
}
