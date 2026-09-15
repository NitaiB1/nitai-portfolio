
'use client';

import type { GetWeatherOutput } from '@/ai/flows/get-weather-flow';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Star, RefreshCw, Clock, Sunrise, Sunset, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeatherIconDisplay } from './WeatherIconDisplay';

export interface WeatherDetailItem {
  id: string;
  label: string;
  value: string | undefined;
  icon: LucideIcon;
}

interface CurrentWeatherDisplayProps {
  weatherData: GetWeatherOutput;
  displayableDetails: WeatherDetailItem[];
  favorites: string[];
  overallIsLoadingUI: boolean;
  isLoadingWeather: boolean; // Specifically for refresh button state
  handleAddFavorite: () => void;
  handleManualRefresh: () => void;
  sectionAnimationVariants: any; // Consider defining a more specific type if used elsewhere
}

export function CurrentWeatherDisplay({
  weatherData,
  displayableDetails,
  favorites,
  overallIsLoadingUI,
  isLoadingWeather,
  handleAddFavorite,
  handleManualRefresh,
  sectionAnimationVariants,
}: CurrentWeatherDisplayProps) {
  const numDisplayableDetails = displayableDetails.length;

  return (
    <motion.div
      id="weather-current"
      className="max-w-lg mx-auto bg-card/90 dark:bg-card/80 backdrop-blur-md rounded-lg shadow-xl"
      variants={sectionAnimationVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="shadow-none w-full bg-transparent">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center">
            <CardTitle className="text-3xl font-headline text-primary mr-2">
              Weather in {weatherData.city}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddFavorite}
              disabled={!weatherData?.city || overallIsLoadingUI || favorites.includes(weatherData.city || '')}
              className={cn("text-muted-foreground hover:text-amber-500", favorites.includes(weatherData.city || '') && "text-amber-500")}
              aria-label={favorites.includes(weatherData.city || '') ? "Favorite location" : "Add to favorites"}
            >
              <Star className={cn("h-5 w-5", favorites.includes(weatherData.city || '') && "fill-amber-500")}/>
            </Button>
             <Button
              variant="ghost"
              size="icon"
              onClick={handleManualRefresh}
              disabled={!weatherData?.city || overallIsLoadingUI}
              className="text-muted-foreground hover:text-primary"
              aria-label="Refresh weather data"
            >
              {isLoadingWeather ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
            </Button>
          </div>
          {weatherData.currentTimeFormatted && (
            <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>{weatherData.currentTimeFormatted}</span>
            </div>
          )}
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mt-2">
            {weatherData.currentSunriseTimeFormatted && (
              <div className="flex items-center">
                <Sunrise className="h-5 w-5 mr-1.5 text-yellow-500" />
                <span>{weatherData.currentSunriseTimeFormatted}</span>
              </div>
            )}
            {weatherData.currentSunsetTimeFormatted && (
              <div className="flex items-center">
                <Sunset className="h-5 w-5 mr-1.5 text-orange-500" />
                <span>{weatherData.currentSunsetTimeFormatted}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <WeatherIconDisplay iconName={weatherData.icon} className="h-24 w-24 text-accent" />
            <p className="text-5xl font-bold text-foreground">{weatherData.temperature}</p>
            {weatherData.feelsLike && (
               <p className="text-lg text-foreground/80 font-medium mt-1">(Feels like {weatherData.feelsLike})</p>
            )}
            <p className="text-xl text-muted-foreground">{weatherData.description}</p>
          </div>

          {numDisplayableDetails > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {displayableDetails.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center space-x-2 p-3 bg-muted/60 dark:bg-muted/50 rounded-lg",
                      (numDisplayableDetails % 2 !== 0 && index === numDisplayableDetails - 1) && "sm:col-span-2"
                    )}
                  >
                    <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-foreground">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

    