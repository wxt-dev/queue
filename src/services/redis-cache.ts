import { DAY_MS } from "../utils/time";
import type { Cache } from "./cache";

const EXPIRATION = DAY_MS / 1000; // 24 hours in seconds

export function createRedisCache(): Cache {
  return {
    async get<T>(key: string): Promise<T | undefined> {
      const value = await Bun.redis.get(key);
      if (value === null) {
        return undefined;
      }
      return JSON.parse(value) as T;
    },
    async set<T>(key: string, value: T): Promise<void> {
      await Bun.redis.set(key, JSON.stringify(value));
      await Bun.redis.expire(key, EXPIRATION);
    },
  };
}
