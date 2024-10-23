import type { FirefoxService } from "../services/firefox-service";
import { RouteHandler } from "../utils/rest-router";

export const getFirefoxScreenshot =
  (firefox: FirefoxService): RouteHandler<{ id: string; index: string }> =>
  async (params) => {
    const addon = await firefox.getAddon(params.id);
    const index = Number(params.index);
    const screenshot = addon?.screenshots.find(
      (screenshot) => screenshot.index == index,
    );

    if (screenshot == null) return new Response(null, { status: 404 });
    return Response.redirect(screenshot.rawUrl);
  };
