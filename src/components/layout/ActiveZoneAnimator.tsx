'use client';

import type { ElementType, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// This component might be deprecated or removed if Framer Motion fully replaces its functionality.
// For now, keeping it in case it's used in other places not covered by this request.
// If it's confirmed as unused after Framer Motion integration, it can be deleted.

interface ActiveZoneAnimatorProps<T extends ElementType = 'div'> {
  as?: T;
  children: ReactNode;
  className?: string; // Base styles AND conditional active/hover styles via data-attributes
  entryAnimationType?: 'fade-in' | 'fade-in-up' | 'none';
  entryDelay?: number; // ms
  entryDuration?: number; // ms for initial entry animation
  threshold?: number; // IntersectionObserver threshold for initial entry
}

export function ActiveZoneAnimator<T extends ElementType = 'div'>({
  as: Component = 'div' as T,
  children,
  className,
  entryAnimationType = 'fade-in-up',
  entryDelay = 0,
  entryDuration = 250, 
  threshold = 0.01, 
  ...props
}: ActiveZoneAnimatorProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ActiveZoneAnimatorProps<T>>) {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isInActiveZone, setIsInActiveZone] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Initial entry animation via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered) {
          const timer = setTimeout(() => {
            setIsIntersecting(true);
            setHasEntered(true); // Only trigger initial entry once
          }, entryDelay);
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
  }, [hasEntered, entryDelay, threshold]);

  // Active zone detection via scroll event
  const handleScroll = useCallback(() => {
    if (!ref.current) return;

    requestAnimationFrame(() => {
      if (!ref.current) return; // Check ref again inside rAF
      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportMiddle = viewportHeight / 2;

      const isActive = rect.top < viewportMiddle && rect.bottom > viewportMiddle;
      
      if (isActive !== isInActiveZoneRef.current) {
        setIsInActiveZone(isActive);
        isInActiveZoneRef.current = isActive;
      }
    });
  }, []); 
  
  const isInActiveZoneRef = useRef(isInActiveZone);
  useEffect(() => {
    isInActiveZoneRef.current = isInActiveZone;
  }, [isInActiveZone]);


  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const entryAnimationClasses: Record<string, string> = {
    'fade-in': `opacity-0 transition-opacity ease-out`,
    'fade-in-up': `opacity-0 translate-y-20 transition-all ease-out`, 
    'none': '',
  };

  const activeEntryClasses: Record<string, string> = {
    'fade-in': `opacity-100`,
    'fade-in-up': `opacity-100 translate-y-0`,
    'none': '',
  };
  
  const currentEntryAnimationClass = entryAnimationType !== 'none' && !isIntersecting 
    ? entryAnimationClasses[entryAnimationType] 
    : '';
  const currentActiveEntryClass = entryAnimationType !== 'none' && isIntersecting 
    ? activeEntryClasses[entryAnimationType] 
    : '';


  return (
    <Component
      ref={ref as any}
      className={cn(
        currentEntryAnimationClass,
        currentActiveEntryClass,
        className 
      )}
      style={{
        transitionDuration: entryAnimationType !== 'none' && !isIntersecting ? `${entryDuration}ms` : undefined,
        ...(entryAnimationType !== 'none' && isIntersecting && { transitionDuration: `${entryDuration}ms` }),
        ...(props.style as any)
      }}
      data-in-active-zone={isInActiveZone}
      {...props}
    >
      {children}
    </Component>
  );
}
