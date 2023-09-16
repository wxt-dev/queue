export function createInMemoryCache<T>(config: {
  expiresInMs: number;
}): InMemoryCache<T> {
  const cache: Record<string, CacheEntry<T>> = {};
  return {
    set(key, value) {
      cache[key] = {
        setAt: Date.now(),
        value,
      };
    },
    get(key) {
      const entry = cache[key];
      if (entry === undefined) return undefined;
      if (entry.setAt + config.expiresInMs < Date.now()) return undefined;
      return entry.value;
    },
  };
}

interface CacheEntry<T> {
  setAt: number;
  value: T | null;
}

export interface InMemoryCache<T> {
  get(key: string): T | undefined | null;
  set(key: string, value: T | null): void;
}

export async function getFromCacheOrFetch<T>(
  cache: InMemoryCache<T>,
  id: string,
  getLatest: () => Promise<T | undefined | null>
): Promise<T | undefined> {
  const cached = cache.get(id);
  if (cached !== undefined) return cached ?? undefined;

  const latest = await getLatest();
  cache.set(id, latest ?? null);
  return latest ?? undefined;
}
