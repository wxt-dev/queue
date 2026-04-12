import { createCachedDataLoader } from "../utils/cache";
import { HOUR_MS } from "../utils/time";

export type ExtensionId = string | number;

export interface ExtensionStore<TGqlExtension extends Gql.Extension> {
  /**
   * Get an extension by it's ID.
   */
  getExtension: (
    extensionId: ExtensionId,
  ) => Promise<TGqlExtension | undefined>;

  /**
   * Get multiple extensions by their IDs.
   */
  getExtensions: (
    extensionIds: ExtensionId[],
  ) => Promise<(TGqlExtension | undefined)[]>;

  /**
   * Get a screenshot given an index.
   */
  getScreenshotUrl(
    extensionId: ExtensionId,
    screenshotIndex: number,
  ): Promise<string | undefined>;
}

export function defineExtensionStore<TGqlExtension extends Gql.Extension>(
  fetch: (id: ExtensionId) => Promise<TGqlExtension | undefined>,
): ExtensionStore<TGqlExtension> {
  const loader = createCachedDataLoader<ExtensionId, TGqlExtension | undefined>(
    HOUR_MS,
    async (ids) => {
      const results = await Promise.allSettled(ids.map((id) => fetch(id)));
      return results.map((res) =>
        res.status === "fulfilled" ? res.value : undefined,
      );
    },
  );

  const getExtension: ExtensionStore<TGqlExtension>["getExtension"] = (
    extensionId,
  ) => loader.load(extensionId);

  const getExtensions: ExtensionStore<TGqlExtension>["getExtensions"] = async (
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

  const getScreenshotUrl: ExtensionStore<TGqlExtension>["getScreenshotUrl"] =
    async (extensionId, screenshotIndex) => {
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
