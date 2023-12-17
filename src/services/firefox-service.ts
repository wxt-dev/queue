import { createFirefoxApiClient } from "../apis";
import { DAY_MS } from "../utils/time";
import { createCachedDataLoader } from "../utils/cache";

export function createFirefoxService() {
  const firefox = createFirefoxApiClient();

  const loader = createCachedDataLoader<
    string | number,
    Gql.FirefoxAddon | undefined
  >(DAY_MS, (ids) => Promise.all(ids.map((id) => firefox.getAddon(id))));

  return {
    getAddon: (id: string | number) => loader.load(id),
    getAddons: async (ids: Array<string | number>) => {
      const result = await loader.loadMany(ids);
      return result.map((item) => {
        if (item == null) return undefined;
        if (item instanceof Error) {
          console.warn("Error fetching multiple addons:", item);
          return undefined;
        }
        return item;
      });
    },
  };
}
