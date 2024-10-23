export function buildScreenshotUrl(
  type: "chrome" | "firefox",
  id: string,
  index: number,
) {
  return `${process.env.SERVER_ORIGIN}/api/rest/${type}/${id}/screenshots/${index}`;
}
