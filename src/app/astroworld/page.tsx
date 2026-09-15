
import type { Metadata } from 'next';
import AstroWorldPageClient from './client';

export const metadata: Metadata = {
  title: 'Astro World Game',
  description: 'Dodge the asteroids and travel as far as you can in this retro space shooter game!',
  alternates: {
    canonical: '/astroworld',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Astro World Game",
    description: "Dodge the asteroids and travel as far as you can in this retro space shooter game!",
    url: '/astroworld',
    siteName: "Nitai Baboolal's Portfolio",
    images: [
      {
        url: '/astroworld.png',
        width: 1200,
        height: 630,
        alt: 'Astro World game screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astro World Game',
    description: 'Dodge the asteroids and travel as far as you can in this retro space shooter game!',
    images: ['/astroworld.png'],
  },
};

export default function AstroWorldPage() {
  return <AstroWorldPageClient />;
}
