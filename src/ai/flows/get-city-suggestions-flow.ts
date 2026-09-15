
'use server';
/**
 * @fileOverview A Genkit flow to get city autocomplete suggestions using Google Places API (New).
 *
 * - getCitySuggestions - A function that retrieves city suggestions.
 * - GetCitySuggestionsInput - The input type for the getCitySuggestions function.
 * - GetCitySuggestionsOutput - The return type for the getCitySuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetCitySuggestionsInputSchema = z.object({
  input: z.string().min(1).describe('The partial city name input by the user.'),
});
export type GetCitySuggestionsInput = z.infer<typeof GetCitySuggestionsInputSchema>;

const SuggestionSchema = z.object({
  description: z.string().describe('The human-readable name of the suggested place.'),
  placeId: z.string().describe('A textual identifier that uniquely identifies a place.'),
});

const GetCitySuggestionsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('A list of city suggestions.'),
  error: z.string().optional().describe('An error message if suggestions could not be retrieved.'),
});
export type GetCitySuggestionsOutput = z.infer<typeof GetCitySuggestionsOutputSchema>;


export async function getCitySuggestions(input: GetCitySuggestionsInput): Promise<GetCitySuggestionsOutput> {
  return getCitySuggestionsFlow(input);
}

const getCitySuggestionsFlow = ai.defineFlow(
  {
    name: 'getCitySuggestionsFlow',
    inputSchema: GetCitySuggestionsInputSchema,
    outputSchema: GetCitySuggestionsOutputSchema,
  },
  async ({ input }): Promise<GetCitySuggestionsOutput> => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return {
        suggestions: [],
        error: 'Configuration Error: API Key is missing.',
      };
    }

    const placesApiUrl = 'https://places.googleapis.com/v1/places:autocomplete';
    
    // Bias results to South Africa.
    // This doesn't restrict results, but makes SA results more prominent.
    const requestBody = {
      input: input,
      languageCode: "en",
      // South Africa bounding box
      locationRestriction: {
        rectangle: {
          low: { latitude: -34.82, longitude: 16.29 },
          high: { latitude: -22.12, longitude: 32.93 },
        },
      },
      // Centered roughly in the middle of SA
      origin: {
        latitude: -29.0,
        longitude: 24.0,
      }
    };


    try {
      const response = await fetch(placesApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'suggestions.placePrediction.text.text,suggestions.placePrediction.placeId',
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text(); 

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          const message = errorData.error?.message || `HTTP ${response.status}`;
          const details = errorData.error?.details?.[0] || 'No additional details.';
          return {
            suggestions: [],
            error: `Places API (New) request failed: ${message}. Details: ${JSON.stringify(details)}. Raw: ${responseText.substring(0, 500)}`,
          };
        } catch (parseError) {
          return {
            suggestions: [],
            error: `Places API (New) request failed (HTTP ${response.status}). Could not parse error response. Raw: ${responseText.substring(0, 1000)}`,
          };
        }
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return {
          suggestions: [],
          error: `Places API (New) returned an unexpected response format (not JSON). Full Response: ${responseText.substring(0, 1000)}`,
        };
      }

      const data = JSON.parse(responseText);

      if (!data.suggestions && data.error) { 
         return {
          suggestions: [],
          error: `Places API (New) error: ${data.error.message} - ${data.error.details?.[0]?.typeUrl || 'Unknown error.'}`,
        };
      }
      
      const suggestions = (data.suggestions || []).map((suggestion: any) => ({
        description: suggestion.placePrediction?.text?.text || 'Unknown suggestion',
        placeId: suggestion.placePrediction?.placeId || '',
      })).filter(s => s.placeId); 
      
      return { suggestions };

    } catch (e: any) {
      return {
        suggestions: [],
        error: `An unexpected error occurred while fetching suggestions: ${e.message}. Check server logs.`,
      };
    }
  }
);
