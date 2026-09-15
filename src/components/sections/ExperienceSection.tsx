
'use client';

import { Section } from '@/components/layout/Section';
import { experiences, sectionIcons } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ActiveZoneAnimator } from '@/components/layout/ActiveZoneAnimator';
import { cn } from '@/lib/utils';

export function ExperienceSection() {
  const baseDelay = 0;
  const staggerIncrement = 0;

  return (
    <Section id="experience" title="Professional Experience" icon={sectionIcons.experience} className="bg-card">
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <ActiveZoneAnimator
            key={index}
            entryDelay={baseDelay + index * staggerIncrement}
            className={cn(
              "transition-all duration-300 ease-in-out rounded-lg", // Base transition and rounding for border
              "hover:shadow-2xl hover:border hover:border-accent hover:-translate-y-1", // Hover effects
              "data-[in-active-zone=true]:shadow-2xl data-[in-active-zone=true]:border data-[in-active-zone=true]:border-accent data-[in-active-zone=true]:-translate-y-1" // Active zone effects
            )}
            entryAnimationType="fade-in-up"
            threshold={0.01}
          >
            <Card className="shadow-lg"> {/* Base shadow, hover/active state will override */}
              <CardHeader className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-2xl font-headline text-primary">{exp.role}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">{exp.period}</p>
                </div>
                <CardDescription className="text-lg text-foreground/80 mt-1">{exp.company}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="list-disc list-outside space-y-2 pl-5 text-foreground/90">
                  {exp.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </ActiveZoneAnimator>
        ))}
      </div>
    </Section>
  );
}
