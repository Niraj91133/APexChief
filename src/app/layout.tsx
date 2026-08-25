import type { Metadata } from 'next';
import { Playfair_Display, Libre_Baskerville, Inter, Oswald, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-baskerville',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const bebas = Bebas_Neue({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ApexChief — Newsio Editorial Journal',
  description: 'Modern media stories & weekly editorial features — EST. 2023. Curated journalism, deep-dive culture features, technology innovations, global affairs, and lifestyle analysis.',
  keywords: 'news, editorial, modern times, journalism, culture, business, technology, lifestyle, travel, health, ai news',
  icons: {
    icon: 'https://framerusercontent.com/images/zYn8Xte3IxdFPFqfnQCRr2eGyHY.svg',
    apple: 'https://framerusercontent.com/images/edl63QIn2mk7QrakefiptPwcgZo.png',
  },
  openGraph: {
    title: 'ApexChief — Newsio Editorial Journal',
    description: 'Modern media stories & weekly editorial features — EST. 2023',
    images: ['https://framerusercontent.com/images/wTPVxDx1qGqgRyxQ2Ro8amC7p4.png'],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${baskerville.variable} ${inter.variable} ${oswald.variable} ${bebas.variable}`}>
      <body className="min-h-screen bg-[#faf8f2] text-[#211d1d] flex flex-col font-sans selection:bg-[#f7413e] selection:text-[#faf8f2]">
        <Header />
        <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
        <SearchModal />
      </body>
    </html>
  );
}
