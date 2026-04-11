import { createCachedDataLoader } from "../cache";
import { HOUR_MS } from "../time";
import { createEdgeApi } from "./edge-api";

export interface EdgeService {
  getAddon: (id: string) => Promise<Gql.EdgeAddon | undefined>;
  getAddons: (ids: string[]) => Promise<Array<Gql.EdgeAddon | undefined>>;
  getScreenshotUrl: (
    addonId: string,
    screenshotIndex: number,
  ) => Promise<string | undefined>;
}

export function createEdgeService(): EdgeService {
  const api = createEdgeApi();

  const loader = createCachedDataLoader<string, Gql.EdgeAddon | undefined>(
    HOUR_MS,
    (ids) => Promise.all(ids.map((id) => api.getAddon(id))),
  );

  const getAddon: EdgeService["getAddon"] = (id) => loader.load(id);

  const getAddons: EdgeService["getAddons"] = async (ids) => {
    const result = await loader.loadMany(ids);
    return result.map((item) => {
      if (item == null) return undefined;
      if (item instanceof Error) {
        console.warn("Error fetching multiple addons:", item);
        return undefined;
      }
      return item;
    });
  };

  const getScreenshotUrl: EdgeService["getScreenshotUrl"] = async (
    addonId,
    screenshotIndex,
  ) => {
    const addon = await getAddon(addonId);
    const screenshot = addon?.screenshots.find(
      (screenshot) => screenshot.index == screenshotIndex,
    );
    return screenshot?.rawUrl;
  };

  return {
    getAddon,
    getAddons,
    getScreenshotUrl,
  };
}
