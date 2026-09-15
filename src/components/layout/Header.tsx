
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, CloudSun, Rocket, LayoutTemplate } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { personalInfo, sectionIcons } from '@/lib/data';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  id: string;
  icon: LucideIcon;
}

const mainPageNavItemsTemplate: Omit<NavItem, 'href'>[] = [
  { label: 'Home', id: 'home', icon: sectionIcons.home },
  { label: 'Apps', id: 'apps', icon: sectionIcons.apps },
  { label: 'About', id: 'about', icon: sectionIcons.about },
  { label: 'Skills', id: 'skills', icon: sectionIcons.skills },
  { label: 'Experience', id: 'experience', icon: sectionIcons.experience },
  { label: 'Education', id: 'education', icon: sectionIcons.education },
  { label: 'Certifications', id: 'certifications', icon: sectionIcons.certifications },
  { label: 'Projects', id: 'projects', icon: sectionIcons.projects },
  { label: 'Contact', id: 'contact', icon: sectionIcons.contact },
];

const weatherNavItemTemplate: Omit<NavItem, 'href'> = { label: 'Weather', id: 'weather', icon: CloudSun };
const astroWorldNavItemTemplate: Omit<NavItem, 'href'> = { label: 'Astro World', id: 'astroworld', icon: Rocket };
const siteBuilderNavItemTemplate: Omit<NavItem, 'href'> = { label: 'Site Builder', id: 'sitebuilder', icon: LayoutTemplate };

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const router = useRouter();

  const getAdjustedHref = (originalId: string, isMainPageItem: boolean) => {
    if (isMainPageItem) {
      if (pathname === '/') {
        return `#${originalId}`;
      }
      return `/#${originalId}`;
    }
    // For non-main page items like /weather
    return `/${originalId}`;
  };

  const allNavItems: NavItem[] = [
    ...mainPageNavItemsTemplate.map(item => ({
      ...item,
      href: getAdjustedHref(item.id === 'home' ? 'hero' : item.id, true)
    })),
    {
      ...weatherNavItemTemplate,
      href: getAdjustedHref(weatherNavItemTemplate.id, false)
    },
    {
      ...astroWorldNavItemTemplate,
      href: getAdjustedHref(astroWorldNavItemTemplate.id, false)
    },
    {
      ...siteBuilderNavItemTemplate,
      href: 'https://biolinkify.com'
    }
  ];

  const portfolioNavItems = allNavItems.filter(item => mainPageNavItemsTemplate.some(t => t.id === item.id));
  const appNavItems = allNavItems.filter(item => item.id === 'weather' || item.id === 'astroworld' || item.id === 'sitebuilder');


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (pathname === '/') {
        let currentSectionId = 'home';
        let foundSection = false;
        // Use allNavItems but filter for main page sections for scroll tracking
        const mainPageScrollItems = allNavItems.filter(item => item.href.startsWith('/#') || item.href.startsWith('#'));

        for (const item of mainPageScrollItems) {
          // Derive ID from adjusted href
          const sectionDomId = item.href.substring(item.href.lastIndexOf('#') + 1);
          const sectionElement = document.getElementById(sectionDomId);
          if (sectionElement) {
            const rect = sectionElement.getBoundingClientRect();
            const viewportMiddle = window.innerHeight / 2;
            if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
              currentSectionId = item.id;
              foundSection = true;
              break;
            }
          }
        }
        if (!foundSection) {
          let minDistance = Infinity;
          let closestSectionId = 'home';
          for (const item of mainPageScrollItems) {
            const sectionDomId = item.href.substring(item.href.lastIndexOf('#') + 1);
            const sectionElement = document.getElementById(sectionDomId);
            if (sectionElement) {
                const rect = sectionElement.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    const distanceToTop = Math.abs(rect.top);
                    if (distanceToTop < minDistance) {
                        minDistance = distanceToTop;
                        closestSectionId = item.id;
                    }
                }
            }
          }
          currentSectionId = closestSectionId;
        }
        setActiveSection(currentSectionId);
      } else {
        const currentPageId = allNavItems.find(item => item.href === pathname)?.id;
        if (currentPageId) {
          setActiveSection(currentPageId);
        } else {
          setActiveSection('');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    sectionId: string
  ) => {
    setIsSheetOpen(false);
    setActiveSection(sectionId);
    
    const isMainPageSection = href.includes('#');

    if (isMainPageSection) {
      const elementId = href.substring(href.lastIndexOf('#') + 1);
      
      if (pathname === '/') {
        e.preventDefault();
        const sectionElement = document.getElementById(elementId);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        e.preventDefault();
        sessionStorage.setItem('scrollToSection', elementId);
        router.push('/');
      }
    } else {
      // It's a link to a separate page like /weather, let default behavior happen
    }
  };
  
  const homeLinkHref = pathname === '/' ? '#hero' : '/#hero';


  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-lg" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href={homeLinkHref} onClick={(e) => handleLinkClick(e, homeLinkHref, 'home')} className="text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
            {personalInfo.shortName}
          </Link>

          <nav className="hidden md:flex items-center justify-center bg-card/60 backdrop-blur-sm p-2 rounded-full shadow-md space-x-2">
            <TooltipProvider delayDuration={100}>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-muted-foreground px-3 select-none">Portfolio</span>
                {portfolioNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item.href, item.id)}
                          className={cn(
                            "flex items-center justify-center p-3 rounded-full transition-all duration-200 ease-out",
                            "hover:bg-accent/70 hover:shadow-lg",
                            isActive ? "bg-accent text-accent-foreground shadow-lg scale-110" : "text-foreground/70 hover:text-primary"
                          )}
                          aria-label={item.label}
                        >
                          <Icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-primary")} />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-card text-card-foreground border-border shadow-xl rounded-md">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              <div className="h-6 w-px bg-border/50 mx-1"></div>

              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-muted-foreground px-3 select-none">Apps</span>
                {appNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const isExternal = item.href.startsWith('http');
                  return (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item.href, item.id)}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className={cn(
                            "flex items-center justify-center p-3 rounded-full transition-all duration-200 ease-out",
                            "hover:bg-accent/70 hover:shadow-lg",
                            isActive ? "bg-accent text-accent-foreground shadow-lg scale-110" : "text-foreground/70 hover:text-primary"
                          )}
                          aria-label={item.label}
                        >
                          <Icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-primary")} />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-card text-card-foreground border-border shadow-xl rounded-md">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </nav>

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background p-0 flex flex-col">
                <SheetHeader className="p-6 text-left border-b">
                  <SheetTitle>
                     <Link href={homeLinkHref} className="text-2xl font-headline font-bold text-primary" onClick={(e) => handleLinkClick(e, homeLinkHref, 'home')}>
                      {personalInfo.shortName}
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-grow p-4 overflow-y-auto">
                  <nav className="flex flex-col space-y-2">
                    <h3 className="px-3 pt-2 text-sm font-semibold text-muted-foreground">Portfolio</h3>
                    {portfolioNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item.href, item.id)}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-md transition-colors",
                            isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:text-primary hover:bg-accent/50"
                          )}
                        >
                          <Icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-primary")} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                    <div className="py-2">
                      <div className="h-px bg-border/50" />
                    </div>
                    <h3 className="px-3 text-sm font-semibold text-muted-foreground">Apps</h3>
                    {appNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      const isExternal = item.href.startsWith('http');
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item.href, item.id)}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-md transition-colors",
                            isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:text-primary hover:bg-accent/50"
                          )}
                        >
                          <Icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-primary")} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
