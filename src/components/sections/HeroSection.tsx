
import Image from 'next/image';
import { personalInfo } from '@/lib/data';
import { StyledHeroButton } from '@/components/StyledHeroButton';
import { ArrowDown, CloudSun, Download, ArrowRight, LayoutTemplate, TrendingUp } from 'lucide-react';
import { AnimatedHeroContent } from '@/components/layout/AnimatedHeroContent';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import Link from 'next/link';


export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <BackgroundBeamsWithCollision className="!min-h-[80vh] !py-12 sm:!py-20 !bg-gradient-to-br !from-background !via-muted !to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedHeroContent delay={0} className="relative z-20">
            <div className="relative mx-auto mb-8 h-40 w-40 sm:h-48 sm:w-48 rounded-full shadow-2xl border-4 border-accent animate-profile-glow">
              <Image
                src={personalInfo.profileImageUrl}
                alt={personalInfo.name}
                fill={true}
                className="object-cover rounded-full"
                data-ai-hint={personalInfo.profileImageHint}
                priority
              />
            </div>
          </AnimatedHeroContent>

          <AnimatedHeroContent delay={200} className="relative z-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold text-primary">
              {personalInfo.name}
            </h1>
          </AnimatedHeroContent>

          <AnimatedHeroContent delay={350} className="relative z-20">
            <p className="mt-3 text-xl sm:text-2xl font-semibold text-foreground/90">
              {personalInfo.title}
            </p>
          </AnimatedHeroContent>

          <AnimatedHeroContent delay={500} className="relative z-20">
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <StyledHeroButton
                id="hero-download-resume-btn"
                href={personalInfo.resumeUrl}
                download="nbaboolal.docx"
                icon={Download}
              >
                Download Resume
              </StyledHeroButton>
              <StyledHeroButton
                id="hero-get-in-touch-btn"
                href="#contact"
                icon={ArrowRight}
              >
                Get In Touch
              </StyledHeroButton>
              <StyledHeroButton
                id="hero-view-weather-btn"
                href="/weather"
                icon={CloudSun}
              >
                View the Weather
              </StyledHeroButton>
              <StyledHeroButton
                id="hero-finbridge-btn"
                href="https://studio--studio-4089791172-3532d.us-central1.hosted.app/"
                icon={TrendingUp}
                target="_blank"
                rel="noopener noreferrer"
              >
                FinBridge
              </StyledHeroButton>
              <StyledHeroButton
                id="hero-site-builder-btn"
                href="https://biolinkify.com"
                icon={LayoutTemplate}
                target="_blank"
                rel="noopener noreferrer"
              >
                Site Builder
              </StyledHeroButton>
            </div>
          </AnimatedHeroContent>
        </div>
      </BackgroundBeamsWithCollision>
      <AnimatedHeroContent delay={650}>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30">
          <Link href="#about" aria-label="Scroll to about section">
            <ArrowDown className="h-8 w-8 text-primary/70 animate-bounce" />
          </Link>
        </div>
      </AnimatedHeroContent>
    </section>
  );
}
