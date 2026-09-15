
'use client';

import { Section } from '@/components/layout/Section';
import { certifications, sectionIcons } from '@/lib/data';
import { BadgeCheck } from 'lucide-react';
import { GlareCard } from '@/components/ui/glare-card';
import { ActiveZoneAnimator } from '@/components/layout/ActiveZoneAnimator';
import { cn } from '@/lib/utils';

export function CertificationsSection() {
  const baseDelay = 0;
  const staggerIncrement = 0;

  return (
    <Section id="certifications" title="Certifications & Accolades" icon={sectionIcons.certifications} className="bg-card" subtitle="Proof of my commitment to continuous learning and professional development.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {certifications.map((cert, index) => (
          <ActiveZoneAnimator
            key={index}
            entryDelay={baseDelay + index * staggerIncrement}
            className={cn(
              "h-full transition-all duration-300 ease-in-out", // Base transition
              // GlareCard has its own hover effects. Active zone will add lift & shadow.
              "hover:-translate-y-1",
              "data-[in-active-zone=true]:-translate-y-1 data-[in-active-zone=true]:shadow-2xl"
            )}
            entryAnimationType="fade-in-up"
            threshold={0.01}
          >
            <GlareCard className="h-full w-full">
              <div className="p-4 flex items-center space-x-3 h-full">
                <BadgeCheck className="h-6 w-6 text-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-primary">{cert.name}</p>
                  {cert.issuer && <p className="text-xs text-muted-foreground">{cert.issuer}</p>}
                </div>
              </div>
            </GlareCard>
          </ActiveZoneAnimator>
        ))}
      </div>
    </Section>
  );
}
