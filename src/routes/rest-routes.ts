import { createApp } from "@aklinker1/zeta";
import { z } from "zod";
import { contextPlugin } from "../plugins/context-plugin";
import { NotFoundHttpError } from "@aklinker1/zeta";
import { HttpStatus } from "@aklinker1/zeta";

export const restRoutes = createApp()
  .use(contextPlugin)
  .get(
    "/api/rest/chrome-extensions/:id/screenshots/:index",
    {
      operationId: "chromeScreenshotRedirect",
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
        throw new NotFoundHttpError("Extension or screenshot not found");

      set.status = HttpStatus.Found;
      set.headers["Location"] = screenshotUrl;
    },
  )
  .get(
    "/api/rest/firefox-addons/:addonId/screenshots/:index",
    {
      operationId: "firefoxScreenshotRedirect",
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
        throw new NotFoundHttpError("Extension or screenshot not found");

      set.status = HttpStatus.Found;
      set.headers["Location"] = screenshotUrl;
    },
  )
  .get(
    "/api/rest/edge-addons/:addonId/screenshots/:index",
    {
      operationId: "edgeScreenshotRedirect",
      tags: ["Firefox Addons"],
      description:
        "Redirect to a screenshot's URL from the Edge Addons listing.",
      params: z.object({
        addonId: z.string(),
        index: z.coerce.number().int().min(0),
      }),
    },
    async ({ params, edge, set }) => {
      const screenshotUrl = await edge.getScreenshotUrl(
        params.addonId,
        params.index,
      );
      if (!screenshotUrl)
        throw new NotFoundHttpError("Extension or screenshot not found");

      set.status = HttpStatus.Found;
      set.headers["Location"] = screenshotUrl;
    },
  );
