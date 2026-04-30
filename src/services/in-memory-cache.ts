import { HOUR_MS } from "../utils/time";
import type { Cache } from "./cache";

const TTL = HOUR_MS;

export function createInMemoryCache(): Cache {
  let cache: Record<string, any> = Object.create(null);
  let ttl: Record<string, number> = Object.create(null);

  return {
    get: async (key: string) => {
      if (ttl[key] && Date.now() > ttl[key]) {
        delete cache[key];
        delete ttl[key];
      }
      return cache[key];
    },
    set: async (key: string, value: any) => {
      cache[key] = value;
      ttl[key] = Date.now() + TTL;
    },
  };
}
