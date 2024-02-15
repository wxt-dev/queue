import { chrome } from "../crawlers";
import { createCachedDataLoader } from "../utils/cache";
import { DAY_MS } from "../utils/time";

export function createChromeService() {
  const loader = createCachedDataLoader<
    string,
    Gql.ChromeExtension | undefined
  >(DAY_MS, (ids) =>
    Promise.all(ids.map((id) => chrome.crawlExtension(id, "en")))
  );

  return {
    getExtension: (id: string) => loader.load(id),
    getExtensions: async (ids: string[]) => {
      const result = await loader.loadMany(ids);
      return result.map((item) => {
        if (item == null) return undefined;
        if (item instanceof Error) {
          console.warn("Error fetching multiple extensions:", item);
          return undefined;
        }
        return item;
      });
    },
  };
}
