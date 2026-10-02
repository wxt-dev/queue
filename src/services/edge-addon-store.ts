import type { Cache } from "./cache";
import type { EdgeApi } from "./edge-api";
import { ExtensionStore } from "./extension-store";

export class EdgeAddonStore extends ExtensionStore<Gql.EdgeAddon> {
  constructor(deps: { cache: Cache; edgeApi: EdgeApi }) {
    super(deps.cache, "edge-addon-v2-", (id) => deps.edgeApi.getAddon(String(id)));
  }
}
