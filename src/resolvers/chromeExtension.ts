import { chrome } from "../crawlers";
import { InMemoryCache, getFromCacheOrFetch } from "../utils/cache";

export const chromeExtension =
  (cache: InMemoryCache<Gql.ChromeExtension>): Gql.Query["chromeExtension"] =>
  async (variables) => {
    const { id } = variables;
    return getFromCacheOrFetch(cache, id, () =>
      chrome.crawlExtension(id, "en")
    );
  };
