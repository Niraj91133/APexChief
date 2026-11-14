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
 * ArticleHeroImage renders blog cover photos in a default 3:2 (1200x800) frame
 * and automatically adapts container aspect ratio or uses full-frame contain+backdrop
 * for non-3:2 images (e.g. 1200x675 16:9 banners or portraits) so nothing gets cropped.
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
  const [naturalDims, setNaturalDims] = useState<{ w: number; h: number } | null>(null);

  const syncNaturalDims = (img: HTMLImageElement | null) => {
    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
      setNaturalDims((prev) =>
        prev && prev.w === img.naturalWidth && prev.h === img.naturalHeight
          ? prev
          : { w: img.naturalWidth, h: img.naturalHeight }
      );
    }
  };

  useEffect(() => {
    setHasError(false);
    setNaturalDims(null);
    const img = imgRef.current;
    if (img && img.complete) {
      syncNaturalDims(img);
    }
  }, [safeSrc]);

  const displaySrc = hasError ? DEFAULT_FALLBACK : safeSrc;
  const nRatio = naturalDims ? naturalDims.w / naturalDims.h : null;
  // Standard 3:2 (and close ~1.42..1.58 photos) stay 3:2 edge-to-edge; wider 16:9 banners adapt box height cleanly;
  // square/portrait uploads keep a 3:2 frame with full-uncut contain + ambient backdrop so hero stays above the fold.
  const useAdaptiveBoxRatio = nRatio !== null && nRatio >= 1.25 && Math.abs(nRatio - 1.5) > 0.06;
  const useContainBackdrop = nRatio !== null && nRatio < 1.25;
  const effectiveAspectRatio = useAdaptiveBoxRatio && naturalDims
    ? `${naturalDims.w} / ${naturalDims.h}`
    : aspectRatio;

  return (
    <figure className="w-full my-5">
      <div
        style={{ width: '100%', aspectRatio: effectiveAspectRatio }}
        className="relative overflow-hidden rounded-lg border border-[#211d1d]/15 dark:border-white/15 bg-[#f0efe5] dark:bg-[#1a1a1a] shadow-sm flex items-center justify-center"
      >
        {useContainBackdrop && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displaySrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-75 dark:opacity-55 saturate-110 pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-black/15 dark:bg-black/35 pointer-events-none" />
          </>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={displaySrc}
          alt={alt}
          decoding="async"
          onLoad={(e) => syncNaturalDims(e.currentTarget)}
          onError={() => {
            if (!hasError) setHasError(true);
          }}
          className={
            useContainBackdrop
              ? 'relative z-10 block w-full h-full object-contain object-center'
              : 'block w-full h-full object-cover object-center'
          }
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

