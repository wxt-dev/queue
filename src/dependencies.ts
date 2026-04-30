import { createIocContainer, transient } from "@aklinker1/zero-ioc";
import { createChromeWebStore } from "./services/chrome-web-store";
import { createFirefoxAddonStore } from "./services/firefox-addon-store";
import { createEdgeAddonStore } from "./services/edge-addon-store";
import type { ExtensionStores } from "./services/extension-stores";
import { ExtensionStoreName } from "./enums";
import { createRedisCache } from "./services/redis-cache";
import { createInMemoryCache } from "./services/in-memory-cache";
import { createEdgeApi } from "./services/edge-api";
import { createFirefoxApi } from "./services/firefox-api";

export const container = createIocContainer()
  .register(
    "cache",
    Bun.redis.connected ? createRedisCache : createInMemoryCache,
  )
  .register("edgeApi", createEdgeApi)
  .register("firefoxApi", createFirefoxApi)
  .register("chromeWebStore", transient(createChromeWebStore))
  .register("firefoxAddonStore", transient(createFirefoxAddonStore))
  .register("edgeAddonStore", transient(createEdgeAddonStore))
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

export type Dependencies = typeof container.registrations;
