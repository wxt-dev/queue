import DataLoader from "dataloader";
import { chrome } from "../crawlers";

export function createChromeService() {
  const loader = new DataLoader<string, Gql.ChromeExtension | undefined>(
    (ids) => Promise.all(ids.map((id) => chrome.crawlExtension(id, "en")))
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
