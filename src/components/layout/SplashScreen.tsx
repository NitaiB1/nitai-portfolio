
'use client';

import Image from 'next/image';
import { personalInfo } from '@/lib/data';
import { motion } from 'framer-motion';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-background text-primary"
    >
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
        <Image
          src={personalInfo.profileImageUrl}
          alt={`${personalInfo.name} profile picture`}
          fill={true}
          className="object-cover rounded-full border-4 border-transparent"
          data-ai-hint={personalInfo.profileImageHint}
          priority
        />
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow-once">
          <circle
            className="text-transparent"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
            r="45" // radius
            cx="50" // center x
            cy="50" // center y
          />
          <circle
            className="text-accent animate-circular-progress-splash"
            strokeWidth="5"
            strokeDasharray="283" // 2 * PI * 45
            strokeDashoffset="283" // Start with full offset (empty)
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)" // Start from the top
          />
        </svg>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Loading Portfolio...</p>
    </motion.div>
  );
}
