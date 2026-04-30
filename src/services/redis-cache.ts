import { createLogger } from "@aklinker1/logger";
import { DAY_MS } from "../utils/time";
import type { Cache } from "./cache";

const logger = createLogger("redis");

const TTL = DAY_MS;
const TTL_S = TTL / 1000;

export function createRedisCache(): Cache {
  logger.info("Using redis cache", {
    url: process.env.REDIS_URL || process.env.VALKEY_URL,
  });

  return {
    async get<T>(key: string): Promise<T | undefined> {
      const value = await Bun.redis.get(key);
      if (value == null) return undefined;

      return JSON.parse(value) as T;
    },
    async set<T>(key: string, value: T): Promise<void> {
      await Bun.redis.set(key, JSON.stringify(value));
      await Bun.redis.expire(key, TTL_S);
    },
  };
}
