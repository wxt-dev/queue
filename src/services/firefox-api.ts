import consola from "consola";
import { buildScreenshotUrl } from "../utils/urls";
import { ExtensionStoreName } from "../enums";

export interface FirefoxApi {
  getAddon(idOrSlugOrGuid: number | string): Promise<Gql.FirefoxAddon>;
}

export function createFirefoxApi(): FirefoxApi {
  const toGqlFirefoxAddon = (res: any): Gql.FirefoxAddon => ({
    id: res.id,
    iconUrl: res.icon_url,
    lastUpdated: res.last_updated,
    longDescription: Object.values<string>(res.description)[0]!,
    name: Object.values<string>(res.name)[0]!,
    rating: res.ratings.average,
    reviewCount: res.ratings.count,
    shortDescription: Object.values<string>(res.summary)[0]!,
    storeUrl: res.url,
    version: res.current_version.version,
    users: res.average_daily_users,
    dailyActiveUsers: res.average_daily_users,
    screenshots: (res.previews as any[]).map<Gql.Screenshot>((preview, i) => ({
      index: i,
      rawUrl: preview.image_url,
      indexUrl: buildScreenshotUrl(
        ExtensionStoreName.FirefoxAddonStore,
        res.id,
        i,
      ),
    })),
  });

  const getAddon: FirefoxApi["getAddon"] = async (
    idOrSlugOrGuid: number | string,
  ): Promise<Gql.FirefoxAddon> => {
    consola.info("Fetching " + idOrSlugOrGuid);
    const url = new URL(
      `https://addons.mozilla.org/api/v5/addons/addon/${idOrSlugOrGuid}`,
    );
    const res = await fetch(url);
    if (res.status !== 200)
      throw Error(
        `${url.href} failed with status: ${res.status} ${res.statusText}`,
      );

    const json = await res.json();
    return toGqlFirefoxAddon(json);
  };

  return {
    getAddon,
  };
}
