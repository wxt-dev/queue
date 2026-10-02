import { createIocContainer } from "@aklinker1/zero-ioc";

import { ChromeWebStore } from "./services/chrome-web-store";
import { EdgeAddonStore } from "./services/edge-addon-store";
import { createEdgeApi } from "./services/edge-api";
import { ExtensionStoreProvider } from "./services/extension-store-provider";
import { FirefoxAddonStore } from "./services/firefox-addon-store";
import { createFirefoxApi } from "./services/firefox-api";
import { createInMemoryCache } from "./services/in-memory-cache";
import { createRedisCache } from "./services/redis-cache";
import { createSqliteCache } from "./services/sqlite-cache";

export const container = createIocContainer()
  .register(
    "cache",
    process.env.SQLITE_CACHE === "true"
      ? createSqliteCache
      : Bun.redis.connected
        ? createRedisCache
        : createInMemoryCache,
  )
  .register("edgeApi", createEdgeApi)
  .register("firefoxApi", createFirefoxApi);

export type Dependencies = typeof container.registrations;

export const requestScope = container
  .scope<{}>()
  .register("chromeWebStore", ChromeWebStore)
  .register("firefoxAddonStore", FirefoxAddonStore)
  .register("edgeAddonStore", EdgeAddonStore)
  .register("stores", ExtensionStoreProvider);

export type RequestDependencies = ReturnType<typeof requestScope>["registrations"];
