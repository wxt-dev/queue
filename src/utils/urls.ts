export const SERVER_ORIGIN =
  process.env.SERVER_ORIGIN ?? "http://localhost:3000";

export function buildScreenshotUrl(
  base: "chrome-extensions" | "firefox-addons",
  id: string,
  index: number,
) {
  return `${SERVER_ORIGIN}/api/rest/${base}/${id}/screenshots/${index}`;
}
