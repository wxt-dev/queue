import { ExtensionStoreName } from "../enums";
import type { Cache } from "./cache";
import { ExtensionStore, type ExtensionId } from "./extension-store";
import type { FirefoxApi } from "./firefox-api";

export class FirefoxAddonStore extends ExtensionStore<Gql.FirefoxAddon> {
  constructor(private deps: { cache: Cache; firefoxApi: FirefoxApi }) {
    super(deps.cache, ExtensionStoreName.FirefoxAddonStore, "firefox-addon-v2-");
  }

  protected fetchExtension(id: ExtensionId): Promise<Gql.FirefoxAddon | undefined> {
    return this.deps.firefoxApi.getAddon(id);
  }
}
