export const SERVER_ORIGIN =
  process.env.SERVER_ORIGIN ?? "http://localhost:3000";

export function buildScreenshotUrl(
  type: "chrome" | "firefox",
  id: string,
  index: number,
) {
  return `${SERVER_ORIGIN}/api/rest/${type}/${id}/screenshots/${index}`;
}
