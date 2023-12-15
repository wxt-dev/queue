import DataLoader from "dataloader";
import { createFirefoxApiClient } from "../apis";

export function createFirefoxService() {
  const firefox = createFirefoxApiClient();

  const loader = new DataLoader<string | number, Gql.FirefoxAddon | undefined>(
    (ids) => Promise.all(ids.map((id) => firefox.getAddon(id)))
  );

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
