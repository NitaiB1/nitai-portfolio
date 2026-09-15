
'use client';

import { Section } from '@/components/layout/Section';
import { personalInfo, sectionIcons } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, Linkedin, Globe, Instagram, Github } from 'lucide-react';
import { AnimatedListItem } from '@/components/layout/AnimatedListItem';
import type { ElementType } from 'react';

interface ContactItemType {
  Icon: ElementType;
  text: string;
  href: string;
  label: string;
  target?: string;
}

const contactItems: ContactItemType[] = [
  { Icon: Mail, text: personalInfo.email, href: `mailto:${personalInfo.email}`, label: "Email" },
  { Icon: Linkedin, text: "LinkedIn Profile", href: personalInfo.linkedin, label: "LinkedIn", target: "_blank" },
  personalInfo.instagramUrl && { Icon: Instagram, text: "Instagram Profile", href: personalInfo.instagramUrl, label: "Instagram", target: "_blank" },
  personalInfo.githubUrl && { Icon: Github, text: "GitHub Profile", href: personalInfo.githubUrl, label: "GitHub", target: "_blank" },
  personalInfo.website && { Icon: Globe, text: personalInfo.website, href: personalInfo.website, label: "Website", target: "_blank" },
].filter(Boolean) as ContactItemType[];


export function ContactSection() {
  const baseDelay = 0;
  const staggerIncrement = 0;

  return (
    <Section id="contact" title="Get In Touch" icon={sectionIcons.contact} className="bg-card" subtitle="I'm always open to discussing new projects, creative ideas, or opportunities.">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardContent className="p-6 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8"> {/* Adjusted gap-y */}
              {contactItems.map((item, index) => (
                <AnimatedListItem
                  key={item.label}
                  delay={baseDelay + index * staggerIncrement}
                  className="group rounded-lg transition-colors duration-200 ease-in-out hover:bg-muted/60 focus-within:bg-muted/60"
                >
                  <Link
                    href={item.href}
                    target={item.target || "_self"}
                    rel={item.target ? "noopener noreferrer" : ""}
                    className="flex items-start space-x-4 p-4 w-full h-full outline-none"
                    aria-label={`Contact ${personalInfo.name} via ${item.label}`}
                  >
                    <item.Icon className="h-7 w-7 text-accent mt-0.5 flex-shrink-0" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-primary mb-0.5">{item.label}</h3>
                      <p className="text-base text-foreground/80 group-hover:text-primary group-hover:underline break-all transition-colors duration-200 ease-in-out">
                        {item.text}
                      </p>
                    </div>
                  </Link>
                </AnimatedListItem>
              ))}
            </div>
            <AnimatedListItem delay={baseDelay + contactItems.length * staggerIncrement}>
              <p className="text-center text-muted-foreground">
                Feel free to reach out through any of the channels above. I look forward to hearing from you!
              </p>
            </AnimatedListItem>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
