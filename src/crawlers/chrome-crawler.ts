import consola from "consola";
import { HTMLAnchorElement, HTMLElement, parseHTML } from "linkedom";

export async function crawlExtension(
  id: string,
  lang: string,
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
  const { document } = parseHTML(html);

  // Uncomment to debug HTML
  // Bun.write("chrome.html", document.documentElement.outerHTML);

  // Basic metadata
  const name = metaContent(document, "property=og:title")?.replace(
    / - Chrome Web Store$/,
    "",
  );
  const storeUrl = metaContent(document, "property=og:url");
  const iconUrl = metaContent(document, "property=og:image")?.replace(
    /=.+?$/,
    "=s256",
  );
  const shortDescription = metaContent(document, "property=og:description");

  // Grab the main sections that contain content
  const sections = (document as HTMLElement).querySelectorAll(
    "main > * > section",
  );
  const header: HTMLElement = sections[0];
  const description: HTMLElement = sections[2];
  const details: HTMLElement = sections[3];

  // Header

  // userRowCount.outerHTHML:
  // <div>
  //   <a>...</a>
  //   <a>...</a>
  //   73 users
  // </div>
  // Remove the anchors and extract "73" from the text content
  const userCountRow = header.querySelector("div:first-child > div:last-child");
  userCountRow
    .querySelectorAll("a")
    .forEach((anchor: HTMLAnchorElement) => anchor.remove());
  const weeklyActiveUsers = (userCountRow.textContent as string)
    // "XYZ+ users"
    .replace(" users", "")
    .replace(",", "")
    .replace("+", "")
    .trim();

  // ratingRow.outerHTML:
  // <span>
  //   <span>
  //     <span>5.0</span>
  //     <svg ><path /></svg>
  //     <span>(<a><p>2 ratings</p></a>)</span>
  //   </span>
  // </span>
  const ratingRow = header.querySelector(
    "div:first-child > div:nth-child(2) > span:last-child",
  );
  const rating =
    ratingRow != null
      ? extractNumber(
          ratingRow.querySelector("span:first-child > span:first-child")
            .textContent,
        )
      : 0;
  const reviewCount =
    ratingRow != null
      ? extractNumber(ratingRow.querySelector("p").textContent)
      : 0;

  // Details

  const detailItems = details.querySelectorAll("li > div:last-child");
  const version = detailItems[0].textContent.trim();
  const lastUpdated = detailItems[1].textContent.trim();

  // Description

  const longDescription = description
    .querySelector("p:last-child")
    .textContent.replaceAll("\n\n", "\n");

  // const longDescription = document
  //   .querySelector("div[itemprop=description]")
  //   ?.nextElementSibling?.textContent?.trim();
  //
  // const ratingDiv = document.querySelector(".rsw-stars");
  // const rating = extractNumber(ratingDiv.title); // "Average rating: 4.78 stars"
  // const reviewCount = extractNumber(ratingDiv.textContent); // "(1024)"

  if (name == null) return;
  if (storeUrl == null) return;
  if (iconUrl == null) return;
  if (weeklyActiveUsers == null) return;
  if (lastUpdated == null) return;
  if (version == null) return;
  if (shortDescription == null) return;
  if (longDescription == null) return;

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
  };
  consola.debug("Crawl results:", result);
  return result;
}

function metaContent(document: any, attrSelector: string): string | undefined {
  return document
    .querySelector(`meta[${attrSelector}]`)
    ?.getAttribute("content")
    .trim();
}

function nextSpanText(document: any, text: string): string | undefined {
  const spans: any[] = Array.from(document.querySelectorAll("span"));
  const span = spans.find((span: any) => span.textContent?.startsWith(text));
  return span.nextElementSibling.textContent.trim();
}

function extractNumber(text: string): number | undefined {
  const res = /([0-9\.,]+)/.exec(text)?.[1];
  if (res == null) return;

  const num = Number(res);
  if (isNaN(num)) return;

  return num;
}
