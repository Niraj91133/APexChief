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

export default function ContactPage() {
  return <ContactClient />;
}
