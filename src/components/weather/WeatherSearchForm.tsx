
'use client';

import type { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, MapPin } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

const formSchema = z.object({
  city: z.string().min(1, { message: 'City name is required.' }),
});
type FormData = z.infer<typeof formSchema>;

export interface CitySuggestion {
  description: string;
  placeId: string;
}

interface WeatherSearchFormProps {
  form: UseFormReturn<FormData>;
  onSubmit: SubmitHandler<FormData>;
  cityInputValue: string; // Needed for debounced suggestions display
  suggestions: CitySuggestion[];
  isLoadingSuggestions: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleSuggestionClick: (suggestion: CitySuggestion) => void;
  handleCurrentLocation: () => void;
  overallIsLoadingUI: boolean;
  isLoadingWeather: boolean;
  isLocating: boolean;
}

export function WeatherSearchForm({
  form,
  onSubmit,
  cityInputValue,
  suggestions,
  isLoadingSuggestions,
  showSuggestions,
  setShowSuggestions,
  handleSuggestionClick,
  handleCurrentLocation,
  overallIsLoadingUI,
  isLoadingWeather,
  isLocating,
}: WeatherSearchFormProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSuggestions]);


  return (
    <Card className="shadow-xl w-full bg-card/90 dark:bg-card/80 backdrop-blur-md">
      <CardHeader>
        <h1 className="text-2xl font-headline text-primary text-center leading-none tracking-tight">
            Weather Forecast
        </h1>
        <CardDescription className="text-center text-muted-foreground">
          Enter a city name or use your current location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City / Suburb Name</FormLabel>
                  <FormControl>
                    <div className="relative" ref={searchContainerRef}>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="e.g., London, New York, Fourways"
                        {...field}
                        className="pl-10 bg-background/80 dark:bg-background/70"
                        onFocus={() => {
                          if (suggestions.length > 0 || cityInputValue.length > 1) setShowSuggestions(true);
                        }}
                        autoComplete="off"
                      />
                      {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
                        <div className="absolute z-20 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          <ul tabIndex={-1}>
                            {isLoadingSuggestions && <li className="px-3 py-2 text-sm text-muted-foreground">Loading suggestions...</li>}
                            {!isLoadingSuggestions && suggestions.map((suggestion) => (
                              <li
                                key={suggestion.placeId}
                                className="px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSuggestionClick(suggestion);
                                }}
                              >
                                {suggestion.description}
                              </li>
                            ))}
                            {!isLoadingSuggestions && suggestions.length === 0 && cityInputValue.length > 1 && (
                              <li className="px-3 py-2 text-sm text-muted-foreground">
                                No suggestions found. Try a broader area or check spelling.
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
                <Button id="weather-search-submit-btn" type="submit" className="w-full sm:flex-1" disabled={overallIsLoadingUI}>
                  {isLoadingWeather ? (
                     <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {'Fetching Weather...'}
                    </>
                  ) : (
                    'Get Weather'
                  )}
                </Button>
                <Button
                  id="weather-search-location-btn"
                  type="button"
                  variant="outline"
                  onClick={handleCurrentLocation}
                  disabled={overallIsLoadingUI}
                   className="w-full sm:flex-1"
                >
                  {isLocating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="mr-2 h-4 w-4" />
                  )}
                  My Location
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
