import { buildScreenshotUrl } from "../urls";

export interface EdgeApi {
  getAddon(crxid: string): Promise<Gql.EdgeAddon>;
}

export function createEdgeApi(): EdgeApi {
  const toGqlEdgeAddon = (
    res: GetProductDetailsByCrxId200Response,
  ): Gql.EdgeAddon => ({
    id: res.crxId,
    iconUrl: `https:${res.logoUrl}`, // URL without the schema (ex: "//store-images.s-microsoft.com/image/...")
    lastUpdated: new Date(res.lastUpdateDate * 1000).toISOString(),
    longDescription: res.description,
    shortDescription: res.shortDescription,
    name: res.name,
    rating: res.averageRating,
    reviewCount: res.ratingCount,
    version: res.version,
    users: res.activeInstallCount,
    activeInstallCount: res.activeInstallCount,
    storeUrl: `https://microsoftedge.microsoft.com/addons/detail/${res.crxId}`,
    screenshots: res.screenshots.map((ss, i) => ({
      index: i,
      indexUrl: buildScreenshotUrl("edge-addons", res.crxId, i),
      rawUrl: `https:${ss.uri}`, // URL without the schema (ex: "//store-images.s-microsoft.com/image/...")
    })),
  });

  const getAddon: EdgeApi["getAddon"] = async (crxid) => {
    const res = await fetch(
      `https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/${crxid}`,
    );
    if (res.status !== 200) {
      throw Error("Edge API request failed", { cause: res });
    }

    const json = (await res.json()) as GetProductDetailsByCrxId200Response;

    return toGqlEdgeAddon(json);
  };

  return {
    getAddon,
  };
}

type GetProductDetailsByCrxId200Response = {
  availability: string[];
  activeInstallCount: number;
  storeProductId: string;
  name: string;
  logoUrl: string;
  thumbnailUrl: string;
  description: string;
  developer: string;
  category: string;
  isInstalled: boolean;
  crxId: string;
  manifest: string;
  isHavingMatureContent: boolean;
  version: string;
  lastUpdateDate: number;
  privacyUrl: string;
  availabilityId: string;
  skuId: string;
  locale: string;
  market: string;
  averageRating: number;
  ratingCount: number;
  availableLanguages: string[];
  metadata: {
    publisherId: string;
  };
  shortDescription: string;
  searchKeywords: string;
  screenshots: Array<{
    caption: string;
    imagePurpose: string;
    uri: string;
  }>;
  videos: unknown[];
  largePromotionImage: {
    caption: string;
    imagePurpose: string;
    uri: string;
  };
  publisherWebsiteUri: string;
  isBadgedAsFeatured: boolean;
  privacyData: {
    privacyPolicyRequired: boolean;
  };
};
