
'use server';
/**
 * @fileOverview A Genkit flow to get actual weather information for a city or coordinates using Google Cloud APIs,
 * including current conditions, daily forecasts, and hourly forecasts.
 *
 * - getWeather - A function that retrieves weather data.
 * - GetWeatherInput - The input type for the getWeather function.
 * - GetWeatherOutput - The return type for the getWeather function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { parseISO, format, isWithinInterval, addSeconds } from 'date-fns';

const GetWeatherInputSchema = z.object({
  city: z.string().min(1).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
}).superRefine((data, ctx) => {
  const hasCity = !!data.city;
  const hasLat = data.latitude !== undefined;
  const hasLon = data.longitude !== undefined;

  if (hasCity && (hasLat || hasLon)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Provide either city or latitude/longitude, not both.",
      path: ['city'] 
    });
  } else if (!hasCity && (!hasLat || !hasLon)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either city or both latitude and longitude must be provided.",
      path: ['city'] 
    });
  } else if ((hasLat && !hasLon) || (!hasLat && hasLon)) {
     ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Both latitude and longitude must be provided if one is present.",
        path: ['latitude'] 
    });
  }
});
export type GetWeatherInput = z.infer<typeof GetWeatherInputSchema>;

const HourlyForecastSchema = z.object({
  timeFormatted: z.string().describe("Formatted time for the hourly forecast, e.g., '3PM'."),
  icon: z.string().describe("Weather icon keyword for the hour."),
  temperature: z.string().describe("Temperature for the hour, e.g., '22°C'."),
  shortDescription: z.string().describe("Short weather description for the hour."),
  precipitationProbability: z.string().optional().describe("Precipitation probability for the hour, e.g., '10%'."),
  isDaytime: z.boolean().optional().describe("Whether it is daytime during this hour."),
});
export type HourlyForecast = z.infer<typeof HourlyForecastSchema>;

const DailyForecastSchema = z.object({
  dateFormatted: z.string().describe("Formatted date for the daily forecast, e.g., 'Tue, Jun 20'."),
  dayOfWeek: z.string().describe("Day of the week, e.g., 'Tuesday'."),
  icon: z.string().describe("Weather icon keyword for the day."),
  minTemp: z.string().describe("Minimum temperature for the day, e.g., '15°C'."),
  maxTemp: z.string().describe("Maximum temperature for the day, e.g., '25°C'."),
  feelsLikeMinTemp: z.string().optional().describe("Minimum 'feels like' temperature for the day, e.g., '14°C'."),
  feelsLikeMaxTemp: z.string().optional().describe("Maximum 'feels like' temperature for the day, e.g., '24°C'."),
  shortDescription: z.string().describe("Short weather description for the day."),
  precipitationProbability: z.string().optional().describe("Precipitation probability for the day, e.g., '20%'."),
  sunriseTimeFormatted: z.string().optional().describe("Formatted sunrise time for the day."),
  sunsetTimeFormatted: z.string().optional().describe("Formatted sunset time for the day."),
  moonPhase: z.string().optional().describe("The moon phase for the day, e.g., 'Waxing Gibbous'."),
});
export type DailyForecast = z.infer<typeof DailyForecastSchema>;

const GetWeatherOutputSchema = z.object({
  city: z.string().describe("The full display name of the city for which weather is reported, e.g., 'Paris, France'."),
  cityName: z.string().optional().describe("The simple name of the city, e.g., 'Paris'."),
  country: z.string().optional().describe("The country of the location, e.g., 'France'."),
  temperature: z.string().describe("The current temperature in Celsius, e.g., '22°C'."),
  feelsLike: z.string().optional().describe("The 'feels like' temperature in Celsius, e.g., '20°C'."),
  description: z.string().describe("A brief text description of the weather, e.g., 'Mostly Sunny', 'Light Rain'."),
  icon: z.string().describe("A keyword for a weather icon. Valid keywords: 'sun', 'moon', 'cloud-sun', 'cloud-moon', 'cloud', 'cloud-rain', 'cloud-snow', 'wind', 'thermometer', 'droplets', 'cloud-lightning', 'help-circle' (for unknown)."),
  humidity: z.string().optional().describe("The current humidity percentage, e.g., '55%'."),
  windSpeed: z.string().optional().describe("The current wind speed, e.g., '15 km/h NW (Gusts: 20 km/h)'."),
  uvIndex: z.string().optional().describe("The UV index, e.g., '5 (Moderate)'."),
  pressure: z.string().optional().describe("The air pressure, e.g., '101.2 kPa'."),
  visibility: z.string().optional().describe("The visibility, e.g., '10 km'."),
  dewPoint: z.string().optional().describe("The dew point temperature in Celsius, e.g., '10°C'."),
  cloudCover: z.string().optional().describe("The cloud cover percentage, e.g., '25%'."),
  currentTimeFormatted: z.string().optional().describe("Formatted current time at the location, e.g., '14:30'"),
  isDaytime: z.boolean().optional().describe("Whether it is currently daytime at the location."),
  precipitationProbability: z.string().optional().describe("The probability of precipitation, e.g., '10%'."),
  currentSunriseTimeFormatted: z.string().optional().describe("Formatted sunrise time for the current day."),
  currentSunsetTimeFormatted: z.string().optional().describe("Formatted sunset time for the current day."),
  hourlyForecasts: z.array(HourlyForecastSchema).optional().default([]),
  dailyForecasts: z.array(DailyForecastSchema).optional().default([]),
  error: z.string().optional().describe("An error message if the city is not found or weather data cannot be retrieved."),
  currentTemperatureCelsius: z.number().optional().describe("The current temperature in Celsius."),
  latitude: z.number().optional().describe("The latitude of the location."),
  longitude: z.number().optional().describe("The longitude of the location."),
});
export type GetWeatherOutput = z.infer<typeof GetWeatherOutputSchema>;

function mapConditionToIcon(isDaytime?: boolean, conditionType?: string, conditionText?: string): string {
  const typeToTest = conditionType || conditionText;
  if (!typeToTest) return 'help-circle';
  const lowerCondition = typeToTest.toLowerCase();

  if (conditionType) {
    if (lowerCondition.includes('thunderstorm')) return 'cloud-lightning';
    if (lowerCondition.includes('snow') || lowerCondition.includes('flurries') || lowerCondition.includes('sleet') || lowerCondition.includes('wintery')) return 'cloud-snow';
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower') || lowerCondition.includes('drizzle')) return 'cloud-rain';
    if (lowerCondition.includes('clear')) return isDaytime ? 'sun' : 'moon';
    if (lowerCondition.includes('partly_cloudy') || lowerCondition.includes('mostly_sunny') || lowerCondition.includes('partly_sunny') || lowerCondition.includes('mostly_clear')) return isDaytime ? 'cloud-sun' : 'cloud-moon';
    if (lowerCondition.includes('cloudy') || lowerCondition.includes('overcast') || lowerCondition.includes('fog') || lowerCondition.includes('haze') || lowerCondition.includes('mist')) return 'cloud';
    if (lowerCondition.includes('windy')) return 'wind';
  } else if (conditionText) {
     const lowerText = conditionText.toLowerCase();
     if (lowerText.includes('thunderstorm')) return 'cloud-lightning';
     if (lowerText.includes('snow') || lowerText.includes('flurries') || lowerText.includes('sleet')) return 'cloud-snow';
     if (lowerText.includes('rain') || lowerText.includes('shower') || lowerText.includes('drizzle')) return 'cloud-rain';
     if (lowerText.includes('clear') || lowerText.includes('sunny')) return isDaytime ? 'sun' : 'moon';
     if (lowerText.includes('partly cloudy') || lowerText.includes('mostly sunny') || lowerText.includes('partly sunny') || lowerText.includes('mostly clear')) return isDaytime ? 'cloud-sun' : 'cloud-moon';
     if (lowerText.includes('cloudy') || lowerText.includes('overcast') || lowerText.includes('fog') || lowerText.includes('haze') || lowerText.includes('mist')) return 'cloud';
     if (lowerText.includes('windy')) return 'wind';
  }
  return 'help-circle';
}

function parseUtcOffsetToSeconds(offsetString?: string): number {
  if (!offsetString || !offsetString.endsWith('s')) {
    return 0;
  }
  const seconds = parseInt(offsetString.slice(0, -1), 10);
  return isNaN(seconds) ? 0 : seconds;
}

function formatToLocalTimeWithOffset(
  utcIsoString: string | undefined,
  offsetSeconds: number,
  timeFormat: string
): string | undefined {
  if (!utcIsoString) return undefined;
  try {
    const utcDate = parseISO(utcIsoString);
    const localDate = addSeconds(utcDate, offsetSeconds);
    return format(localDate, timeFormat);
  } catch (e: any) {
    return undefined;
  }
}

function getUvIndexDescription(uvIndex: number): string {
    if (uvIndex <= 2) return `${uvIndex} (Low)`;
    if (uvIndex <= 5) return `${uvIndex} (Moderate)`;
    if (uvIndex <= 7) return `${uvIndex} (High)`;
    if (uvIndex <= 10) return `${uvIndex} (Very High)`;
    return `${uvIndex} (Extreme)`;
}

async function _getCoordinates(
  input: GetWeatherInput,
  apiKey: string
): Promise<{ 
  lat?: number; 
  lng?: number; 
  displayCityName: string; 
  cityName?: string | null;
  country?: string | null;
  error?: string 
}> {
  let { city, latitude, longitude } = input;
  let displayCityName = city || (latitude !== undefined && longitude !== undefined ? `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}` : "Unknown Location");
  let cityName: string | null = city || null;
  let country: string | null = null;
  
  if (city) {
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeText = await geocodeResponse.text();

      if (!geocodeResponse.ok || !geocodeResponse.headers.get("content-type")?.includes("application/json")) {
        return { displayCityName, error: `Geocoding API request failed (HTTP ${geocodeResponse.status}).` };
      }
      
      const geocodeData = JSON.parse(geocodeText);
      if (geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
        return { displayCityName, error: `Could not find or geocode city: '${city}'. Status: ${geocodeData.status}.` };
      }
      
      const result = geocodeData.results[0];
      const location = result.geometry.location;
      latitude = location.lat;
      longitude = location.lng;
      displayCityName = result.formatted_address || city;

      const cityComponent = result.address_components.find((c: any) => c.types.includes('locality')) 
                         || result.address_components.find((c: any) => c.types.includes('postal_town'));
      const countryComponent = result.address_components.find((c: any) => c.types.includes('country'));
      
      cityName = cityComponent ? cityComponent.long_name : null;
      country = countryComponent ? countryComponent.long_name : null;

    } catch (e: any) {
      return { displayCityName, error: `Geocoding processing error: ${e.message}.` };
    }
  } else if (latitude !== undefined && longitude !== undefined) {
    try {
      const reverseGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
      const reverseGeocodeResponse = await fetch(reverseGeocodeUrl);
      const reverseGeocodeText = await reverseGeocodeResponse.text();
      
      if (reverseGeocodeResponse.ok && reverseGeocodeResponse.headers.get("content-type")?.includes("application/json")) {
        const geocodeData = JSON.parse(reverseGeocodeText);
        if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
          const result = geocodeData.results[0];
          displayCityName = result.formatted_address || displayCityName;

          const cityComponent = result.address_components.find((c: any) => c.types.includes('locality'))
                             || result.address_components.find((c: any) => c.types.includes('postal_town'));
          const countryComponent = result.address_components.find((c: any) => c.types.includes('country'));

          cityName = cityComponent ? cityComponent.long_name : null;
          country = countryComponent ? countryComponent.long_name : null;
        }
      }
    } catch (e: any) {
      // Non-critical error, continue with lat/lon as name
    }
  }

  return { lat: latitude, lng: longitude, displayCityName, cityName, country };
}

async function _fetchAndProcessWeatherApis(lat: number, lng: number, apiKey: string) {
    const urls = {
        current: `https://weather.googleapis.com/v1/currentConditions:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}&unitsSystem=METRIC&languageCode=en`,
        daily: `https://weather.googleapis.com/v1/forecast/days:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}&languageCode=en&unitsSystem=METRIC&days=7`,
        hourly: `https://weather.googleapis.com/v1/forecast/hours:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}&languageCode=en&unitsSystem=METRIC&hours=24`,
    };

    const [currentResponse, dailyResponse, hourlyResponse] = await Promise.all([
        fetch(urls.current),
        fetch(urls.daily),
        fetch(urls.hourly),
    ]);
    
    const errors: string[] = [];

    const currentConditionsData = currentResponse.ok ? await currentResponse.json() : (errors.push("Failed to fetch current conditions."), null);
    const dailyForecastData = dailyResponse.ok ? await dailyResponse.json() : (errors.push("Failed to fetch daily forecast."), null);
    const hourlyForecastData = hourlyResponse.ok ? await hourlyResponse.json() : (errors.push("Failed to fetch hourly forecast."), null);

    return { currentConditionsData, dailyForecastData, hourlyForecastData, errors };
}

function _processAndFormatWeatherData(
    weatherApisResult: Awaited<ReturnType<typeof _fetchAndProcessWeatherApis>>,
    initialOutput: Partial<GetWeatherOutput>
): GetWeatherOutput {
    const { currentConditionsData, dailyForecastData, hourlyForecastData, errors } = weatherApisResult;
    
    let combinedOutput: Partial<GetWeatherOutput> = { ...initialOutput };
    let effectiveOffsetSeconds = 0;
    
    if (hourlyForecastData?.forecastHours?.[0]?.displayDateTime?.utcOffset) {
      effectiveOffsetSeconds = parseUtcOffsetToSeconds(hourlyForecastData.forecastHours[0].displayDateTime.utcOffset);
    } else if (currentConditionsData?.timeZone?.utcOffset) {
      effectiveOffsetSeconds = parseUtcOffsetToSeconds(currentConditionsData.timeZone.utcOffset);
    } else if (dailyForecastData?.timeZone?.utcOffset) {
      effectiveOffsetSeconds = parseUtcOffsetToSeconds(dailyForecastData.timeZone.utcOffset);
    }

    if (hourlyForecastData?.forecastHours) {
        combinedOutput.hourlyForecasts = hourlyForecastData.forecastHours.map((hourItem: any) => ({
          timeFormatted: formatToLocalTimeWithOffset(hourItem.interval?.startTime, effectiveOffsetSeconds, 'ha') || '-',
          icon: mapConditionToIcon(hourItem.isDaytime, hourItem.weatherCondition?.description?.type, hourItem.weatherCondition?.description?.text),
          temperature: hourItem.temperature?.degrees !== undefined ? `${Math.round(hourItem.temperature.degrees)}°C` : '-',
          shortDescription: hourItem.weatherCondition?.description?.text || 'N/A',
          precipitationProbability: hourItem.precipitation?.probability?.percent !== undefined ? `${hourItem.precipitation.probability.percent}%` : undefined,
          isDaytime: hourItem.isDaytime,
        }));
    }

    if (dailyForecastData?.forecastDays) {
        combinedOutput.dailyForecasts = dailyForecastData.forecastDays.map((dayItem: any) => {
            const dateObj = parseISO(`${dayItem.displayDate.year}-${String(dayItem.displayDate.month).padStart(2, '0')}-${String(dayItem.displayDate.day).padStart(2, '0')}T12:00:00Z`);
            const moonPhaseText = dayItem.moonEvents?.moonPhase?.toLowerCase().replace(/_/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || undefined;

            return {
              dateFormatted: format(dateObj, 'E, MMM d'),
              dayOfWeek: format(dateObj, 'EEEE'),
              icon: mapConditionToIcon(true, dayItem.daytimeForecast?.weatherCondition?.description?.type, dayItem.daytimeForecast?.weatherCondition?.description?.text),
              minTemp: dayItem.minTemperature?.degrees !== undefined ? `${Math.round(dayItem.minTemperature.degrees)}°C` : '-',
              maxTemp: dayItem.maxTemperature?.degrees !== undefined ? `${Math.round(dayItem.maxTemperature.degrees)}°C` : '-',
              shortDescription: dayItem.daytimeForecast?.weatherCondition?.description?.text || 'N/A',
              precipitationProbability: dayItem.daytimeForecast?.precipitation?.probability?.percent !== undefined ? `${dayItem.daytimeForecast.precipitation.probability.percent}%` : undefined,
              sunriseTimeFormatted: formatToLocalTimeWithOffset(dayItem.sunEvents?.sunriseTime, effectiveOffsetSeconds, 'p'),
              sunsetTimeFormatted: formatToLocalTimeWithOffset(dayItem.sunEvents?.sunsetTime, effectiveOffsetSeconds, 'p'),
              moonPhase: moonPhaseText,
            };
        });
        if (combinedOutput.dailyForecasts?.length) {
            combinedOutput.currentSunriseTimeFormatted = combinedOutput.dailyForecasts[0].sunriseTimeFormatted;
            combinedOutput.currentSunsetTimeFormatted = combinedOutput.dailyForecasts[0].sunsetTimeFormatted;
        }
    }

    if (currentConditionsData) {
        let finalIsDaytime = currentConditionsData.isDaytime;
        if (dailyForecastData?.forecastDays?.[0]?.sunEvents?.sunriseTime && dailyForecastData?.forecastDays?.[0]?.sunEvents?.sunsetTime && currentConditionsData?.currentTime) {
           try {
                const currentDateTimeUtc = parseISO(currentConditionsData.currentTime);
                const sunriseTodayUtc = parseISO(dailyForecastData.forecastDays[0].sunEvents.sunriseTime);
                const sunsetTodayUtc = parseISO(dailyForecastData.forecastDays[0].sunEvents.sunsetTime);
                finalIsDaytime = isWithinInterval(currentDateTimeUtc, { start: sunriseTodayUtc, end: sunsetTodayUtc });
            } catch (e: any) { /* Ignore date parsing errors */ }
        }

        combinedOutput = {
          ...combinedOutput,
          temperature: currentConditionsData.temperature?.degrees !== undefined ? `${Math.round(currentConditionsData.temperature.degrees)}°C` : '-',
          feelsLike: currentConditionsData.feelsLikeTemperature?.degrees !== undefined ? `${Math.round(currentConditionsData.feelsLikeTemperature.degrees)}°C` : undefined,
          description: currentConditionsData.weatherCondition?.description?.text || 'N/A',
          icon: mapConditionToIcon(finalIsDaytime, currentConditionsData.weatherCondition?.description?.type, currentConditionsData.weatherCondition?.description?.text),
          humidity: currentConditionsData.relativeHumidity !== undefined ? `${currentConditionsData.relativeHumidity}%` : undefined,
          windSpeed: currentConditionsData.wind?.speed?.value !== undefined ? `${Math.round(currentConditionsData.wind.speed.value)} km/h ${currentConditionsData.wind.direction?.cardinal || ''}`.trim() + (currentConditionsData.wind.gust?.value ? ` (Gusts: ${Math.round(currentConditionsData.wind.gust.value)} km/h)` : '') : undefined,
          uvIndex: currentConditionsData.uvIndex !== undefined ? getUvIndexDescription(currentConditionsData.uvIndex) : undefined,
          pressure: currentConditionsData.airPressure?.meanSeaLevelMillibars !== undefined ? `${(currentConditionsData.airPressure.meanSeaLevelMillibars / 10).toFixed(1)} kPa` : undefined,
          visibility: currentConditionsData.visibility?.distance?.value !== undefined ? `${currentConditionsData.visibility.distance.value} km` : undefined,
          dewPoint: currentConditionsData.dewPoint?.degrees !== undefined ? `${Math.round(currentConditionsData.dewPoint.degrees)}°C` : undefined,
          cloudCover: currentConditionsData.cloudCover !== undefined ? `${currentConditionsData.cloudCover}%` : undefined,
          currentTimeFormatted: formatToLocalTimeWithOffset(currentConditionsData.currentTime, effectiveOffsetSeconds, "HH:mm"),
          isDaytime: finalIsDaytime,
          precipitationProbability: currentConditionsData.precipitation?.probability?.percent !== undefined ? `${currentConditionsData.precipitation.probability.percent}%` : undefined,
          currentTemperatureCelsius: currentConditionsData.temperature?.degrees,
        };
    }

    if (errors.length > 0) {
      combinedOutput.error = (combinedOutput.error ? combinedOutput.error + ' \\n ' : '') + errors.join(' \\n ');
    }
    
    if (!combinedOutput.temperature) combinedOutput.temperature = '-';
    if (!combinedOutput.description) {
        combinedOutput.description = combinedOutput.error ? 'Error retrieving some data.' : 'N/A';
    }
    if (!combinedOutput.icon) combinedOutput.icon = 'help-circle';

    return combinedOutput as GetWeatherOutput;
}


const getWeatherFlow = ai.defineFlow(
  {
    name: 'getWeatherFlow',
    inputSchema: GetWeatherInputSchema,
    outputSchema: GetWeatherOutputSchema,
  },
  async (input: GetWeatherInput): Promise<GetWeatherOutput> => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return { city: input.city || "N/A", temperature: '-', description: 'API Key Error', icon: 'help-circle', error: 'Configuration Error: GOOGLE_MAPS_API_KEY is missing.' };
    }
    
    const { lat, lng, displayCityName, cityName, country, error: geoError } = await _getCoordinates(input, apiKey);

    if (geoError || typeof lat !== 'number' || typeof lng !== 'number') {
        return { city: displayCityName, temperature: '-', description: 'Location Error', icon: 'help-circle', error: geoError || "Failed to determine coordinates for weather lookup." };
    }

    const weatherApisResult = await _fetchAndProcessWeatherApis(lat, lng, apiKey);
    
    const initialOutput: Partial<GetWeatherOutput> = {
        city: displayCityName,
        cityName: cityName || undefined,
        country: country || undefined,
        latitude: lat,
        longitude: lng,
        error: geoError
    };
    
    return _processAndFormatWeatherData(weatherApisResult, initialOutput);
  }
);

export async function getWeather(input: GetWeatherInput): Promise<GetWeatherOutput> {
  return getWeatherFlow(input);
}
