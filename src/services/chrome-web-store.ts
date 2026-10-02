import type { Cache } from "./cache";
import { crawlExtension } from "./chrome-crawler";
import { ExtensionStore } from "./extension-store";

export class ChromeWebStore extends ExtensionStore<Gql.ChromeExtension> {
  constructor(deps: { cache: Cache }) {
    super(deps.cache, "chrome-extension-v2-", (id) => crawlExtension(String(id), "en"));
  }
}
