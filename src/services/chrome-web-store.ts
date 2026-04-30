import type { Cache } from "./cache";
import { crawlExtension } from "./chrome-crawler";
import { ExtensionStore } from "./extension-store";

export type ChromeWebStore = ExtensionStore<Gql.ChromeExtension>;

export function createChromeWebStore({
  cache,
}: {
  cache: Cache;
}): ChromeWebStore {
  return new ExtensionStore({
    fetch: (id) => crawlExtension(String(id), "en"),
    cacheKeyPrefix: "chrome-extension-",
    cache,
  });
}
