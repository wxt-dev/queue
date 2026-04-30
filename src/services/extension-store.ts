import DataLoader from "dataloader";
import type { Cache } from "./cache";

export type ExtensionId = string | number;

export class ExtensionStore<TGqlExtension extends Gql.Extension> {
  private dataloader: DataLoader<ExtensionId, TGqlExtension>;

  constructor(
    readonly options: {
      cacheKeyPrefix: string;
      fetch: (id: ExtensionId) => Promise<TGqlExtension | undefined>;
      cache: Cache;
    },
  ) {
    this.dataloader = new DataLoader<ExtensionId, TGqlExtension>(
      async (ids): Promise<Array<TGqlExtension | Error>> => {
        const results = await Promise.allSettled(
          ids.map(async (id) => {
            const cacheKey = options.cacheKeyPrefix + id;
            const cached = await options.cache.get(cacheKey);
            if (cached) return cached;

            const result = await options.fetch(id);
            if (result) await options.cache.set(cacheKey, result);

            return result;
          }),
        );
        return results.map((res) =>
          res.status === "fulfilled" ? res.value : res.reason,
        );
      },
    );
  }

  /**
   * Get an extension by it's ID.
   */
  getExtension(extensionId: ExtensionId): Promise<TGqlExtension> {
    return this.dataloader.load(extensionId);
  }

  /**
   * Get multiple extensions by their IDs.
   */
  async getExtensions(
    extensionIds: ExtensionId[],
  ): Promise<(TGqlExtension | Error)[]> {
    return this.dataloader.loadMany(extensionIds);
  }

  /**
   * Get a screenshot given an index.
   */
  async getScreenshotUrl(
    extensionId: ExtensionId,
    screenshotIndex: number,
  ): Promise<string | undefined> {
    const extension = await this.getExtension(extensionId);
    const screenshot = extension.screenshots.find(
      (screenshot) => screenshot.index == screenshotIndex,
    );
    return screenshot?.rawUrl;
  }
}
