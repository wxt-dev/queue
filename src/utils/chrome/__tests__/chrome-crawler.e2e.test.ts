import { describe, expect, it } from "bun:test";
import { crawlExtension } from "../chrome-crawler";

const githubBetterLineCountsId = "ocfdgncpifmegplaglcnglhioflaimkd";

describe("Chrome Web Store Crawler E2E", () => {
  it("should load and crawl an extension ID correctly", async () => {
    const res = await crawlExtension(githubBetterLineCountsId, "en", true);

    expect(res).toEqual({
      iconUrl:
        "https://lh3.googleusercontent.com/GcffNyCJaxT2G9dsQCJHhUEMlu_E0vEzph5cLPrQj7UHKat7QyCzGu69Dmp_DDUL8rY-bPMFJceQarS1wcqdwTalTg=s256",
      id: githubBetterLineCountsId,
      lastUpdated: expect.any(String),
      longDescription: expect.stringContaining("Isn't it annoying when you"),
      name: "GitHub Better Line Counts",
      rating: expect.any(Number),
      reviewCount: expect.any(Number),
      shortDescription: "Remove generated files from GitHub line counts",
      storeUrl: expect.stringContaining(
        "https://chromewebstore.google.com/detail/github-better-line-counts/ocfdgncpifmegplaglcnglhioflaimkd",
      ),
      version: expect.any(String),
      weeklyActiveUsers: expect.any(Number),
      screenshots: [
        {
          index: 0,
          indexUrl:
            "http://localhost:3000/api/rest/chrome-extensions/ocfdgncpifmegplaglcnglhioflaimkd/screenshots/0",
          rawUrl: expect.any(String),
        },
        {
          index: 1,
          indexUrl:
            "http://localhost:3000/api/rest/chrome-extensions/ocfdgncpifmegplaglcnglhioflaimkd/screenshots/1",
          rawUrl: expect.any(String),
        },
      ],
    });
  });
});
