import { chrome } from "../crawlers";
import { createCachedDataLoader } from "../utils/cache";
import { HOUR_MS } from "../utils/time";

export function createChromeService() {
  const loader = createCachedDataLoader<
    string,
    Gql.ChromeExtension | undefined
  >(HOUR_MS, async (ids) => {
    const results = await Promise.allSettled(
      ids.map((id) => chrome.crawlExtension(id, "en")),
    );
    return results.map((res) =>
      res.status === "fulfilled" ? res.value : res.reason,
    );
  });

  return {
    getExtension: (id: string) => loader.load(id),
    getExtensions: async (ids: string[]) => {
      const result = await loader.loadMany(ids);
      return result.map((item, index) => {
        if (item instanceof Error) {
          console.warn("Error loading extension:", ids[index], item);
          return undefined;
        }
        return item;
      });
    },
  };
}

export type ChromeService = ReturnType<typeof createChromeService>;
