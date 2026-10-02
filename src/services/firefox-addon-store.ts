import type { Cache } from "./cache";
import { ExtensionStore } from "./extension-store";
import type { FirefoxApi } from "./firefox-api";

export class FirefoxAddonStore extends ExtensionStore<Gql.FirefoxAddon> {
  constructor(deps: { cache: Cache; firefoxApi: FirefoxApi }) {
    super(deps.cache, "firefox-addon-v2-", (id) => deps.firefoxApi.getAddon(String(id)));
  }
}
