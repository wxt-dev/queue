import { crawlExtension } from "./chrome-crawler";
import { defineExtensionStore, type ExtensionStore } from "./extension-store";

export type ChromeWebStore = ExtensionStore<Gql.ChromeExtension>;

export function createChromeWebStore() {
  return defineExtensionStore((id) => crawlExtension(String(id), "en"));
}
