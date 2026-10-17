import React from 'react';
import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Editorial Desk | ApexChief',
  description: 'Connect with ApexChief editors, submit executive pitch decks, investigative tips, press releases, or reach our global business newsroom bureaus in New York and London.',
  alternates: {
    canonical: 'https://www.apexchief.com/contact',
  },
  openGraph: {
    title: 'Contact Editorial Desk | ApexChief',
    description: 'Connect with ApexChief editors, submit executive pitch decks, investigative tips, press releases, or reach our global business newsroom bureaus in New York and London.',
    url: 'https://www.apexchief.com/contact',
    siteName: 'ApexChief',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Editorial Desk | ApexChief',
    description: 'Connect with ApexChief editors, submit executive pitch decks, investigative tips, press releases, or reach our global business newsroom bureaus.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://www.apexchief.com/contact#webpage',
      url: 'https://www.apexchief.com/contact',
      name: 'Contact ApexChief Editorial Desk',
      description:
        'Connect with ApexChief editors, submit executive pitch decks, investigative tips, press releases, or reach our global business newsroom bureaus in New York and London.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.apexchief.com/#website',
        name: 'ApexChief',
        url: 'https://www.apexchief.com',
      },
      mainEntity: {
        '@type': 'NewsMediaOrganization',
        '@id': 'https://www.apexchief.com/#organization',
        name: 'ApexChief',
        url: 'https://www.apexchief.com',
        email: 'apexchiefofficial@gmail.com',
        telephone: '+916206539717',
        address: [
          {
            '@type': 'PostalAddress',
            streetAddress: '100 Financial Center Blvd, Suite 4800',
            addressLocality: 'New York',
            addressRegion: 'NY',
            postalCode: '10005',
            addressCountry: 'US',
          },
          {
            '@type': 'PostalAddress',
            streetAddress: '1 Canada Square, Canary Wharf',
            addressLocality: 'London',
            postalCode: 'E14 5AA',
            addressCountry: 'GB',
          },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.apexchief.com/contact#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.apexchief.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact Editorial Desk',
          item: 'https://www.apexchief.com/contact',
        },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
