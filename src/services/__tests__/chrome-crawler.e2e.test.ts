import { describe, expect, it } from "bun:test";

import { crawlExtension } from "../chrome-crawler";

const animeSkipPlayerId = "mgmdkjcljneegjfajchedjpdhbadklcf";

describe("Chrome Web Store Crawler E2E", () => {
  it("should load and crawl an extension ID correctly", async () => {
    const res = await crawlExtension(animeSkipPlayerId, "en", true);

    expect(res).toEqual({
      iconUrl:
        "https://lh3.googleusercontent.com/lTplXRdnpEB-7DGRa_1nCKao_3aJ3C_e-GNVs9tQV9hDUXgupc1SsW6OrruxgrkSdFBSOqeia56YWgJI2IgpV1MK49s=s256",
      id: animeSkipPlayerId,
      lastUpdated: expect.any(String),
      longDescription: expect.stringContaining("Watch anime faster than ever!"),
      name: "Anime Skip Player",
      rating: expect.any(Number),
      reviewCount: expect.any(Number),
      shortDescription:
        "Custom video player for anime streaming websites. Skip intros, outros, and more.",
      storeUrl: expect.stringContaining(
        "https://chromewebstore.google.com/detail/anime-skip-player/mgmdkjcljneegjfajchedjpdhbadklcf",
      ),
      version: expect.any(String),
      users: expect.any(Number),
      weeklyActiveUsers: expect.any(Number),
      screenshots: [0, 1, 2, 3, 4].map((index) => ({
        index,
        indexUrl: `http://localhost:3000/api/rest/chrome-web-store/${animeSkipPlayerId}/screenshots/${index}`,
        rawUrl: expect.any(String),
      })),
    });
  });
});
