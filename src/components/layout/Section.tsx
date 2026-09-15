'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

interface SectionProps {
  id: string;
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitle?: string;
  threshold?: number;
}

export function Section({
  id,
  title,
  icon: Icon,
  children,
  className,
  titleClassName,
  subtitle,
  threshold = 0.01 
}: SectionProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTitleVisible(true);
          if (titleRef.current) {
            titleObserver.unobserve(titleRef.current);
          }
        }
      },
      { threshold }
    );

    if (titleRef.current) {
      titleObserver.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        titleObserver.unobserve(titleRef.current);
      }
    };
  }, [threshold]);

  useEffect(() => {
    const contentObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay to ensure title animation starts first or simultaneously
          const timer = setTimeout(() => {
            setIsContentVisible(true);
          }, 50); // Adjust delay as needed, can be 0 if preferred

          if (contentRef.current) {
            contentObserver.unobserve(contentRef.current);
          }
          return () => clearTimeout(timer);
        }
      },
      { threshold }
    );

    if (contentRef.current) {
      contentObserver.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        contentObserver.unobserve(contentRef.current);
      }
    };
  }, [threshold]);


  return (
    <section id={id} className={cn('py-16 sm:py-20 md:py-24 overflow-hidden', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={titleRef}
          className={cn(
            "text-center mb-12 sm:mb-16 transition-all duration-[250ms] ease-out",
            isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20" 
          )}
        >
          <h2 className={cn(
            'text-3xl sm:text-4xl font-headline font-bold text-primary flex items-center justify-center gap-3',
            titleClassName
          )}>
            {Icon && <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-accent" />}
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div
          ref={contentRef}
          className={cn(
            "transition-all duration-[250ms] ease-out",
            isContentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20" 
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
