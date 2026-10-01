import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { createLogger } from "@aklinker1/logger";
import { sql, SQL } from "bun";

import { buildCacheWith } from "../utils/cache";
import { DAY_MS } from "../utils/time";
import type { Cache } from "./cache";

const logger = createLogger("sqlite-cache");

const TTL = DAY_MS;
const TABLE = "cache";

export function createSqliteCache(): Cache {
  const dir = "data";
  mkdirSync(dir, { recursive: true });

  const path = join(dir, "cache.db");
  logger.info("Using SQLite cache", { path });
  const sqlite = new SQL({ adapter: "sqlite", filename: path });

  const ready = (async () => {
    await sqlite`
      CREATE TABLE IF NOT EXISTS ${sql(TABLE)}
      (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        addedAt INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_cache_addedAt ON ${sql(TABLE)}(addedAt);
    `;
    await sqlite`PRAGMA journal_mode = WAL`;
    await sqlite`
      DELETE FROM ${sql(TABLE)}
      WHERE addedAt < ${Date.now() - TTL}
    `;
  })();

  const baseWith = buildCacheWith(
    logger,
    async (key) => {
      const [result] = await sqlite`
        SELECT value
        FROM ${sql(TABLE)}
        WHERE key = ${key} AND addedAt > ${Date.now() - TTL}
      `;
      return result == null ? undefined : JSON.parse(result.value);
    },
    async (key, res) => {
      await sqlite`
        INSERT OR REPLACE INTO ${sql(TABLE)}
        (key, value, addedAt)
        VALUES (${key}, ${JSON.stringify(res)}, ${Date.now()})
      `;
    },
  );

  return {
    with: async (key, fn) => {
      await ready;

      return await baseWith(key, fn);
    },
  };
}
