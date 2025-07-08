// To add a extension to this test:
//
// 1. Uncomment this code inside `src/crawlers/chrome-crawler.ts`:
//    https://github.com/wxt-dev/queue/blob/2c538514080e2c787d47cae9f70e9e948fdcbd8b/src/crawlers/chrome-crawler.ts#L25-L30
// 2. Run server in dev mode and use the `chromeExtension` query to get the
//    extension's details
// 3. After that query, regardless of if it succeeded or not, a new HTML file
//    will be added to `src/crawlers/__tests__/fixtures/chrome-web-store/.new`
// 4. Move the HTML file up one folder so it's next to the other test fixtures
// 5. You're done! The test is added, run `bun test`.
//
import { afterAll, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { crawlExtension } from "../chrome-crawler";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const fetchSpy = spyOn(globalThis, "fetch");

describe("Chrome Web Store Crawler", async () => {
  const fixturesDir = join(import.meta.dir, "fixtures/chrome-web-store");
  const testFiles = (await readdir(fixturesDir))
    .filter((file) => !file.startsWith("."))
    .toSorted();
  const getExtensionIdFromFile = (file: string): string =>
    file.match(/.*-([a-z]+)\.html/)![1]!;

  beforeEach(() => {
    fetchSpy.mockReset();
  });

  afterAll(() => {
    fetchSpy.mockRestore();
  });

  it.each(testFiles)(
    "should extract extension details from %s",
    async (file) => {
      const id = getExtensionIdFromFile(file);
      fetchSpy.mockResolvedValueOnce(
        new Response(Bun.file(join(fixturesDir, file))),
      );
      const res = await crawlExtension(id, "en", true);
      expect(res).toMatchSnapshot();
    },
  );
});
