
import { personalInfo } from '@/lib/data';
import { Mail, Linkedin, Globe, Instagram, Github, Award } from 'lucide-react'; // Added Award
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href={`mailto:${personalInfo.email}`} aria-label="Email" className="hover:text-primary transition-colors">
            <Mail className="h-6 w-6" />
          </Link>
          <Link href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
          </Link>
          {personalInfo.instagramUrl && (
            <Link href={personalInfo.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
          )}
          {personalInfo.githubUrl && (
            <Link href={personalInfo.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </Link>
          )}
          {personalInfo.credlyUrl && ( // Added Credly link
            <Link href={personalInfo.credlyUrl} target="_blank" rel="noopener noreferrer" aria-label="Credly Profile" className="hover:text-primary transition-colors">
              <Award className="h-6 w-6" />
            </Link>
          )}
          {personalInfo.website && (
            <Link href={personalInfo.website} target="_blank" rel="noopener noreferrer" aria-label="Website" className="hover:text-primary transition-colors">
              <Globe className="h-6 w-6" />
            </Link>
          )}
        </div>
        <p className="text-sm">
          &copy; {currentYear} {personalInfo.name}. All rights reserved.
        </p>
         <p className="text-xs mt-1">
          Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
