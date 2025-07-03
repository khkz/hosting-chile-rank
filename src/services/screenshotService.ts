
interface ScreenshotProvider {
  name: string;
  getUrl: (domain: string) => string;
  timeout: number;
}

const SCREENSHOT_PROVIDERS: ScreenshotProvider[] = [
  {
    name: 'thum.io',
    getUrl: (domain: string) => `https://image.thum.io/get/width/400/png/${domain}`,
    timeout: 8000
  },
  {
    name: 'screenshotapi',
    getUrl: (domain: string) => `https://shot.screenshotapi.net/screenshot?token=free&url=${encodeURIComponent(`https://${domain}`)}&width=400&height=300&output=image`,
    timeout: 10000
  },
  {
    name: 'microlink',
    getUrl: (domain: string) => `https://api.microlink.io/screenshot?url=${encodeURIComponent(`https://${domain}`)}&viewport.width=400&viewport.height=300`,
    timeout: 8000
  }
];

export interface ScreenshotResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  provider?: string;
}

export class ScreenshotService {
  private cache: Map<string, { url: string; timestamp: number; provider: string }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  async captureScreenshot(domain: string): Promise<ScreenshotResult> {
    // Check cache first
    const cached = this.getCachedScreenshot(domain);
    if (cached) {
      return {
        success: true,
        imageUrl: cached.url,
        provider: cached.provider
      };
    }

    // Try each provider in sequence
    for (const provider of SCREENSHOT_PROVIDERS) {
      try {
        console.log(`🔄 Trying screenshot provider: ${provider.name} for ${domain}`);
        const imageUrl = await this.attemptScreenshot(provider, domain);
        
        if (imageUrl) {
          // Cache successful result
          this.cacheScreenshot(domain, imageUrl, provider.name);
          
          return {
            success: true,
            imageUrl,
            provider: provider.name
          };
        }
      } catch (error) {
        console.warn(`❌ Provider ${provider.name} failed for ${domain}:`, error);
        continue;
      }
    }

    return {
      success: false,
      error: 'No screenshot providers available'
    };
  }

  private async attemptScreenshot(provider: ScreenshotProvider, domain: string): Promise<string | null> {
    const imageUrl = provider.getUrl(domain);
    
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        resolve(null);
      }, provider.timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(imageUrl);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        resolve(null);
      };

      img.src = imageUrl;
    });
  }

  private getCachedScreenshot(domain: string): { url: string; provider: string } | null {
    const cached = this.cache.get(domain);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return { url: cached.url, provider: cached.provider };
    }
    
    if (cached) {
      // Remove expired cache
      this.cache.delete(domain);
    }
    
    return null;
  }

  private cacheScreenshot(domain: string, url: string, provider: string): void {
    this.cache.set(domain, {
      url,
      provider,
      timestamp: Date.now()
    });

    // Clean old cache entries
    this.cleanExpiredCache();
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [domain, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.CACHE_DURATION) {
        this.cache.delete(domain);
      }
    }
  }

  // Check if domain is likely to have a working website
  async isDomainAccessible(domain: string): Promise<boolean> {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const data = await response.json();
      return data.Status === 0 && data.Answer && data.Answer.length > 0;
    } catch {
      return false;
    }
  }
}

export const screenshotService = new ScreenshotService();
