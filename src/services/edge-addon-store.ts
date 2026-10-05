import type { Cache } from "./cache";
import type { EdgeApi } from "./edge-api";
import { ExtensionStore, type ExtensionId } from "./extension-store";

export class EdgeAddonStore extends ExtensionStore<Gql.EdgeAddon> {
  constructor(private deps: { cache: Cache; edgeApi: EdgeApi }) {
    super(deps.cache, "edge-addon-store", "edge-addon-v2-");
  }

  protected fetchExtension(id: ExtensionId): Promise<Gql.EdgeAddon | undefined> {
    return this.deps.edgeApi.getAddon(String(id));
  }
}
