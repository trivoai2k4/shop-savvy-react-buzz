
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

class CacheMiddleware {
  private static cache = new Map<string, CacheItem<any>>();
  private static defaultTTL = 5 * 60 * 1000; // 5 minutes
  private static maxCacheSize = 50;
  private static cleanupInterval = 60 * 1000; // 1 minute

  static {
    // Auto cleanup expired entries
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.cleanup();
      }, this.cleanupInterval);
    }
  }

  static set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    // If cache is full, remove least recently used item
    if (this.cache.size >= this.maxCacheSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache SET: ${key} (TTL: ${ttl}ms, Size: ${this.cache.size})`);
    }
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Cache MISS: ${key}`);
      }
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Cache EXPIRED: ${key}`);
      }
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache HIT: ${key} (accessed ${item.accessCount} times)`);
    }
    return item.data as T;
  }

  static has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
    if (process.env.NODE_ENV === 'development') {
      console.log('Cache cleared');
    }
  }

  static cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (process.env.NODE_ENV === 'development' && cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired items`);
    }
  }

  private static evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Cache LRU eviction: ${oldestKey}`);
      }
    }
  }

  static generateKey(baseKey: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    
    return `${baseKey}:${btoa(sortedParams).slice(0, 32)}`; // Use base64 and truncate for shorter keys
  }

  static getStats() {
    const stats = {
      size: this.cache.size,
      items: Array.from(this.cache.entries()).map(([key, item]) => ({
        key,
        age: Date.now() - item.timestamp,
        ttl: item.ttl,
        accessCount: item.accessCount,
        lastAccessed: item.lastAccessed,
      }))
    };
    
    return stats;
  }
}

export default CacheMiddleware;
