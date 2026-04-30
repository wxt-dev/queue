import type { Cache } from "./cache";
import { ExtensionStore } from "./extension-store";
import type { FirefoxApi } from "./firefox-api";

export type FirefoxAddonStore = ExtensionStore<Gql.FirefoxAddon>;

export function createFirefoxAddonStore({
  cache,
  firefoxApi,
}: {
  cache: Cache;
  firefoxApi: FirefoxApi;
}): FirefoxAddonStore {
  return new ExtensionStore({
    fetch: (id) => firefoxApi.getAddon(String(id)),
    cacheKeyPrefix: "firefox-addon-",
    cache,
  });
}
