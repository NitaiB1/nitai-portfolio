
import type { Metadata } from 'next';
import WeatherPageClient from './client';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Get real-time weather forecasts for any city in the world, with a dynamic background that changes with the weather.',
  alternates: {
    canonical: '/weather',
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
    title: "Weather App",
    description: "Get real-time weather forecasts for any city in the world, with a dynamic background that changes with the weather.",
    url: '/weather',
    siteName: "Nitai Baboolal's Portfolio",
    images: [
      {
        url: '/weather.png',
        width: 1200,
        height: 630,
        alt: 'Screenshot of the weather application',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weather App',
    description: 'Get real-time weather forecasts for any city in the world, with a dynamic background that changes with the weather.',
    images: ['/weather.png'],
  },
};

export default function WeatherPage() {
  return <WeatherPageClient />;
}
