import DataLoader, { type CacheMap } from "dataloader";

export function createInMemoryCache<K, V>(config: {
  ttl: number;
}): CacheMap<K, V> {
  const cache = new Map<K, CacheEntry<V>>();
  return {
    set(key, value) {
      cache.set(key, {
        setAt: Date.now(),
        value,
      });
    },
    get(key) {
      const entry = cache.get(key);
      if (entry === undefined) return undefined;
      if (entry.setAt + config.ttl < Date.now()) return undefined;
      return entry.value ?? undefined;
    },
    clear() {
      cache.clear();
    },
    delete(key) {
      cache.delete(key);
    },
  };
}

interface CacheEntry<T> {
  setAt: number;
  value: T | null;
}

export function createCachedDataLoader<K, V>(
  ttl: number,
  batchLoadFn: DataLoader.BatchLoadFn<K, V>,
) {
  return new DataLoader(batchLoadFn, {
    cacheMap: createInMemoryCache({ ttl }),
  });
}
