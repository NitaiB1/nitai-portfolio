'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHeroContentProps {
  children: React.ReactNode;
  delay?: number; // in ms
  className?: string;
  threshold?: number;
}

export function AnimatedHeroContent({ children, delay = 0, className, threshold = 0.01 }: AnimatedHeroContentProps) { 
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-[250ms] ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20", 
        className
      )}
    >
      {children}
    </div>
  );
}
