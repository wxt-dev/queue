import { ExtensionStoreName } from "../enums";
import type { ExtensionStore } from "./extension-store";

export class ExtensionStoreProvider {
  constructor(
    readonly deps: {
      chromeWebStore: ExtensionStore<Gql.ChromeExtension>;
      firefoxAddonStore: ExtensionStore<Gql.FirefoxAddon>;
      edgeAddonStore: ExtensionStore<Gql.EdgeAddon>;
    },
  ) {}

  get [ExtensionStoreName.ChromeWebStore]() {
    return this.deps.chromeWebStore;
  }

  get [ExtensionStoreName.FirefoxAddonStore]() {
    return this.deps.firefoxAddonStore;
  }

  get [ExtensionStoreName.EdgeAddonStore]() {
    return this.deps.edgeAddonStore;
  }
}
