import { buildScreenshotUrl } from "../utils/urls";
import { ExtensionStoreName } from "../enums";
import { createLogger } from "@aklinker1/logger";
import { FetchError } from "../utils/errors";

const logger = createLogger("firefox-api");

export interface FirefoxApi {
  getAddon(idOrSlugOrGuid: number | string): Promise<Gql.FirefoxAddon>;
}

export function createFirefoxApi(): FirefoxApi {
  const toGqlFirefoxAddon = (res: GetAddon200Response): Gql.FirefoxAddon => ({
    id: String(res.id),
    slug: res.slug,
    guid: res.guid,
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
        String(res.id),
        i,
      ),
    })),
  });

  const getAddon: FirefoxApi["getAddon"] = async (
    idOrSlugOrGuid: number | string,
  ): Promise<Gql.FirefoxAddon> => {
    logger.info("Get addon", { idOrSlugOrGuid });
    const url = new URL(
      `https://addons.mozilla.org/api/v5/addons/addon/${idOrSlugOrGuid}`,
    );
    const res = await fetch(url);
    if (res.status !== 200) throw new FetchError(res, await res.text());

    const json = (await res.json()) as GetAddon200Response;
    logger.debug("Addon result", { idOrSlugOrGuid, json });

    return toGqlFirefoxAddon(json);
  };

  return {
    getAddon,
  };
}

type GetAddon200Response = {
  id: number;
  authors: Array<{
    id: number;
    name: string;
    url: string;
    username: string;
    picture_url: string;
  }>;
  average_daily_users: number;
  categories: string[];
  contributions_url: {
    url: string;
    outgoing: string;
  };
  created: string;
  current_version: {
    id: number;
    compatibility: {
      firefox: unknown;
    };
    edit_url: string;
    file: {
      id: number;
      created: string;
      hash: string;
      is_mozilla_signed_extension: boolean;
      size: number;
      status: string;
      url: string;
      permissions: string[];
      optional_permissions: string[];
      host_permissions: string[];
      data_collection_permissions: string[];
      optional_data_collection_permissions: string[];
    };
    is_strict_compatibility_enabled: boolean;
    license: {
      id: number;
      is_custom: boolean;
      name: unknown;
      slug: string;
      url: string;
    };
    release_notes: {
      [locale: string]: string;
    };
    reviewed: string;
    version: string;
  };
  default_locale: string;
  description: {
    [locale: string]: string;
  };
  developer_comments: string | null;
  edit_url: string;
  guid: string;
  has_eula: boolean;
  has_privacy_policy: boolean;
  homepage: {
    url: {
      [locale: string]: string;
    };
    outgoing: {
      [locale: string]: string;
    };
  };
  icon_url: string;
  icons: {
    [size: string]: string;
  };
  is_disabled: boolean;
  is_experimental: boolean;
  is_noindexed: boolean;
  last_updated: string;
  name: {
    [locale: string]: string;
  };
  previews: Array<{
    id: number;
    caption: unknown;
    image_size: [number, number];
    image_url: string;
    position: number;
    thumbnail_size: [number, number];
    thumbnail_url: string;
  }>;
  promoted: unknown[];
  ratings: {
    average: number;
    bayesian_average: number;
    count: number;
    text_count: number;
  };
  ratings_url: string;
  requires_payment: boolean;
  review_url: string;
  slug: string;
  status: string;
  summary: {
    [locale: string]: string;
  };
  support_email: {
    [locale: string]: string;
  };
  support_url: {
    url: {
      [locale: string]: string;
    };
    outgoing: {
      [locale: string]: string;
    };
  };
  tags: string[];
  type: string;
  url: string;
  versions_url: string;
  weekly_downloads: number;
};
