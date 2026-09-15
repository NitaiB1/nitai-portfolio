
'use client';

import React from 'react';
import type { DailyForecast } from '@/ai/flows/get-weather-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, MoonStar } from 'lucide-react';
import { WeatherIconDisplay } from './WeatherIconDisplay';

interface DailyForecastDisplayProps {
  dailyForecasts: DailyForecast[];
  sectionAnimationVariants: any;
}

export function DailyForecastDisplay({
  dailyForecasts,
  sectionAnimationVariants,
}: DailyForecastDisplayProps) {
  return (
    <motion.section
      id="weather-daily"
      className="max-w-lg mx-auto bg-card/90 dark:bg-card/80 backdrop-blur-md rounded-lg shadow-xl"
      variants={sectionAnimationVariants}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
    >
      <Card className="shadow-none w-full bg-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyForecasts.map((day, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center justify-between p-3 rounded-lg bg-muted/40 dark:bg-muted/30 shadow hover:bg-muted/60 transition-colors gap-2">
                <div className="flex items-center space-x-3 text-center">
                  <WeatherIconDisplay iconName={day.icon} className="h-10 w-10 text-accent" />
                  <div>
                    <p className="font-semibold text-foreground">{day.dayOfWeek}</p>
                    <p className="text-xs text-muted-foreground">{day.dateFormatted}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <p className="text-lg font-bold text-foreground">
                    {day.maxTemp} / {day.minTemp}
                  </p>
                  {(day.feelsLikeMaxTemp || day.feelsLikeMinTemp) && (
                    <p className="text-sm text-muted-foreground">
                      (Feels like {day.feelsLikeMaxTemp || '-'} / {day.feelsLikeMinTemp || '-'})
                    </p>
                  )}
                  {day.precipitationProbability && parseFloat(day.precipitationProbability) > 0 && (
                      <p className="text-xs text-blue-500 whitespace-normal mt-0.5">{day.precipitationProbability} rain</p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center whitespace-normal">{day.shortDescription}</p>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-muted-foreground text-center">
                  {day.sunriseTimeFormatted && <div className="flex items-center"><Sunrise className="h-4 w-4 mr-1 text-yellow-500" /> {day.sunriseTimeFormatted}</div>}
                  {day.sunsetTimeFormatted && <div className="flex items-center"><Sunset className="h-4 w-4 mr-1 text-orange-500" /> {day.sunsetTimeFormatted}</div>}
                  {day.moonPhase && <div className="flex items-center"><MoonStar className="h-4 w-4 mr-1 text-sky-400" /> {day.moonPhase}</div>}
                </div>
              </div>
              {index < dailyForecasts.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </motion.section>
  );
}
