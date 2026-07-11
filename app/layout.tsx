import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/components/admin/AdminContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Si Mirage - Premium Eyewear",
  description: "Cinematic sunglasses crafted with precision and style.",
};

import { fetchCmsData } from '@/lib/cms';
import { initialCmsData } from '@/lib/initialCmsData';

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverData = await fetchCmsData(initialCmsData);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdminProvider initialData={serverData}>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}

