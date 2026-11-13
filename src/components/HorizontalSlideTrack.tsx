'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface HorizontalSlideTrackProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * HorizontalSlideTrack renders cards in a horizontal swipe/drag container
 * with zero visible scrollbars or slider chrome. Users can swipe on touch/trackpad
 * or click-and-drag right-to-left on desktop whenever cards overflow the grid.
 */
export default function HorizontalSlideTrack({
  children,
  className = '',
  ariaLabel,
}: HorizontalSlideTrackProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canSlide, setCanSlide] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);

  const updateCanSlide = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanSlide(el.scrollWidth > el.clientWidth + 4);
  }, []);

  useEffect(() => {
    updateCanSlide();
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateCanSlide);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateCanSlide, children]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const st = dragStateRef.current;
      const el = trackRef.current;
      if (!st.active || !el) return;

      const dx = e.clientX - st.startX;
      const dy = e.clientY - st.startY;

      if (!st.moved) {
        if (Math.abs(dx) < 6) return;
        // Abort horizontal drag intent when the pointer is clearly moving vertically
        if (Math.abs(dy) > Math.abs(dx) * 1.3) {
          st.active = false;
          setIsDragging(false);
          return;
        }
        st.moved = true;
        suppressClickRef.current = true;
        setIsDragging(true);
      }

      el.scrollLeft = st.startScrollLeft - dx;
    };

    const handleMouseUp = () => {
      const st = dragStateRef.current;
      if (!st.active) return;
      const didMove = st.moved;
      st.active = false;
      st.moved = false;
      setIsDragging(false);

      if (didMove) {
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 120);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !canSlide) return;
    const el = trackRef.current;
    if (!el) return;

    suppressClickRef.current = false;
    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  return (
    <div
      ref={trackRef}
      role={ariaLabel ? 'region' : undefined}
      aria-label={ariaLabel}
      onMouseDown={handleMouseDown}
      onDragStart={(e) => {
        if (canSlide) e.preventDefault();
      }}
      onClickCapture={(e) => {
        if (suppressClickRef.current) {
          e.preventDefault();
          e.stopPropagation();
          suppressClickRef.current = false;
        }
      }}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        scrollBehavior: isDragging ? 'auto' : 'smooth',
      }}
      className={`overflow-x-auto no-scrollbar ${
        isDragging
          ? 'snap-none select-none cursor-grabbing'
          : `snap-x snap-mandatory ${canSlide ? 'cursor-grab' : ''}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

