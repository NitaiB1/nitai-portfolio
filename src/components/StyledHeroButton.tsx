
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LinkProps } from 'next/link';
import type { HTMLAttributeAnchorTarget } from 'react';


interface StyledHeroButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode; // Text
  icon?: LucideIcon;
  className?: string;
  download?: string | boolean;
  target?: HTMLAttributeAnchorTarget;
  // Note: Next.js LinkProps are extensive, 'props' will capture them if needed.
  // For common ones like 'target' and 'rel', they can be explicitly defined or passed via ...props.
}

export function StyledHeroButton({
  href,
  children,
  icon: Icon,
  className,
  download,
  target,
  rel,
  ...props 
}: StyledHeroButtonProps) {
  return (
    <Link
      href={href}
      download={download === true ? undefined : download || undefined}
      target={target}
      rel={rel}
      className={cn(
        "p-[3px] relative flex items-center justify-center rounded-lg text-sm font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props} // Spread remaining props to the Link component
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className={cn(
        "px-8 py-2 bg-card text-card-foreground rounded-[6px] relative transition-all duration-300 group-hover:bg-transparent group-hover:text-primary-foreground flex items-center justify-center space-x-2 w-full h-full pointer-events-none"
      )}>
        {Icon && <Icon className="h-5 w-5" />}
        <span>{children}</span>
      </div>
    </Link>
  );
}
