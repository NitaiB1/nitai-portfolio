
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeather, type GetWeatherOutput } from '@/ai/flows/get-weather-flow';
import { getCitySuggestions } from '@/ai/flows/get-city-suggestions-flow';
import { fetchUnsplashImage } from '@/services/unsplash-service';
import { Sun, CloudRain, Wind, Thermometer, Droplets, Loader2, MapPin, AlertTriangle, Star, RefreshCw, Clock, Sunrise, Sunset, Gauge, Eye, Layers } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ParallaxBackground } from '@/components/weather/ParallaxBackground';
import { WeatherSearchForm, type CitySuggestion } from '@/components/weather/WeatherSearchForm';
import { FavoriteLocations } from '@/components/weather/FavoriteLocations';
import { CurrentWeatherDisplay, type WeatherDetailItem } from '@/components/weather/CurrentWeatherDisplay';
import { HourlyForecastDisplay } from '@/components/weather/HourlyForecastDisplay';
import { DailyForecastDisplay } from '@/components/weather/DailyForecastDisplay';
import { WeatherErrorDisplay } from '@/components/weather/WeatherErrorDisplay';
import { WeatherPageSkeleton } from '@/components/weather/WeatherPageSkeleton';
import { Globe } from '@/components/ui/globe';
import { cn } from '@/lib/utils';

// Constants
const MAX_FAVORITES = 3;
const ULTIMATE_FALLBACK_SRC = '/stars.jpg';
const INITIAL_UNSPLASH_QUERY = "stunning Milky Way night sky star field galaxy";

// Form Schema
const formSchema = z.object({
  city: z.string().min(1, { message: 'City name is required.' }),
});
type FormData = z.infer<typeof formSchema>;

// Animation Variants
const sectionAnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeOut" } }
};

// --- Utility Functions for Background Image Query ---
function generateUnsplashQuery(weatherData: GetWeatherOutput): string {
    if (weatherData.error || !weatherData.city) {
      return '';
    }

    const condition = weatherData.description?.toLowerCase() || 'weather';

    let timeOfDayDesc = '';
    if (weatherData.isDaytime === true) {
        timeOfDayDesc = "daytime";
    } else if (weatherData.isDaytime === false) {
        timeOfDayDesc = "night";
    }

    const locationForQuery = [weatherData.cityName, weatherData.country].filter(Boolean).join(', ');
    const effectiveLocation = locationForQuery || weatherData.city;
  
    const query = `${condition} ${timeOfDayDesc} in ${effectiveLocation}`;

    return query.trim().replace(/\s+/g, ' ');
}

// Custom Hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}


export default function WeatherPageClient() {
  // State Management
  const [weatherData, setWeatherData] = useState<GetWeatherOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [cityInputValue, setCityInputValue] = useState('');
  const debouncedCityInput = useDebounce(cityInputValue, 300);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [backgroundImageTarget, setBackgroundImageTarget] = useState<string>(ULTIMATE_FALLBACK_SRC);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState<boolean>(true);
  const [highlightedLocation, setHighlightedLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { city: '' },
  });

  // Effect for watching form input
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'city') setCityInputValue(value.city || '');
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Effect for fetching initial background
  useEffect(() => {
    let isMounted = true;
    setIsBackgroundLoading(true);
    const fetchInitialBackground = async () => {
      const result = await fetchUnsplashImage(INITIAL_UNSPLASH_QUERY);
      if (isMounted) {
        setBackgroundImageTarget(result.url || ULTIMATE_FALLBACK_SRC);
      }
    };
    fetchInitialBackground();
    return () => { isMounted = false; };
  }, []);

  // Effect for city suggestions
  useEffect(() => {
    if (debouncedCityInput && debouncedCityInput.length > 1) {
      const fetchSuggestions = async () => {
        setIsLoadingSuggestions(true);
        setShowSuggestions(true);
        try {
          const result = await getCitySuggestions({ input: debouncedCityInput });
          setSuggestions(result.error ? [] : result.suggestions);
        } catch (e: any) {
          setSuggestions([]);
        }
        setIsLoadingSuggestions(false);
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedCityInput]);

  // Effect for managing favorites in localStorage
  useEffect(() => {
    try {
      const savedFavoritesRaw = localStorage.getItem('weatherFavorites');
      if (savedFavoritesRaw) {
        const parsedFavorites = JSON.parse(savedFavoritesRaw);
        if (Array.isArray(parsedFavorites)) setFavorites(parsedFavorites);
      }
    } catch (e) { /* Silently fail */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    } catch (e) { /* Silently fail */ }
  }, [favorites]);


  // Handlers and Callbacks
  const handleImageLoadStatusChange = useCallback((status: { isLoading: boolean }) => {
    setIsBackgroundLoading(status.isLoading);
  }, []);
  
  const updateBackgroundImage = useCallback(async (query: string) => {
    // Only proceed if we have a valid, non-empty query.
    if (query && query.length > 0 && !query.startsWith("in ")) {
      setIsBackgroundLoading(true);
      const unsplashResult = await fetchUnsplashImage(query);
      // Only update the background if Unsplash returns a valid URL.
      // Otherwise, keep the current background to avoid flashing the fallback.
      if (unsplashResult.url) {
        setBackgroundImageTarget(unsplashResult.url);
      } else {
        setIsBackgroundLoading(false);
      }
    } else {
      setIsBackgroundLoading(false);
    }
  }, []);
  
  const fetchAndProcessWeather = useCallback(async (
    weatherFetchFn: () => Promise<GetWeatherOutput>,
    onFinally?: () => void
  ) => {
      setIsLoading(true);
      setWeatherData(null);
      setShowSuggestions(false);

      try {
        const weatherResult = await weatherFetchFn();
        setWeatherData(weatherResult);

        if (weatherResult?.city) {
          form.setValue('city', weatherResult.city, { shouldValidate: false });
          setCityInputValue(weatherResult.city);
        }

        if (weatherResult && !weatherResult.error && weatherResult.latitude !== undefined && weatherResult.longitude !== undefined) {
          setHighlightedLocation({ lat: weatherResult.latitude, lon: weatherResult.longitude });
        } else {
          setHighlightedLocation(null);
        }

        const newQuery = generateUnsplashQuery(weatherResult);
        await updateBackgroundImage(newQuery);

      } catch (e: any) {
        setWeatherData({
          city: form.getValues('city') || "Error",
          temperature: '-',
          description: 'Failed to fetch data.',
          icon: 'help-circle',
          error: e.message || "An unexpected error occurred.",
        });
        setHighlightedLocation(null);
        await updateBackgroundImage('');
      } finally {
        setIsLoading(false);
        onFinally?.();
      }
  }, [form, updateBackgroundImage]);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await fetchAndProcessWeather(() => getWeather({ city: data.city.trim() }));
  };

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    form.setValue('city', suggestion.description, { shouldValidate: true });
    setCityInputValue(suggestion.description);
    setShowSuggestions(false);
    onSubmit({ city: suggestion.description });
  };
  
  const handleCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    form.reset({ city: '' });
    setCityInputValue('');

    const fetcher = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        return getWeather({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      } catch (e: any) {
        let message = "An unknown error occurred while getting your location.";
        if (e instanceof GeolocationPositionError) {
          switch (e.code) {
            case e.PERMISSION_DENIED:
              message = "Location permission denied. Please enable location services for this site in your browser settings.";
              break;
            case e.POSITION_UNAVAILABLE:
              message = "Your location information is currently unavailable. Please try again or search for a city manually.";
              break;
            case e.TIMEOUT:
              message = "The request to get your location timed out. Please try again.";
              break;
          }
        }
        throw new Error(message);
      }
    };
    await fetchAndProcessWeather(fetcher, () => setIsLocating(false));
  }, [form, fetchAndProcessWeather]);

  const handleManualRefresh = async () => {
    const currentCity = form.getValues('city') || weatherData?.city;
    if (currentCity) {
      if (weatherData?.latitude !== undefined && weatherData?.longitude !== undefined) {
        await fetchAndProcessWeather(() => getWeather({ latitude: weatherData.latitude, longitude: weatherData.longitude }));
      } else {
        await fetchAndProcessWeather(() => getWeather({ city: currentCity }));
      }
    }
  };

  const handleAddFavorite = () => {
    if (weatherData?.city && !favorites.includes(weatherData.city) && favorites.length < MAX_FAVORITES) {
      setFavorites(prev => [...prev, weatherData.city]);
    }
  };

  const handleRemoveFavorite = (cityToRemove: string) => {
    setFavorites(prev => prev.filter(city => city !== cityToRemove));
  };

  const handleFavoriteClick = (cityName: string) => {
    form.setValue('city', cityName, { shouldValidate: true });
    setCityInputValue(cityName);
    onSubmit({ city: cityName });
  };

  const getDisplayableDetails = (): WeatherDetailItem[] => {
    if (!weatherData) return [];
    const potentialDetails: WeatherDetailItem[] = [
      { id: 'humidity', label: 'Humidity', value: weatherData.humidity, icon: Droplets },
      { id: 'wind', label: 'Wind', value: weatherData.windSpeed, icon: Wind },
      { id: 'precip_chance_current', label: 'Precip. Chance', value: weatherData.precipitationProbability, icon: CloudRain },
      { id: 'uv', label: 'UV Index', value: weatherData.uvIndex, icon: Sun },
      { id: 'pressure', label: 'Pressure', value: weatherData.pressure, icon: Gauge },
      { id: 'visibility', label: 'Visibility', value: weatherData.visibility, icon: Eye },
      { id: 'dewpoint', label: 'Dew Point', value: weatherData.dewPoint, icon: Thermometer },
      { id: 'cloudcover', label: 'Cloud Cover', value: weatherData.cloudCover, icon: Layers },
    ];
    return potentialDetails.filter(item => item.value !== undefined && item.value !== null && item.value !== '' && item.value !== 'N/A');
  }

  // Derived State
  const overallIsLoadingUI = isLoading || isLocating;
  const displayableDetails = getDisplayableDetails();
  const hasData = weatherData && weatherData.city && weatherData.temperature !== '-';
  const hasError = weatherData?.error;

  return (
    <div className="flex flex-col min-h-screen weather-page-container">
      <ParallaxBackground
        targetImageSrc={backgroundImageTarget}
        ultimateFallbackSrc={ULTIMATE_FALLBACK_SRC}
        onImageLoadStatusChange={handleImageLoadStatusChange}
      />
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-4 pb-8 relative z-10 flex flex-col gap-4">
        <div className={cn("flex items-center justify-center -mt-64 sm:mt-0 transition-all duration-500 ease-in-out")}>
            <Globe location={highlightedLocation} />
        </div>

        <motion.section
          className="max-w-lg mx-auto w-full"
          variants={sectionAnimationVariants}
          initial="hidden"
          animate="visible"
        >
          <WeatherSearchForm
            form={form}
            onSubmit={onSubmit}
            cityInputValue={cityInputValue}
            suggestions={suggestions}
            isLoadingSuggestions={isLoadingSuggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            handleSuggestionClick={handleSuggestionClick}
            handleCurrentLocation={handleCurrentLocation}
            overallIsLoadingUI={overallIsLoadingUI}
            isLoadingWeather={isLoading}
            isLocating={isLocating}
          />
        </motion.section>

        <motion.section
          className="max-w-lg mx-auto w-full"
          variants={sectionAnimationVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <FavoriteLocations
            favorites={favorites}
            handleFavoriteClick={handleFavoriteClick}
            handleRemoveFavorite={handleRemoveFavorite}
            overallIsLoadingUI={overallIsLoadingUI}
          />
        </motion.section>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="skeleton" exit={{ opacity: 0 }} className="space-y-8">
              <WeatherPageSkeleton />
            </motion.div>
          ) : weatherData ? (
            <motion.div
              key="weatherContent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {hasData && (
                  <CurrentWeatherDisplay
                    weatherData={weatherData}
                    displayableDetails={displayableDetails}
                    favorites={favorites}
                    overallIsLoadingUI={overallIsLoadingUI}
                    isLoadingWeather={isLoading}
                    handleAddFavorite={handleAddFavorite}
                    handleManualRefresh={handleManualRefresh}
                    sectionAnimationVariants={sectionAnimationVariants}
                  />
              )}

              {hasData && weatherData.hourlyForecasts && weatherData.hourlyForecasts.length > 0 && (
                <HourlyForecastDisplay
                  hourlyForecasts={weatherData.hourlyForecasts}
                  sectionAnimationVariants={sectionAnimationVariants}
                />
              )}

              {hasData && weatherData.dailyForecasts && weatherData.dailyForecasts.length > 0 && (
                <DailyForecastDisplay
                  dailyForecasts={weatherData.dailyForecasts}
                  sectionAnimationVariants={sectionAnimationVariants}
                />
              )}

              {hasError && (
                  <WeatherErrorDisplay
                    errorText={weatherData.error as string}
                    sectionAnimationVariants={sectionAnimationVariants}
                  />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
        
        <div className="flex-grow" />

      </main>
      <Footer />
    </div>
  );
}
