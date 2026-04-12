import { createFirefoxApi } from "./firefox-api";
import { defineExtensionStore, type ExtensionStore } from "./extension-store";

export type FirefoxAddonStore = ExtensionStore<Gql.FirefoxAddon>;

export function createFirefoxAddonStore() {
  const api = createFirefoxApi();

  return defineExtensionStore((id) => api.getAddon(id));
}
