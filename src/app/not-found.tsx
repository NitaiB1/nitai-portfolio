
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-6xl font-headline font-bold text-primary">404</h1>
          <p className="mt-2 text-2xl font-semibold text-foreground">Page Not Found</p>
          <p className="mt-4 text-muted-foreground max-w-sm">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
