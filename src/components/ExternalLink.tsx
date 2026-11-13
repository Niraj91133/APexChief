'use client';

import React from 'react';

interface ExternalLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function ExternalLink({ href, className, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}

