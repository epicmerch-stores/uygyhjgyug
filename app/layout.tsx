import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'MERCH DROP — Premium merch for those who stand out',
  description: 'Limited edition pieces crafted for the bold.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* EpicMerch SDK via CDN — do NOT npm import (webpack cannot parse import.meta.env) */}
        <Script src="https://unpkg.com/epicmerch/dist/epicmerch.min.js" strategy="beforeInteractive" />
        <StoreProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
