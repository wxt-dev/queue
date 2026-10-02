import { createLogger } from "@aklinker1/logger";

import { buildCacheWith } from "../utils/cache";
import { HOUR_MS } from "../utils/time";
import type { Cache, CacheResult } from "./cache";

const logger = createLogger("in-memory-cache");

const TTL = HOUR_MS;

export function createInMemoryCache(): Cache {
  logger.info("Using in-memory cache");

  let cache: Record<string, CacheResult<unknown>> = Object.create(null);
  let ttl: Record<string, number> = Object.create(null);

  return {
    with: buildCacheWith(
      logger,
      async (key) => {
        if (ttl[key] && Date.now() > ttl[key]) {
          delete cache[key];
          delete ttl[key];
        }
        return cache[key];
      },
      async (key, res) => {
        cache[key] = res;
        ttl[key] = Date.now() + TTL;
      },
    ),
  };
}
