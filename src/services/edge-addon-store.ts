import type { Cache } from "./cache";
import type { EdgeApi } from "./edge-api";
import { ExtensionStore } from "./extension-store";

export type EdgeAddonStore = ExtensionStore<Gql.EdgeAddon>;

export function createEdgeAddonStore({
  cache,
  edgeApi,
}: {
  cache: Cache;
  edgeApi: EdgeApi;
}): EdgeAddonStore {
  return new ExtensionStore({
    fetch: (id) => edgeApi.getAddon(String(id)),
    cacheKeyPrefix: "edge-addon-",
    cache,
  });
}
