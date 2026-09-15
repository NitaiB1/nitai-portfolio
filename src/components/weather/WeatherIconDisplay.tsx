
'use client';

import type { LucideIcon } from 'lucide-react';
import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudRain, CloudSnow, Wind, Thermometer, Droplets, CloudLightning, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, type Variants } from 'framer-motion';

export const weatherIconMap: Record<string, LucideIcon> = {
  sun: Sun,
  moon: Moon,
  'cloud-sun': CloudSun,
  'cloud-moon': CloudMoon,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  wind: Wind,
  thermometer: Thermometer,
  droplets: Droplets,
  'cloud-lightning': CloudLightning,
  'help-circle': HelpCircle,
};

const animationVariants: Record<string, Variants> = {
  sun: {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 20,
        ease: 'linear',
      },
    },
  },
  moon: {
     animate: {
      rotate: [0, -10, 10, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 8,
        ease: 'easeInOut',
      },
    },
  },
  cloud: {
    animate: {
      x: [0, 5, -5, 5, 0],
      transition: {
        repeat: Infinity,
        duration: 10,
        ease: 'easeInOut',
      },
    },
  },
  wind: {
    animate: {
      x: [-8, 8, -8],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  },
  lightning: {
    animate: {
      opacity: [1, 0.5, 1, 0.5, 1, 1, 1],
       transition: {
        repeat: Infinity,
        duration: 2.5,
        ease: 'easeInOut',
      },
    },
  },
};

export const WeatherIconDisplay: React.FC<{ iconName?: string; className?: string }> = ({ iconName = 'help-circle', className }) => {
  const lowerCaseIconName = iconName.toLowerCase();
  const IconComponent = weatherIconMap[lowerCaseIconName] || HelpCircle;

  let animationKey: string | null = null;
  if (lowerCaseIconName.includes('sun') && !lowerCaseIconName.includes('cloud')) animationKey = 'sun';
  else if (lowerCaseIconName.includes('moon') && !lowerCaseIconName.includes('cloud')) animationKey = 'moon';
  else if (lowerCaseIconName.includes('cloud')) animationKey = 'cloud';
  else if (lowerCaseIconName === 'wind') animationKey = 'wind';
  else if (lowerCaseIconName === 'cloud-lightning') animationKey = 'lightning';

  const selectedAnimation = animationKey ? animationVariants[animationKey] : {};

  // Applying a glow effect with drop-shadow. The color will adapt to the icon's text color.
  const glowClass = 'drop-shadow-[0_0_4px_currentColor]';

  return (
    <motion.div
      variants={selectedAnimation}
      animate="animate"
      className="inline-block" // To contain the motion transform
    >
      <IconComponent className={cn("h-16 w-16 text-primary", glowClass, className)} />
    </motion.div>
  );
};
