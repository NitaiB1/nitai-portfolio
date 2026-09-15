
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface FavoriteLocationsProps {
  favorites: string[];
  handleFavoriteClick: (cityName: string) => void;
  handleRemoveFavorite: (cityName: string) => void;
  overallIsLoadingUI: boolean;
}

export function FavoriteLocations({
  favorites,
  handleFavoriteClick,
  handleRemoveFavorite,
  overallIsLoadingUI,
}: FavoriteLocationsProps) {
  return (
    <Card className="shadow-xl w-full bg-card/90 dark:bg-card/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">Favorite Locations</CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            You haven&apos;t saved any favorite locations yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map((favCity) => (
              <div key={favCity} className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  className="flex-grow justify-start text-left h-auto py-2"
                  onClick={() => handleFavoriteClick(favCity)}
                  disabled={overallIsLoadingUI}
                >
                  <span className="whitespace-normal break-words">{favCity}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                  onClick={() => handleRemoveFavorite(favCity)}
                  aria-label={`Remove ${favCity} from favorites`}
                  disabled={overallIsLoadingUI}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
