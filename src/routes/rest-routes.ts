import { createApp } from "@aklinker1/zeta";
import { z } from "zod/v4";
import { contextPlugin } from "../plugins/context-plugin";
import { NotFoundError } from "@aklinker1/zeta/errors";
import { Status } from "@aklinker1/zeta/status";

export const restRoutes = createApp()
  .use(contextPlugin)
  .get(
    "/api/rest/chrome-extensions/:id/screenshots/:index",
    {
      summary: "Redirect to Screenshot",
      tags: ["Chrome Extensions"],
      description:
        "Redirect to a screenshot's URL from the Chrome Web Store listing",
      params: z.object({
        id: z.string(),
        index: z.coerce.number().int().min(0),
      }),
    },
    async ({ params, chrome, set }) => {
      const screenshotUrl = await chrome.getScreenshotUrl(
        params.id,
        params.index,
      );
      if (!screenshotUrl)
        throw new NotFoundError("Extension or screenshot not found");

      set.status = Status.Found;
      set.headers["Location"] = screenshotUrl;
    },
  )
  .get(
    "/api/rest/firefox-addons/:addonId/screenshots/:index",
    {
      summary: "Redirect to Screenshot",
      tags: ["Firefox Addons"],
      description:
        "Redirect to a screenshot's URL from the Firefox Addons listing.",
      params: z.object({
        addonId: z.string(),
        index: z.coerce.number().int().min(0),
      }),
    },
    async ({ params, firefox, set }) => {
      const screenshotUrl = await firefox.getScreenshotUrl(
        params.addonId,
        params.index,
      );
      if (!screenshotUrl)
        throw new NotFoundError("Extension or screenshot not found");

      set.status = Status.Found;
      set.headers["Location"] = screenshotUrl;
    },
  );
