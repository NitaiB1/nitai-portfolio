'use client';

import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// This component might be deprecated or removed if ActiveZoneAnimator fully replaces its functionality
// For now, keeping it in case it's used in other places not covered by this request.

interface AnimatedListItemProps {
  children: ReactNode;
  delay: number;
  className?: string;
  duration?: number;
  initialY?: number; // initial Y offset in pixels
  threshold?: number; // IntersectionObserver threshold
}

export function AnimatedListItem({
  children,
  delay,
  className,
  duration = 250, 
  initialY = 80, 
  threshold = 0.01, 
}: AnimatedListItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            setIsVisible(true);
          }, delay);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
          return () => clearTimeout(timer);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={cn('transition-all ease-out', className)}
      style={{
        transitionDuration: `${duration}ms`,
        transform: isVisible ? 'translateY(0px)' : `translateY(${initialY}px)`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
