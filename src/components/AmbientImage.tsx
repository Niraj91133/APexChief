'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface AmbientImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
  fit?: 'smart' | 'cover' | 'contain';
  maxZoomRatio?: number;
  children?: React.ReactNode;
}

const DEFAULT_FALLBACK = '/images/apexchief-logo-light.png';

/**
 * AmbientImage displays responsive editorial photos with smart bounded zoom:
 * - Normal / moderately mismatched images fill edge-to-edge cleanly via `object-cover`.
 * - Small low-res uploads or extreme aspect mismatches (e.g. tall 2:3 portraits in 16:9 boxes)
 *   zoom smoothly toward the container edges up to `maxZoomRatio` without excessive cropping or pixelation,
 *   while softly blending any small remaining margin with an ambient backdrop.
 */
export default function AmbientImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px',
  fit = 'smart',
  maxZoomRatio = 1.55,
  children,
}: AmbientImageProps) {
  const safeSrc = src && src.trim() ? src : DEFAULT_FALLBACK;
  const isUnoptimized = safeSrc.startsWith('/api/') || safeSrc.startsWith('data:');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [boxSize, setBoxSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setNaturalSize(null);
  }, [safeSrc]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setBoxSize((prev) =>
          Math.abs(prev.w - rect.width) > 2 || Math.abs(prev.h - rect.height) > 2
            ? { w: rect.width, h: rect.height }
            : prev
        );
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displaySrc = hasError ? DEFAULT_FALLBACK : safeSrc;
  const isPortrait = naturalSize ? naturalSize.h > naturalSize.w : false;
  const hasExplicitPosition = /\bobject-(top|bottom|left|right|center|\[)/.test(className);
  const defaultFocusClass = !hasExplicitPosition && isPortrait ? 'object-[center_18%]' : 'object-center';

  // Compute smart bounded frame dimensions when aspect or pixel resolution differs strongly
  let innerStyle: React.CSSProperties | null = null;
  let useBackdrop = false;

  if (
    fit === 'contain'
  ) {
    useBackdrop = true;
  } else if (
    fit === 'smart' &&
    naturalSize &&
    naturalSize.w > 0 &&
    naturalSize.h > 0 &&
    boxSize.w > 120 &&
    boxSize.h > 80
  ) {
    const bRatio = boxSize.w / boxSize.h;
    const nRatio = naturalSize.w / naturalSize.h;
    const aspectDiff = Math.max(bRatio / nRatio, nRatio / bRatio);

    // Check pixel-level upscaling for genuinely small uploads
    const maxPixelUpscale = 1.65;
    const isTinyWidth = naturalSize.w * maxPixelUpscale < boxSize.w * 0.92;
    const isTinyHeight = naturalSize.h * maxPixelUpscale < boxSize.h * 0.92;

    if (isTinyWidth && isTinyHeight) {
      // Zoom small upload nicely toward empty space, capped so it never turns blurry
      const cappedW = Math.min(boxSize.w, Math.round(naturalSize.w * maxPixelUpscale));
      const cappedH = Math.min(boxSize.h, Math.round(naturalSize.h * maxPixelUpscale));
      innerStyle = {
        width: `${cappedW}px`,
        height: `${cappedH}px`,
        maxWidth: '100%',
        maxHeight: '100%',
      };
      useBackdrop = true;
    } else if (aspectDiff > maxZoomRatio) {
      // Bound zoom factor so portraits in landscape boxes expand meaningfully without chopping faces
      const zoomBoost = Math.min(maxZoomRatio, 1.52);
      if (nRatio < bRatio) {
        const pct = Math.min(100, (nRatio / bRatio) * 100 * zoomBoost);
        if (pct < 94) {
          innerStyle = {
            width: `${pct.toFixed(2)}%`,
            height: '100%',
          };
          useBackdrop = true;
        }
      } else {
        const pct = Math.min(100, (bRatio / nRatio) * 100 * zoomBoost);
        if (pct < 94) {
          innerStyle = {
            width: '100%',
            height: `${pct.toFixed(2)}%`,
          };
          useBackdrop = true;
        }
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#f0efe5] dark:bg-[#1a1a1a] flex items-center justify-center ${containerClassName}`}
    >
      {/* Subtle Ambient Backdrop when frame is bounded */}
      {useBackdrop && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt=""
            aria-hidden="true"
            className="ambient-bg absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-80 dark:opacity-60 saturate-110 pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-black/15 dark:bg-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
        </>
      )}

      {fit === 'contain' ? (
        <div className="relative z-10 w-full h-full">
          <Image
            src={displaySrc}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={isUnoptimized}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
              }
            }}
            onError={() => setHasError(true)}
            className={`object-contain ${defaultFocusClass} drop-shadow-[0_12px_30px_rgba(0,0,0,0.3)] ${className}`}
          />
        </div>
      ) : innerStyle ? (
        <div
          style={innerStyle}
          className="relative z-10 overflow-hidden shadow-sm"
        >
          <Image
            src={displaySrc}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={isUnoptimized}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
              }
            }}
            onError={() => setHasError(true)}
            className={`object-cover ${defaultFocusClass} transition-transform duration-500 ${className}`}
          />
        </div>
      ) : (
        <Image
          src={displaySrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={isUnoptimized}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
            }
          }}
          onError={() => setHasError(true)}
          className={`object-cover ${defaultFocusClass} transition-transform duration-500 ${className}`}
        />
      )}

      {children}
    </div>
  );
}
