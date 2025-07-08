import { createFirefoxApiClient } from "./firefox-api";
import { HOUR_MS } from "../time";
import { createCachedDataLoader } from "../cache";

type AddonId = string | number;

export interface FirefoxService {
  getAddon: (addonId: AddonId) => Promise<Gql.FirefoxAddon | undefined>;
  getAddons: (
    addonIds: Array<AddonId>,
  ) => Promise<Array<Gql.FirefoxAddon | undefined>>;
  getScreenshotUrl: (
    addonId: AddonId,
    screenshotIndex: number,
  ) => Promise<string | undefined>;
}

export function createFirefoxService(): FirefoxService {
  const firefox = createFirefoxApiClient();

  const loader = createCachedDataLoader<
    string | number,
    Gql.FirefoxAddon | undefined
  >(HOUR_MS, (ids) => Promise.all(ids.map((id) => firefox.getAddon(id))));

  const getAddon: FirefoxService["getAddon"] = (addonId) =>
    loader.load(addonId);

  const getAddons: FirefoxService["getAddons"] = async (addonIds) => {
    const result = await loader.loadMany(addonIds);
    return result.map((item) => {
      if (item == null) return undefined;
      if (item instanceof Error) {
        console.warn("Error fetching multiple addons:", item);
        return undefined;
      }
      return item;
    });
  };

  const getScreenshotUrl: FirefoxService["getScreenshotUrl"] = async (
    extensionId,
    screenshotIndex,
  ) => {
    const addon = await getAddon(extensionId);
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
