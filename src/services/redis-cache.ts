import { createLogger } from "@aklinker1/logger";

import { buildCacheWith } from "../utils/cache";
import { DAY_MS } from "../utils/time";
import type { Cache } from "./cache";

const logger = createLogger("redis-cache");

const TTL = DAY_MS;
const TTL_S = TTL / 1000;

export function createRedisCache(): Cache {
  logger.info("Using redis cache", {
    url: process.env.REDIS_URL || process.env.VALKEY_URL,
  });

  return {
    with: buildCacheWith(
      logger,
      async (key) => {
        const cached = await Bun.redis.get(key);
        return cached == null ? undefined : JSON.parse(cached);
      },
      async (key, res) => {
        await Bun.redis.set(key, JSON.stringify(res), "EX", TTL_S);
      },
    ),
  };
}
