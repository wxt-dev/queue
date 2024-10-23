import consola from "consola";
import { buildScreenshotUrl } from "../utils/urls";

export function createFirefoxApiClient() {
  return {
    getAddon: async (
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

      return {
        id: json.id,
        iconUrl: json.icon_url,
        lastUpdated: json.last_updated,
        longDescription: Object.values<string>(json.description)[0],
        name: Object.values<string>(json.name)[0],
        rating: json.ratings.average,
        reviewCount: json.ratings.count,
        shortDescription: Object.values<string>(json.summary)[0],
        storeUrl: json.url,
        version: json.current_version.version,
        dailyActiveUsers: json.average_daily_users,
        screenshots: (json.previews as any[]).map<Gql.Screenshot>(
          (preview, i) => ({
            index: i,
            rawUrl: preview.image_url,
            indexUrl: buildScreenshotUrl("firefox", json.id, i),
          }),
        ),
      };
    },
  };
}
