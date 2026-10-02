import type { Logger } from "@aklinker1/logger";
import { deserializeError } from "@aklinker1/zero-serialize-error";

import type { Cache, CacheResult } from "../services/cache";

export function buildCacheWith(
  logger: Logger,
  get: (key: string) => Promise<CacheResult<unknown> | undefined>,
  save: (key: string, res: CacheResult<unknown>) => Promise<void>,
): Cache["with"] {
  return (async (key, fn) => {
    const cached = await get(key);
    if (cached) {
      if (cached.success) return cached.data;
      else throw deserializeError(cached.error);
    }

    try {
      const data = await fn();
      await save(key, { success: true, data }).catch(() => {
        logger.warn("Failed to save cache.with success result", { data });
      });
      return data;
    } catch (error) {
      await save(key, { success: false, error }).catch(() => {
        logger.warn("Failed to save cache.with error result", { error });
      });
      throw error;
    }
  }) as Cache["with"];
}
