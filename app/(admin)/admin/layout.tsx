import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Playfair_Display, Inter } from 'next/font/google';

import SmoothScroll from '@/components/animations/SmoothScroll';
import { AdminProvider } from '@/components/admin/AdminContext';
import AdminWorkspaceBar from '@/components/admin/AdminWorkspaceBar';
import AdminSectionDrawer from '@/components/admin/AdminSectionDrawer';
import NavigationControls from '@/components/layout/NavigationControls';

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

export const metadata = {
  title: 'Si Mirage Workspace',
  description: 'Premium Storefront visual editing workspace',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${playfair.variable} ${inter.variable} flex flex-col min-h-screen bg-background`}>

      <SmoothScroll />
      <NavigationControls />
      <AdminWorkspaceBar />
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <AdminSectionDrawer />
      <Footer />
    </div>
  );
}

