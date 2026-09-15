
'use server';

export interface UnsplashFetchResult {
  url: string | null;
  error?: 'rate_limit' | 'not_found' | 'generic' | 'no_key';
  errorMessage?: string;
}

export async function fetchUnsplashImage(query: string): Promise<UnsplashFetchResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey || accessKey === 'your_unsplash_access_key_here') {
    // console.error('Unsplash API key is missing or not configured in .env'); // Kept for essential error diagnosis
    return { url: null, error: 'no_key', errorMessage: 'Unsplash API Key not configured.' };
  }

  const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${accessKey}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' }); // Disable caching for random images

    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      const remainingRequests = response.headers.get('x-ratelimit-remaining');
      // console.error('Unsplash API rate limit exceeded.', { query, remainingRequests, errorData }); // Kept for essential error diagnosis
      return { url: null, error: 'rate_limit', errorMessage: `Unsplash API rate limit exceeded. Remaining: ${remainingRequests ?? 'N/A'}.` };
    }

    if (response.status === 404) {
      // console.warn(`Unsplash: No image found for query "${query}"`); // Kept for essential error diagnosis
      return { url: null, error: 'not_found', errorMessage: `No image found for query: "${query}"` };
    }

    if (!response.ok) {
      const errorText = await response.text();
      // console.error(`Unsplash API error (status ${response.status}): ${errorText}`, { query }); // Kept for essential error diagnosis
      return { url: null, error: 'generic', errorMessage: `Unsplash API error: ${response.status}.`  };
    }

    const data = await response.json();

    if (data && data.urls && data.urls.raw) {
      // Append parameters to the raw URL to get a high-quality, web-optimized image
      const optimizedUrl = data.urls.raw + '&w=2400&q=95&fit=crop';
      return { url: optimizedUrl };
    } else if (data.errors) {
      // console.warn(`Unsplash API returned errors for query "${query}":`, data.errors); // Kept for essential error diagnosis
      return { url: null, error: 'not_found', errorMessage: `Unsplash found no image or returned error for query: "${query}". Details: ${data.errors.join(', ')}` };
    } else {
      // console.warn(`Unsplash: No image URL found in response for query "${query}"`, data); // Kept for essential error diagnosis
      return { url: null, error: 'not_found', errorMessage: `No image found for query: "${query}"` };
    }
  } catch (e: any) {
    // console.error('Failed to fetch image from Unsplash:', e.message, { query }); // Kept for essential error diagnosis
    return { url: null, error: 'generic', errorMessage: `Network or parsing error fetching from Unsplash: ${e.message}` };
  }
}
