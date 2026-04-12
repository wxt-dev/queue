import { createApp } from "@aklinker1/zeta";
import z from "zod";
import { version } from "../version";

export const systemApis = createApp({
  tags: ["System"],
})
  .get(
    "/",
    {
      operationId: "apiDocsRedirect",
      summary: "API Docs Redirect",
      description: "Redirect to the API reference when visiting the root URL.",
    },
    ({ set }) => {
      set.status = 302;
      set.headers.Location = "/scalar";
    },
  )
  .get(
    "/api/health",
    {
      operationId: "healthCheck",
      description: "Used to make sure the API is up and running.",
      responses: z.object({
        status: z.literal("ok"),
        version: z.string(),
      }),
    },
    () => ({ status: "ok" as const, version }),
  );
