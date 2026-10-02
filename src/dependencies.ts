import { createIocContainer } from "@aklinker1/zero-ioc";

import { ExtensionStoreName } from "./enums";
import { createChromeWebStore } from "./services/chrome-web-store";
import { createEdgeAddonStore } from "./services/edge-addon-store";
import { createEdgeApi } from "./services/edge-api";
import type { ExtensionStores } from "./services/extension-stores";
import { createFirefoxAddonStore } from "./services/firefox-addon-store";
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
  .register("chromeWebStore", createChromeWebStore)
  .register("firefoxAddonStore", createFirefoxAddonStore)
  .register("edgeAddonStore", createEdgeAddonStore)
  .register(
    "stores",
    (deps) =>
      ({
        [ExtensionStoreName.ChromeWebStore]: deps.chromeWebStore,
        [ExtensionStoreName.FirefoxAddonStore]: deps.firefoxAddonStore,
        [ExtensionStoreName.EdgeAddonStore]: deps.edgeAddonStore,

        // Deprecated, but staying around for a while.
        [ExtensionStoreName.ChromeExtensions]: deps.chromeWebStore,
        [ExtensionStoreName.FirefoxExtensions]: deps.firefoxAddonStore,
        [ExtensionStoreName.EdgeExtensions]: deps.edgeAddonStore,
      }) satisfies ExtensionStores,
  );

export type RequestDependencies = ReturnType<typeof requestScope>["registrations"];
