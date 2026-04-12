import { createApp } from "@aklinker1/zeta";
import { z } from "zod";
import { contextPlugin } from "../plugins/context-plugin";
import { NotFoundHttpError } from "@aklinker1/zeta";
import { HttpStatus } from "@aklinker1/zeta";
import { ExtensionStoreName } from "../enums";

export const extensionStoreApis = createApp()
  .use(contextPlugin)
  .get(
    "/api/rest/:storeName/:id/screenshots/:index",
    {
      operationId: "redirectToScreenshot",
      tags: ["Chrome Extensions"],
      description:
        "Redirect to a screenshot's URL from the Chrome Web Store listing",
      params: z.object({
        storeName: z.enum(ExtensionStoreName),
        id: z.string(),
        index: z.coerce.number().int().min(0),
      }),
    },
    async ({ params, stores, set }) => {
      const screenshotUrl = await stores[params.storeName].getScreenshotUrl(
        params.id,
        params.index,
      );
      if (!screenshotUrl)
        throw new NotFoundHttpError("Extension or screenshot not found");

      set.status = HttpStatus.Found;
      set.headers["Location"] = screenshotUrl;
    },
  );
