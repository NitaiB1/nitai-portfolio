'use client';

import { Section } from '@/components/layout/Section';
import { aboutMe, sectionIcons } from '@/lib/data';
import { LampContainer } from '@/components/ui/lamp';
import { motion } from 'framer-motion';

export function AboutSection() {
  const paragraphs = aboutMe.split('\\n');

  return (
    <Section
      id="about"
      title="About Me"
      icon={sectionIcons.about}
      className="pt-10 sm:pt-12 md:pt-16 pb-0 bg-transparent" // Added top padding, kept pb-0
    >
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{
            delay: 0.3,
            duration: 0.25,
            ease: "easeInOut",
          }}
          // Reduced top padding here to bring text closer to the lamp visual
          className="max-w-3xl mx-auto text-center space-y-4 px-6 pt-8 sm:pt-10 md:pt-12 pb-12"
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base sm:text-lg text-foreground/90 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </motion.div>
      </LampContainer>
    </Section>
  );
}
