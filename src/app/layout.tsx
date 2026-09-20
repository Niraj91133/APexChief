import type { Metadata } from 'next';
import { Playfair_Display, Libre_Baskerville, Inter, Oswald, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import Analytics from '@/components/Analytics';
import MainWrapper from '@/components/MainWrapper';
import WhatsAppFloatingWidget from '@/components/WhatsAppFloatingWidget';
import FaviconManager from '@/components/FaviconManager';
import { siteConfig } from '@/data/siteConfig';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexchief.com'),
  title: {
    default: 'ApexChief – Business, Leadership, Technology & interview',
    template: '%s — ApexChief',
  },
  description:
    'ApexChief is a digital media platform covering business, leadership, technology, startups, innovation, and emerging industry trends. We share insightful stories, expert perspectives, executive interviews, and inspiring success stories from leaders and entrepreneurs shaping the future.',
  keywords: [
    'ApexChief',
    'Apex Chief',
    'Business',
    'Leadership',
    'Technology',
    'Interview',
    'Executive Interviews',
    'Startups',
    'Innovation',
    'Emerging Industry Trends',
    'Founder Stories',
    'CEOs',
    'Digital Media',
  ],
  authors: [{ name: 'ApexChief Editorial Team', url: 'https://www.apexchief.com' }],
  creator: 'ApexChief',
  publisher: 'ApexChief',
  applicationName: 'ApexChief',
  alternates: {
    canonical: 'https://www.apexchief.com',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'ApexChief – Business, Leadership, Technology & interview',
    description:
      'ApexChief is a digital media platform covering business, leadership, technology, startups, innovation, and emerging industry trends. We share insightful stories, expert perspectives, executive interviews, and inspiring success stories from leaders and entrepreneurs shaping the future.',
    url: 'https://www.apexchief.com',
    siteName: 'ApexChief',
    images: [
      {
        url: 'https://framerusercontent.com/images/wTPVxDx1qGqgRyxQ2Ro8amC7p4.png',
        width: 1200,
        height: 630,
        alt: 'ApexChief – Business, Leadership, Technology & interview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexChief – Business, Leadership, Technology & interview',
    description:
      'ApexChief is a digital media platform covering business, leadership, technology, startups, innovation, and emerging industry trends. We share insightful stories, expert perspectives, executive interviews, and inspiring success stories from leaders and entrepreneurs shaping the future.',
    site: '@ApexChief',
    creator: '@ApexChief',
    images: ['https://framerusercontent.com/images/wTPVxDx1qGqgRyxQ2Ro8amC7p4.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.apexchief.com/#website',
      url: 'https://www.apexchief.com',
      name: 'ApexChief',
      headline: 'ApexChief – Business, Leadership, Technology & interview',
      description:
        'ApexChief is a digital media platform covering business, leadership, technology, startups, innovation, and emerging industry trends. We share insightful stories, expert perspectives, executive interviews, and inspiring success stories from leaders and entrepreneurs shaping the future.',
      publisher: {
        '@id': 'https://www.apexchief.com/#organization',
      },
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.apexchief.com/news?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      ],
    },
    {
      '@type': 'NewsMediaOrganization',
      '@id': 'https://www.apexchief.com/#organization',
      name: 'ApexChief',
      url: 'https://www.apexchief.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://framerusercontent.com/images/zYn8Xte3IxdFPFqfnQCRr2eGyHY.svg',
      },
      description:
        'ApexChief is a digital media platform covering business, leadership, technology, startups, innovation, and emerging industry trends. We share insightful stories, expert perspectives, executive interviews, and inspiring success stories from leaders and entrepreneurs shaping the future.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${baskerville.variable} ${inter.variable} ${oswald.variable} ${bebas.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-[#121212] text-black dark:text-[#f8fafc] flex flex-col font-sans selection:bg-[#f7413e] selection:text-white transition-colors duration-200"
      >
        <Header initialConfig={siteConfig} />
        <MainWrapper>
          {children}
        </MainWrapper>
        <Footer initialConfig={siteConfig} />
        <SearchModal />
        <Analytics />
        <WhatsAppFloatingWidget />
        <FaviconManager />
      </body>
    </html>
  );
}
