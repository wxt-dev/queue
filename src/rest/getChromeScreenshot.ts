import type { ChromeService } from "../services/chrome-service";
import { RouteHandler } from "../utils/rest-router";

export const getChromeScreenshot =
  (chrome: ChromeService): RouteHandler<{ id: string; index: string }> =>
  async (params) => {
    const extension = await chrome.getExtension(params.id);
    const index = Number(params.index);
    const screenshot = extension?.screenshots.find(
      (screenshot) => screenshot.index == index,
    );

    if (screenshot == null) return new Response(null, { status: 404 });
    return Response.redirect(screenshot.rawUrl);
  };
