import { createApp } from "@aklinker1/zeta";
import { NotFoundHttpError } from "@aklinker1/zeta";
import { HttpStatus } from "@aklinker1/zeta";
import { z } from "zod";

import { OpenApiTag } from "../enums";
import { ExtensionStoreNameSchema } from "../models";
import { contextPlugin } from "../plugins/context-plugin";

export const extensionStoreApis = createApp({
  tags: [OpenApiTag.ExtensionStores],
})
  .use(contextPlugin)
  .get(
    "/api/rest/:storeName/:id/screenshots/:index",
    {
      operationId: "redirectToScreenshot",
      description: "Redirect to a screenshot's URL from the Chrome Web Store listing",
      params: z.object({
        storeName: ExtensionStoreNameSchema,
        id: z.string(),
        index: z.coerce.number().int().min(0),
      }),
    },
    async ({ params, deps, set }) => {
      const screenshotUrl = await deps.stores[params.storeName].getScreenshotUrl(
        params.id,
        params.index,
      );
      if (!screenshotUrl) throw new NotFoundHttpError("Extension or screenshot not found");

      set.status = HttpStatus.Found;
      set.headers["Location"] = screenshotUrl;
    },
  );
