import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Explicitly pass the API key from environment variables to the plugin.
// This prioritizes the Gemini/Google AI keys, but falls back to the
// Maps API key if the others are not set. This helps resolve
// initialization errors on pages that use Maps but not generative AI.
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
