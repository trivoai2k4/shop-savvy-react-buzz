
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheMiddleware {
  private static cache = new Map<string, CacheItem<any>>();
  private static defaultTTL = 5 * 60 * 1000; // 5 minutes

  static set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    
    console.log(`Cache SET: ${key} (TTL: ${ttl}ms)`);
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      console.log(`Cache MISS: ${key}`);
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      console.log(`Cache EXPIRED: ${key}`);
      return null;
    }

    console.log(`Cache HIT: ${key}`);
    return item.data as T;
  }

  static clear(): void {
    this.cache.clear();
    console.log('Cache cleared');
  }

  static generateKey(baseKey: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${baseKey}:${sortedParams}`;
  }
}

export default CacheMiddleware;
