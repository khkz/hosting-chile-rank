
interface ScreenshotProvider {
  name: string;
  getUrl: (domain: string) => string;
  timeout: number;
}

const SCREENSHOT_PROVIDERS: ScreenshotProvider[] = [
  {
    name: 'urlbox',
    getUrl: (domain: string) => `https://api.urlbox.io/v1/ca482d7e-9417-4569-90fe-80f7c5e1c781/png?url=https://${domain}&width=400&height=300&quality=80&delay=2000`,
    timeout: 4000
  },
  {
    name: 'microlink',
    getUrl: (domain: string) => `https://api.microlink.io/screenshot?url=https://${domain}&viewport.width=400&viewport.height=300&waitFor=2000`,
    timeout: 4000
  },
  {
    name: 'htmlcsstoimage',
    getUrl: (domain: string) => `https://hcti.io/v1/image?url=https://${domain}&viewport_width=400&viewport_height=300`,
    timeout: 4000
  }
];

export interface ScreenshotResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  provider?: string;
  fallbackData?: {
    favicon?: string;
    title?: string;
    description?: string;
  };
}

export class ScreenshotService {
  private cache: Map<string, { url: string; timestamp: number; provider: string }> = new Map();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

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

    // Check if domain is accessible
    const isAccessible = await this.isDomainAccessible(domain);
    if (!isAccessible) {
      return this.getFallbackResult(domain, 'Domain not accessible');
    }

    // Try screenshot providers with limited retries
    for (let i = 0; i < SCREENSHOT_PROVIDERS.length; i++) {
      const provider = SCREENSHOT_PROVIDERS[i];
      try {
        console.log(`🔄 Trying provider: ${provider.name} for ${domain}`);
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
        console.warn(`❌ Provider ${provider.name} failed:`, error);
        // Continue to next provider
      }
    }

    // All providers failed, return fallback
    return this.getFallbackResult(domain, 'All screenshot providers failed');
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

  private async getFallbackResult(domain: string, error: string): Promise<ScreenshotResult> {
    // Try to get favicon and basic info
    const fallbackData = await this.getFallbackData(domain);
    
    return {
      success: false,
      error,
      fallbackData
    };
  }

  private async getFallbackData(domain: string): Promise<{ favicon?: string; title?: string; description?: string }> {
    try {
      // Try to get favicon
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      
      // Test if favicon loads
      const faviconWorks = await new Promise<boolean>((resolve) => {
        const img = new Image();
        const timeoutId = setTimeout(() => {
          img.onload = null;
          img.onerror = null;
          resolve(false);
        }, 2000);

        img.onload = () => {
          clearTimeout(timeoutId);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          resolve(false);
        };

        img.src = faviconUrl;
      });

      return {
        favicon: faviconWorks ? faviconUrl : undefined,
        title: domain,
        description: `Sitio web de ${domain}`
      };
    } catch {
      return {
        title: domain,
        description: `Sitio web de ${domain}`
      };
    }
  }

  private getCachedScreenshot(domain: string): { url: string; provider: string } | null {
    const cached = this.cache.get(domain);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return { url: cached.url, provider: cached.provider };
    }
    
    if (cached) {
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

  async isDomainAccessible(domain: string): Promise<boolean> {
    try {
      // Use a faster, more reliable check
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`, {
        signal: AbortSignal.timeout(3000)
      });
      const data = await response.json();
      return data.Status === 0 && data.Answer && data.Answer.length > 0;
    } catch {
      return false;
    }
  }
}

export const screenshotService = new ScreenshotService();
