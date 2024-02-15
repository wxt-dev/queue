import { describe, expect, it } from "bun:test";
import { crawlExtension } from "../chrome-crawler";

const githubBetterLineCountsId = "ocfdgncpifmegplaglcnglhioflaimkd";

describe("Chrome Web Store Crawler", () => {
  it("should load and crawl an extension ID correctly", async () => {
    const res = await crawlExtension(githubBetterLineCountsId, "en");

    expect(res).toMatchSnapshot();
  });
});
