import { createApp } from "@aklinker1/zeta";
import { z } from "zod/v4";
import { contextPlugin } from "../plugins/context-plugin";
import { NotFoundError } from "@aklinker1/zeta/errors";
import { Status } from "@aklinker1/zeta/status";

export const restRoutes = createApp()
  .use(contextPlugin)
  .get(
    "/api/rest/chrome-extensions/:extensionId/screenshots/:screenshotIndex",
    {
      params: z.object({
        extensionId: z.string(),
        screenshotIndex: z.coerce.number().int().min(0),
      }),
    },
    async ({ params, chrome, set }) => {
      const screenshotUrl = await chrome.getScreenshotUrl(
        params.extensionId,
        params.screenshotIndex,
      );
      if (!screenshotUrl)
        throw new NotFoundError("Extension or screenshot not found");

      set.status = Status.Found;
      set.headers["Location"] = screenshotUrl;
    },
  )
  .get(
    "/api/rest/firefox-addons/:addonId/screenshots/:screenshotIndex",
    {
      params: z.object({
        addonId: z.string(),
        screenshotIndex: z.coerce.number().int().min(0),
      }),
    },
    async ({ params, firefox, set }) => {
      const screenshotUrl = await firefox.getScreenshotUrl(
        params.addonId,
        params.screenshotIndex,
      );
      if (!screenshotUrl)
        throw new NotFoundError("Extension or screenshot not found");

      set.status = Status.Found;
      set.headers["Location"] = screenshotUrl;
    },
  );
