
'use client';

import { Section } from '@/components/layout/Section';
import { projects, sectionIcons } from '@/lib/data';
import { CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Card components might not be directly used if EvervaultCard handles all
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { EvervaultCard, Icon as EvervaultCornerIcon } from '@/components/ui/evervault-card';
import { ActiveZoneAnimator } from '@/components/layout/ActiveZoneAnimator';
import { cn } from '@/lib/utils';

export function ProjectsSection() {
  const baseDelay = 0;
  const staggerIncrement = 0;

  return (
    <Section id="projects" title="Featured Projects" icon={sectionIcons.projects} subtitle="A selection of projects that demonstrate my skills and experience.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => {
          const handleCardClick = (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest('a, button')) {
              return;
            }
            if (project.liveLink) {
              window.open(project.liveLink, '_blank', 'noopener,noreferrer');
            }
          };

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (project.liveLink && (e.key === 'Enter' || e.key === ' ')) {
              if ((e.target as HTMLElement).closest('a, button')) {
                return;
              }
              e.preventDefault();
              window.open(project.liveLink, '_blank', 'noopener,noreferrer');
            }
          };

          return (
            <ActiveZoneAnimator
              key={index}
              entryDelay={baseDelay + index * staggerIncrement}
              onClick={project.liveLink ? handleCardClick : undefined}
              onKeyDown={project.liveLink ? handleKeyDown : undefined}
              tabIndex={project.liveLink ? 0 : undefined}
              role={project.liveLink ? "link" : undefined}
              aria-label={project.liveLink ? `Open ${project.title}` : undefined}
              className={cn(
                "flex flex-col h-full transition-all duration-300 ease-in-out rounded-3xl", // Base transition & rounding for border
                // EvervaultCard has its own hover. Active zone adds border, shadow, lift.
                "hover:shadow-2xl hover:-translate-y-1", 
                "data-[in-active-zone=true]:shadow-2xl data-[in-active-zone=true]:border data-[in-active-zone=true]:border-accent data-[in-active-zone=true]:-translate-y-1",
                project.liveLink && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              entryAnimationType="fade-in-up"
              threshold={0.01}
            >
              <div className="border border-border/30 dark:border-border/30 flex flex-col items-start w-full mx-auto p-0.5 relative rounded-3xl shadow-lg bg-card/5 flex-grow">
                <EvervaultCornerIcon className="absolute h-6 w-6 -top-3 -left-3 text-primary dark:text-accent" />
                <EvervaultCornerIcon className="absolute h-6 w-6 -bottom-3 -left-3 text-primary dark:text-accent" />
                <EvervaultCornerIcon className="absolute h-6 w-6 -top-3 -right-3 text-primary dark:text-accent" />
                <EvervaultCornerIcon className="absolute h-6 w-6 -bottom-3 -right-3 text-primary dark:text-accent" />

                <EvervaultCard className="w-full flex-grow rounded-[calc(1.5rem-2px)]">
                  <div className="relative z-20 flex flex-col justify-between h-full bg-card/80 dark:bg-card/70 backdrop-blur-sm p-4 rounded-2xl">
                    <div>
                      <CardTitle className="text-xl font-headline text-primary mb-2 flex items-center justify-between gap-2">
                        <span>{project.title}</span>
                        {project.liveLink && (
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover/card:text-primary" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-foreground/90 text-sm line-clamp-5 mb-3">{project.description}</CardDescription>
                      {project.tags && project.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {project.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 text-xs bg-accent/20 text-accent-foreground rounded-full font-medium">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <CardFooter className="flex gap-2 p-0 mt-auto">
                      {project.liveLink && (
                        <Button variant="outline" size="sm" asChild className="text-xs">
                          <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Visit Site
                          </Link>
                        </Button>
                      )}
                      {project.repoLink && (
                         <Button variant="ghost" size="sm" asChild className="text-xs">
                          <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-1.5 h-3.5 w-3.5" /> View Code
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                </EvervaultCard>
              </div>
            </ActiveZoneAnimator>
          );
        })}
      </div>
      {projects.length === 0 && (
         <p className="text-center text-muted-foreground mt-10">More projects coming soon. Stay tuned!</p>
      )}
    </Section>
  );
}
