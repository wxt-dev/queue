import consola from "consola";
import { parseHTML } from "linkedom";

export async function crawlExtension(
  id: string,
  lang: string
): Promise<Gql.ChromeExtension | undefined> {
  consola.info("Crawling " + id);
  const url = `https://chromewebstore.google.com/detail/${id}?hl=${lang}`;
  const res = await fetch(url);
  if (res.status !== 200) return;

  const html = await res.text();
  const { document } = parseHTML(html);

  // Uncomment to debug HTML
  // consola.info(document.documentElement.outerHTML);

  const name = metaContent(document, "itemprop=name");
  const storeUrl = metaContent(document, "itemprop=url");
  const iconUrl = metaContent(document, "itemprop=image")?.replace(
    /=.+?$/,
    "=s256"
  );
  const weeklyActiveUsers = metaContent(document, "itemprop=interactionCount")
    // "UserDownloads:XYZ+"
    ?.replace("UserDownloads:", "")
    .replace(",", "")
    .replace("+", "");
  const lastUpdated = nextSpanText(document, "Updated:");
  const version = metaContent(document, "itemprop=version");
  const shortDescription = metaContent(document, "property=og:description");
  const longDescription = document
    .querySelector("div[itemprop=description]")
    ?.nextElementSibling?.textContent?.trim();

  const ratingDiv = document.querySelector(".rsw-stars");
  const rating = extractNumber(ratingDiv.title); // "Average rating: 4.78 stars"
  const reviewCount = extractNumber(ratingDiv.textContent); // "(1024)"

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
