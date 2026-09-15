
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';
import { personalInfo } from '@/lib/data';

const siteUrl = 'https://nitai.pro';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nitai Baboolal | Portfolio',
    template: `%s | Nitai Baboolal`,
  },
  description: 'Personal portfolio of Nitai Baboolal, a Cloud FinOps Analyst and Analytics Engineer.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Nitai Baboolal | Portfolio',
    description: 'Personal portfolio of Nitai Baboolal, a Cloud FinOps Analyst and Analytics Engineer.',
    url: siteUrl,
    siteName: "Nitai Baboolal's Portfolio",
    images: [
      {
        url: personalInfo.profileImageUrl,
        width: 400,
        height: 400,
        alt: `Profile picture of ${personalInfo.name}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nitai Baboolal | Portfolio',
    description: 'Personal portfolio of Nitai Baboolal, a Cloud FinOps Analyst and Analytics Engineer.',
    images: [personalInfo.profileImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name,
    url: personalInfo.website,
    image: personalInfo.profileImageUrl,
    jobTitle: personalInfo.title,
    email: personalInfo.email,
    sameAs: [
      personalInfo.linkedin,
      personalInfo.githubUrl,
      personalInfo.instagramUrl,
      personalInfo.credlyUrl,
    ].filter(Boolean),
  };

  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Toaster />
      </body>
    </html>
  );
}
