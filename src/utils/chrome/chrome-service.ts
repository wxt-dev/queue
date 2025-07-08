import { crawlExtension } from "./chrome-crawler";
import { createCachedDataLoader } from "../cache";
import { HOUR_MS } from "../time";

export interface ChromeService {
  getExtension: (
    extensionId: string,
  ) => Promise<Gql.ChromeExtension | undefined>;
  getExtensions: (
    extensionIds: string[],
  ) => Promise<Array<Gql.ChromeExtension | undefined>>;
  getScreenshotUrl(
    extensionId: string,
    screenshotIndex: number,
  ): Promise<string | undefined>;
}

export function createChromeService(): ChromeService {
  const loader = createCachedDataLoader<
    string,
    Gql.ChromeExtension | undefined
  >(HOUR_MS, async (ids) => {
    const results = await Promise.allSettled(
      ids.map((id) => crawlExtension(id, "en")),
    );
    return results.map((res) =>
      res.status === "fulfilled" ? res.value : res.reason,
    );
  });

  const getExtension: ChromeService["getExtension"] = (extensionId) =>
    loader.load(extensionId);

  const getExtensions: ChromeService["getExtensions"] = async (
    extensionIds,
  ) => {
    const result = await loader.loadMany(extensionIds);
    return result.map((item, index) => {
      if (item instanceof Error) {
        console.warn("Error loading extension:", extensionIds[index], item);
        return undefined;
      }
      return item;
    });
  };

  const getScreenshotUrl: ChromeService["getScreenshotUrl"] = async (
    extensionId,
    screenshotIndex,
  ) => {
    const extension = await getExtension(extensionId);
    const screenshot = extension?.screenshots.find(
      (screenshot) => screenshot.index == screenshotIndex,
    );
    return screenshot?.rawUrl;
  };

  return {
    getExtension,
    getExtensions,
    getScreenshotUrl,
  };
}
