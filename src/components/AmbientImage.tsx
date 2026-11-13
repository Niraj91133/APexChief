'use client';

import React from 'react';
import Image from 'next/image';

interface AmbientImageProps {
  src: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}

/**
 * AmbientImage: Displays 100% of the uploaded image without ANY cropping,
 * while eliminating ugly empty/white space using an ambient blurred backdrop
 * matched to the image's own colors and atmosphere.
 */
export default function AmbientImage({
  src,
  alt = '',
  priority = false,
  sizes = '(max-width: 1200px) 100vw, 800px',
  className = '',
  containerClassName = '',
  children,
}: AmbientImageProps) {
  if (!src) return null;

  return (
    <div
      className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-gray-900/10 dark:bg-black/30 ${containerClassName}`}
    >
      {/* Background Layer: Ambient Blurred Glow (Fills every corner so NO white/empty space is visible) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <Image
          src={src}
          alt=""
          fill
          aria-hidden="true"
          sizes="100px"
          className="object-cover scale-125 blur-2xl opacity-50 dark:opacity-40 brightness-95 filter"
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
      </div>

      {/* Foreground Layer: Sharp, 100% Uncropped Image */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`relative z-10 object-contain drop-shadow-sm transition-opacity duration-300 ${className}`}
      />

      {/* Optional Overlay Badges / Content (e.g. Category tag) */}
      {children && <div className="relative z-20 w-full h-full pointer-events-none">{children}</div>}
    </div>
  );
}

