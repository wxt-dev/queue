import { createFirefoxApiClient } from "../apis";
import { HOUR_MS } from "../utils/time";
import { createCachedDataLoader } from "../utils/cache";

export function createFirefoxService() {
  const firefox = createFirefoxApiClient();

  const loader = createCachedDataLoader<
    string | number,
    Gql.FirefoxAddon | undefined
  >(HOUR_MS, (ids) => Promise.all(ids.map((id) => firefox.getAddon(id))));

  return {
    getAddon: (id: string | number): Promise<Gql.FirefoxAddon | undefined> =>
      loader.load(id),
    getAddons: async (
      ids: Array<string | number>,
    ): Promise<Array<Gql.FirefoxAddon | undefined>> => {
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

export type FirefoxService = ReturnType<typeof createFirefoxService>;
