import DataLoader from "dataloader";

import { fetchExtensionCounter } from "../utils/metrics";
import type { Cache } from "./cache";

export type ExtensionId = string | number;

export abstract class ExtensionStore<TGqlExtension extends Gql.Extension> {
  private dataloader: DataLoader<ExtensionId, TGqlExtension>;

  constructor(
    readonly cache: Cache,
    readonly storeName: string,
    readonly cacheKeyPrefix: string,
  ) {
    this.dataloader = new DataLoader<ExtensionId, TGqlExtension>(
      async (ids): Promise<Array<TGqlExtension | Error>> => {
        const results = await Promise.allSettled(
          ids.map((id) =>
            cache.with(cacheKeyPrefix + id, async () => {
              try {
                const res = await this.fetchExtension(id);
                fetchExtensionCounter.inc({ store_name: this.storeName, result: "success" });
                return res;
              } catch (err) {
                fetchExtensionCounter.inc({ store_name: this.storeName, result: "error" });
                throw err;
              }
            }),
          ),
        );
        return results.map((res) => (res.status === "fulfilled" ? res.value : res.reason));
      },
    );
  }

  /** Get an extension by it's ID. */
  getExtension(extensionId: ExtensionId): Promise<TGqlExtension> {
    return this.dataloader.load(extensionId);
  }

  /** Get multiple extensions by their IDs. */
  async getExtensions(extensionIds: ExtensionId[]): Promise<(TGqlExtension | Error)[]> {
    return this.dataloader.loadMany(extensionIds);
  }

  /** Get a screenshot given an index. */
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

  protected abstract fetchExtension(id: ExtensionId): Promise<TGqlExtension | undefined>;
}
