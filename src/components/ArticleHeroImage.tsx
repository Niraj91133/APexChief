'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ArticleHeroImageProps {
  src: string;
  alt: string;
  caption?: string;
}

const DEFAULT_FALLBACK = '/images/apexchief-logo-light.png';

/**
 * ArticleHeroImage dynamically sizes the container aspect ratio to match the uploaded
 * photo's natural dimensions so the entire image renders uncropped with zero empty space.
 * Standard landscape uploads (e.g. 1200x800, 16:9, 4:3) span 100% of the blog column width;
 * tall portraits/squares clamp cleanly to maxHeight 520px while hugging the image tightly.
 */
export default function ArticleHeroImage({
  src,
  alt,
  caption,
}: ArticleHeroImageProps) {
  const safeSrc = src && src.trim() ? src.replace(/&amp;/g, '&') : DEFAULT_FALLBACK;
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    setHasError(false);
    setNaturalSize(null);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }, [safeSrc]);

  const displaySrc = hasError ? DEFAULT_FALLBACK : safeSrc;
  const ratio =
    naturalSize && naturalSize.w > 0 && naturalSize.h > 0
      ? naturalSize.w / naturalSize.h
      : 1.5; // Default 3:2 (matches 1200x800 cleanly before hydration)

  const isPortraitOrSquare = ratio < 1.25;
  const maxHeightPx = 520;

  const boxStyle: React.CSSProperties = isPortraitOrSquare
    ? {
        width: '100%',
        maxWidth: `${Math.round(maxHeightPx * ratio)}px`,
        aspectRatio: `${naturalSize ? `${naturalSize.w} / ${naturalSize.h}` : '1 / 1'}`,
        maxHeight: `${maxHeightPx}px`,
      }
    : {
        width: '100%',
        aspectRatio: `${naturalSize ? `${naturalSize.w} / ${naturalSize.h}` : '3 / 2'}`,
      };

  return (
    <figure className="w-full my-5">
      <div
        style={boxStyle}
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
              setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
            }
          }}
          onError={() => {
            if (!hasError) setHasError(true);
          }}
          className="block w-full h-full object-cover"
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

