import { createEdgeApi } from "./edge-api";
import { defineExtensionStore, type ExtensionStore } from "./extension-store";

export type EdgeAddonStore = ExtensionStore<Gql.EdgeAddon>;

export function createEdgeAddonStore() {
  const api = createEdgeApi();

  return defineExtensionStore((id) => api.getAddon(String(id)));
}
