import type { Cache } from "./cache";
import { crawlExtension } from "./chrome-crawler";
import { ExtensionStore, type ExtensionId } from "./extension-store";

export class ChromeWebStore extends ExtensionStore<Gql.ChromeExtension> {
  constructor(deps: { cache: Cache }) {
    super(deps.cache, "chrome-web-store", "chrome-extension-v2-");
  }

  protected fetchExtension(id: ExtensionId): Promise<Gql.ChromeExtension | undefined> {
    return crawlExtension(String(id), "en");
  }
}
