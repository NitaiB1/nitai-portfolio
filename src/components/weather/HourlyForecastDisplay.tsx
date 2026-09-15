
'use client';

import type { HourlyForecast } from '@/ai/flows/get-weather-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { WeatherIconDisplay } from './WeatherIconDisplay';

interface HourlyForecastDisplayProps {
  hourlyForecasts: HourlyForecast[];
  sectionAnimationVariants: any;
}

export function HourlyForecastDisplay({
  hourlyForecasts,
  sectionAnimationVariants,
}: HourlyForecastDisplayProps) {
  return (
    <motion.section
      id="weather-hourly"
      className="max-w-lg mx-auto bg-card/90 dark:bg-card/80 backdrop-blur-md rounded-lg shadow-xl"
      variants={sectionAnimationVariants}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
    >
      <Card className="shadow-none w-full bg-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">Next 24 Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {hourlyForecasts.map((hour, index) => (
                <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-muted/40 dark:bg-muted/30 w-24 text-center shadow-md flex-shrink-0 hover:bg-muted/60 transition-colors">
                  <p className="text-xs font-medium text-muted-foreground">{hour.timeFormatted}</p>
                  <WeatherIconDisplay iconName={hour.icon} className="h-10 w-10 my-1 text-accent" />
                  <p className="text-lg font-semibold text-foreground">{hour.temperature}</p>
                  {hour.shortDescription && <p className="text-xs text-muted-foreground mt-0.5 capitalize whitespace-normal line-clamp-2 h-8">{hour.shortDescription.split(',')[0]}</p>}
                  {hour.precipitationProbability && parseFloat(hour.precipitationProbability) > 0 && (
                      <p className="text-xs text-blue-500 mt-0.5 whitespace-normal">{hour.precipitationProbability}</p>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.section>
  );
}

    