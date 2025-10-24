/**
 * Domains Service - Centralized domain data loading with caching
 * Loads data from local public/data/latest.json file
 */

interface Domain {
  d: string;
  date: string;
}

interface ApiResponse {
  updated: string;
  domains: Domain[];
}

// In-memory cache
let cachedData: ApiResponse | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Load domains from local JSON file with caching
 */
export const loadDomains = async (): Promise<ApiResponse> => {
  // Check if cache is still valid
  const now = Date.now();
  if (cachedData && (now - cacheTime) < CACHE_DURATION) {
    console.log('📦 Using cached domain data');
    return cachedData;
  }

  try {
    console.log('🔄 Loading domain data from local file...');
    
    // Load from local public folder (served as static asset)
    const response = await fetch('/data/latest.json', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load domains: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.domains || !Array.isArray(data.domains) || data.domains.length === 0) {
      throw new Error('Invalid or empty domain data');
    }

    // Update cache
    cachedData = data;
    cacheTime = now;

    console.log(`✅ Loaded ${data.domains.length} domains from local file`);
    return data;
  } catch (error) {
    console.error('❌ Error loading domains:', error);
    throw error;
  }
};

/**
 * Clear the cache (useful for manual refresh)
 */
export const clearCache = () => {
  cachedData = null;
  cacheTime = 0;
  console.log('🗑️ Domain cache cleared');
};

/**
 * Get sorted domains by date
 */
export const getSortedDomains = (domains: Domain[]): Domain[] => {
  return [...domains].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
