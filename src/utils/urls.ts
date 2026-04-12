import type { ExtensionStoreName } from "../enums";

export const SERVER_ORIGIN =
  process.env.SERVER_ORIGIN ?? "http://localhost:3000";

export function buildScreenshotUrl(
  storeName: ExtensionStoreName,
  id: string,
  index: number,
) {
  return `${SERVER_ORIGIN}/api/rest/${storeName}/${id}/screenshots/${index}`;
}
