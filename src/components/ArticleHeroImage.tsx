'use client';

import { useEffect, useRef, useState } from 'react';

interface ArticleHeroImageProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;
}

const DEFAULT_FALLBACK = '/images/apexchief-logo-light.png';

/**
 * ArticleHeroImage renders every blog cover photo in a uniform 3:2 full-width frame
 * matching the standard 1200x800 editorial hero size across all blog posts.
 */
export default function ArticleHeroImage({
  src,
  alt,
  caption,
  aspectRatio = '3 / 2',
}: ArticleHeroImageProps) {
  const safeSrc = src && src.trim() ? src.replace(/&amp;/g, '&') : DEFAULT_FALLBACK;
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsPortrait(false);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > img.naturalWidth) {
      setIsPortrait(true);
    }
  }, [safeSrc]);

  const displaySrc = hasError ? DEFAULT_FALLBACK : safeSrc;
  const focusClass = isPortrait ? 'object-[center_20%]' : 'object-center';

  return (
    <figure className="w-full my-5">
      <div
        style={{ width: '100%', aspectRatio }}
        className="relative overflow-hidden rounded-lg border border-[#211d1d]/15 dark:border-white/15 shadow-sm"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={displaySrc}
          alt={alt}
          decoding="async"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setIsPortrait(img.naturalHeight > img.naturalWidth);
            }
          }}
          onError={() => {
            if (!hasError) setHasError(true);
          }}
          className={`block w-full h-full object-cover ${focusClass}`}
        />
      </div>
      {caption && (
        <figcaption className="text-left text-[11px] font-mono text-[#575757] dark:text-[#a3a3a3] mt-1.5 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

