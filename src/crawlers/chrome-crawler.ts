import consola from "consola";
import { HTMLAnchorElement, HTMLElement, parseHTML } from "linkedom";
import { buildScreenshotUrl } from "../utils/urls";

export async function crawlExtension(
  id: string,
  lang: string,
  canGenerateTestFixture = false,
): Promise<Gql.ChromeExtension | undefined> {
  consola.info("Crawling " + id);
  const url = `https://chromewebstore.google.com/detail/${id}?hl=${lang}`;
  const res = await fetch(url, {
    headers: {
      // Without a user agent, the request is stuck in a 302 redirect loop
      "User-Agent":
        // Firefox:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0",
    },
  });
  if (res.status !== 200) return;

  const html = await res.text();
  if (!canGenerateTestFixture) {
    // Uncomment to debug HTML or generate new test fixture
    // const date = new Date();
    // const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    // Bun.write(
    //   `src/crawlers/__tests__/fixtures/chrome-web-store/.new/${dateString}-${id}.html`,
    //   html,
    // );
  }

  const parsed = parseHTML(html);
  const document = parsed.document as HTMLElement;

  if (document.querySelector("section") == null) {
    // Extension is unavailable, ID no longer exists
    return undefined;
  }

  const name = tryExtract("name", validateNonEmptyString, [
    () =>
      metaContent(document, "property=og:title")?.replace(
        / - Chrome Web Store$/,
        "",
      ),
  ]);
  const storeUrl = tryExtract("storeUrl", validateNonEmptyString, [
    () => metaContent(document, "property=og:url"),
  ]);
  const iconUrl = tryExtract("iconUrl", validateNonEmptyString, [
    () => metaContent(document, "property=og:image")?.replace(/=.+?$/, "=s256"),
  ]);
  const shortDescription = tryExtract(
    "shortDescription",
    validateNonEmptyString,
    [() => metaContent(document, "property=og:description")],
  );

  // Header

  const weeklyActiveUsers = tryExtract("weeklyActiveUsers", validateInt, [
    () => {
      const userCountRow = document.querySelector(
        "main > * > section:first-child > section > div > div:last-child",
      ) as HTMLElement | null;
      removeAnchorChildren(userCountRow);
      return (
        userCountRow?.textContent
          // "W,XYZ+ users"
          ?.replace(" users", "")
          .replaceAll(",", "")
          .replace("+", "")
      );
    },
  ]);

  const rating = tryExtract("rating", validateFloat, [
    () =>
      document.querySelector(
        "main > * > section:first-child > section > div > div:nth-child(2) > span > span > span",
      )?.textContent,
    () =>
      document.querySelector("body").textContent.includes("No ratings")
        ? 0
        : undefined,
  ]);

  const reviewCount = tryExtract("reviewCount", validateInt, [
    () =>
      document
        .querySelector(
          "main > * > section:first-child > section > div > div:nth-child(2) > span > span > span:last-child > a",
        )
        ?.textContent?.replace(" ratings", ""),
    () =>
      document.querySelector("body").textContent.includes("No ratings")
        ? 0
        : undefined,
  ]);

  const version = tryExtract("version", validateNonEmptyString, [
    () => {
      const listItems = [
        ...document.querySelectorAll("main > * > section:nth-child(5) li"),
      ];
      const li = listItems.find((item) => item.textContent.includes("Version"));
      return li?.querySelector(":scope > *:last-child")?.textContent;
    },
  ]);

  const lastUpdated = tryExtract("lastUpdated", validateNonEmptyString, [
    () => {
      const listItems = [
        ...document.querySelectorAll("main > * > section:nth-child(5) li"),
      ];
      const li = listItems.find((item) => item.textContent.includes("Updated"));
      return li?.querySelector(":scope > *:last-child")?.textContent;
    },
  ]);

  const longDescription = tryExtract(
    "longDescription",
    validateNonEmptyString,
    [
      () =>
        document
          .querySelector("main > * > section:nth-child(3) p:last-child")
          ?.textContent?.replaceAll("\n\n", "\n"),
    ],
  );

  const screenshots = tryExtract("screenshots", validateGqlScreenshots, [
    () =>
      [...document.querySelectorAll("div[data-media-url]")]
        .filter((div) => div.getAttribute("data-is-video") === "false")
        .map<Gql.Screenshot>((div) => {
          const index = parseInt(div.getAttribute("data-slide-index"));
          return {
            index,
            rawUrl: div.getAttribute("data-media-url") + "=s1280", // "s1280" gets the full resolution
            indexUrl: buildScreenshotUrl("chrome-extensions", id, index),
          };
        }),
  ]);

  const result: Gql.ChromeExtension = {
    id,
    name,
    iconUrl,
    storeUrl,
    weeklyActiveUsers: Number(weeklyActiveUsers),
    lastUpdated,
    version,
    shortDescription,
    longDescription,
    rating,
    reviewCount,
    screenshots,
  };
  consola.debug("Crawl results:", result);
  return result;
}

function metaContent(
  document: HTMLElement,
  attrSelector: string,
): string | undefined {
  return document
    .querySelector(`meta[${attrSelector}]`)
    ?.getAttribute("content")
    .trim();
}

/** Try each of the different functions, collecting errors, and return the first value that can be parsed correctly. If no options succeed, return an error containing all the errors in it's cause. */
function tryExtract<T>(
  field: string,
  validate: (value: any) => T,
  extractors: (() => any)[],
): T {
  const errors: Error[] = [];
  for (const extract of extractors) {
    try {
      const result = extract();
      return validate(result);
    } catch (error) {
      errors.push(error as Error);
    }
  }
  errors.forEach((err) => console.error(err));
  throw new Error(`Could not extract "${field}" from HTML`, { cause: errors });
}

function validateInt(value: any): number {
  const int = parseInt(value);
  if (isNaN(int)) throw Error(`"${value}" was not an integer`);
  return int;
}

function validateFloat(value: any): number {
  const float = parseFloat(value);
  if (isNaN(float)) throw Error(`"${value}" was not an float`);
  return float;
}

function validateNonEmptyString(value: any): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`"${value}" was not a non-empty string`);
  }
  return value.trim();
}

function validateGqlScreenshots(value: any): Gql.Screenshot[] {
  if (!Array.isArray(value)) {
    throw new Error(`Screenshots must be an array`);
  }
  if (value.length === 0) {
    throw new Error(`Screenshots array cannot be empty`);
  }
  return value.map((screenshot: any) => {
    if (typeof screenshot !== "object" || screenshot === null) {
      throw new Error(`Each screenshot must be an object`);
    }
    const index = validateInt(screenshot.index);
    if (index < 0) throw Error("Screenshot index missing");
    const rawUrl = validateNonEmptyString(screenshot.rawUrl);
    const indexUrl = validateNonEmptyString(screenshot.indexUrl);
    return {
      index,
      rawUrl,
      indexUrl,
    };
  });
}

function removeAnchorChildren(element: HTMLElement | null | undefined): void {
  element
    ?.querySelectorAll("a")
    .forEach((anchor: HTMLAnchorElement) => anchor.remove());
}
