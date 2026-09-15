
'use client';

import { Section } from '@/components/layout/Section';
import { sectionIcons } from '@/lib/data';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const apps = [
  {
    title: "NRECON 🛰️",
    description: "Cyber reconnaissance & global intelligence platform with real-time 3D tracking of aircraft, satellites, worldwide CCTV, and threat telemetry.",
    href: "https://nrecon-220354660616.us-central1.run.app/",
    imgSrc: "/nrecon.png",
    imgHint: "cyber reconnaissance intelligence globe",
    className: "md:col-span-1",
  },
  {
    title: "FinBridge",
    description: "A stock analysis tool that provides real time analytics.",
    href: "https://studio--studio-4089791172-3532d.us-central1.hosted.app/",
    imgSrc: "/finbridge.png",
    imgHint: "stock analysis",
    className: "md:col-span-1",
  },
  {
    title: "BioLinkify",
    description: "A one-stop solution for all your links. Create a personalized page to house all the important links you want to share.",
    href: "https://biolinkify.com",
    imgSrc: "/biolinkify.jpg",
    imgHint: "link bio social media",
    className: "md:col-span-1",
  },
  {
    title: "Astro World 🚀",
    description: "Dodge the asteroids and travel as far as you can in this retro space shooter game!",
    href: "/astroworld",
    imgSrc: "/astroworld.png",
    imgHint: "space rocket game",
    className: "md:col-span-1",
  },
  {
    title: "Weather App",
    description: "Get real-time weather forecasts for any city in the world, with a dynamic, changing background.",
    href: "/weather",
    imgSrc: "/weather.png",
    imgHint: "weather application",
    className: "md:col-span-1",
  },
  {
    title: "Hare Krishna Richards Bay",
    description: "A community website for the ISKCON centre in Richards Bay, South Africa.",
    href: "https://krsnarbay.co.za/",
    imgSrc: "/krishnarbay.png",
    imgHint: "community website",
    className: "md:col-span-1",
  },
];

export function AppsSection() {
  return (
    <Section
      id="apps"
      title="Apps"
      icon={sectionIcons.apps}
      className="bg-background"
      subtitle="A collection of interactive applications I've built."
    >
      <BentoGrid className="max-w-4xl mx-auto auto-rows-[26rem] md:auto-rows-[30rem] md:grid-cols-2">
        {apps.map((app) => (
          <BentoGridItem
            key={app.title}
            className={cn(app.className, "p-0")}
          >
            <Link
              href={app.href}
              target={app.href.startsWith('http') ? '_blank' : undefined}
              rel={app.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex flex-col h-full w-full group"
            >
              {/* Image Area: 3/4 of the height */}
              <div className="relative h-3/4 w-full">
                <Image
                  src={app.imgSrc}
                  alt={app.title}
                  fill
                  className="object-cover h-full w-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                  data-ai-hint={app.imgHint}
                />
              </div>

              {/* Text Area: 1/4 of the height, centers content */}
              <div className="h-1/4 w-full flex flex-col justify-center items-center text-center p-4">
                <h3 className="text-lg font-bold text-primary">{app.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{app.description}</p>
              </div>
            </Link>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </Section>
  );
}
