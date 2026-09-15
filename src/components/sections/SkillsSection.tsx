
'use client';

import { Section } from '@/components/layout/Section';
import { skills, sectionIcons } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { ActiveZoneAnimator } from '@/components/layout/ActiveZoneAnimator';
import { cn } from '@/lib/utils';

export function SkillsSection() {
  const baseDelay = 0;
  const staggerIncrement = 0;

  return (
    <Section id="skills" title="Skills & Abilities" icon={sectionIcons.skills} subtitle="A showcase of my technical and professional capabilities.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {skills.map((skill, index) => (
          <ActiveZoneAnimator
            key={skill.name}
            entryDelay={baseDelay + index * staggerIncrement}
            className={cn(
              "h-full transition-all duration-300 ease-in-out rounded-[22px]",
              "hover:shadow-2xl hover:-translate-y-1", 
              "data-[in-active-zone=true]:shadow-2xl data-[in-active-zone=true]:-translate-y-1"
            )}
            entryAnimationType="fade-in-up"
            threshold={0.01}
          >
            <BackgroundGradient
              className="rounded-[22px] bg-card dark:bg-card h-full"
              containerClassName="h-full"
              animate
            >
              <Card className="flex flex-col items-center text-center p-6 shadow-none border-none bg-transparent h-full relative z-10 transform-gpu">
                <CardHeader className="p-0 mb-4">
                  <skill.icon className="h-12 w-12 text-accent mx-auto" />
                </CardHeader>
                <CardContent className="p-0 flex-grow flex flex-col justify-center">
                  <CardTitle className="text-xl font-headline mb-2 text-primary">{skill.name}</CardTitle>
                  {skill.description && (
                    <CardDescription className="text-sm text-muted-foreground">{skill.description}</CardDescription>
                  )}
                </CardContent>
              </Card>
            </BackgroundGradient>
          </ActiveZoneAnimator>
        ))}
      </div>
    </Section>
  );
}
