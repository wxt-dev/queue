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
