'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/siteConfig';

export default function Footer() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#000000] text-[#eff0e0] mt-8 sm:mt-12 border-t border-[#222222]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#fefdf3] uppercase group-hover:text-[#f7413e] transition-colors">
                {siteConfig.name}
              </span>
            </Link>
            <span className="hidden sm:inline-block text-[#eff0e0]/20">|</span>
            <p className="text-xs text-[#eff0e0]/60 font-sans tracking-wide">
              ©{' '}
              <Link
                href="/admin"
                className="text-inherit hover:text-inherit no-underline cursor-default focus:outline-none"
              >
                {currentYear}
              </Link>{' '}
              {siteConfig.name}. All Rights Reserved.
            </p>
          </div>

          {/* Quick Essential Links */}
          <nav className="flex items-center flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-[#eff0e0]/75">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex items-center space-x-2 text-[#fefdf3]">
            {/* X / Twitter */}
            <a
              href={siteConfig.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-md bg-[#161616] hover:bg-[#f7413e] flex items-center justify-center transition-all duration-200 text-[#eff0e0] hover:text-white"
              aria-label="Twitter / X"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-md bg-[#161616] hover:bg-[#f7413e] flex items-center justify-center transition-all duration-200 text-[#eff0e0] hover:text-white"
              aria-label="Instagram"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={siteConfig.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-md bg-[#161616] hover:bg-[#f7413e] flex items-center justify-center transition-all duration-200 text-[#eff0e0] hover:text-white"
              aria-label="LinkedIn"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={siteConfig.socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-md bg-[#161616] hover:bg-[#f7413e] flex items-center justify-center transition-all duration-200 text-[#eff0e0] hover:text-white"
              aria-label="Facebook"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.667.125-2.023.518-.577.636-.513 1.543-.513 2.529v1.01h4.08l-.545 3.667h-3.535v7.98c7.172-.89 12.686-7.009 12.686-14.417C24 4.298 18.627-1.074 12-1.074S0 4.298 0 10.922c0 7.408 5.514 13.527 12.686 14.417z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

