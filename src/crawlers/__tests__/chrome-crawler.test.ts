import { beforeEach, describe, expect, it, mock } from "bun:test";
import { crawlExtension } from "../chrome-crawler";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const fetchMock = mock<typeof fetch>(() => {
  throw Error("Not mocked");
});
globalThis.fetch = fetchMock;

describe("Chrome Web Store Crawler", async () => {
  const fixturesDir = join(import.meta.dir, "fixtures/chrome-web-store");
  const testFiles = (await readdir(fixturesDir))
    .filter((file) => !file.startsWith("."))
    .toSorted();
  const getExtensionIdFromFile = (file: string) =>
    file.match(/.*-([a-z]+)\.html/)![1];

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it.each(testFiles)(
    "should extract extension details from %s",
    async (file) => {
      const id = getExtensionIdFromFile(file);
      globalThis.fetch = mock(() =>
        Promise.resolve(new Response(Bun.file(join(fixturesDir, file)))),
      );
      const res = await crawlExtension(id, "en", true);
      expect(res).toMatchSnapshot();
    },
  );
});
