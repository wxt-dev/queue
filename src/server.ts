import consola from "consola";
import { createApp } from "@aklinker1/zeta";
import { corsPlugin } from "./plugins/cors-plugin";
import { graphqlRoutes } from "./routes/grpahql-routes";
import { restRoutes } from "./routes/rest-routes";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import { version } from "../package.json";
import { z } from "zod/v4";
import API_REFERENCE_DESCRIPTION from "./assets/api-reference-description.md" with { type: "text" };
import GRAPHQL_DESCRIPTION from "./assets/graphql-description.md" with { type: "text" };

const app = createApp({
  schemaAdapter: zodSchemaAdapter,
  openApi: {
    info: {
      title: "WXT Queue API Reference",
      version,
      description: API_REFERENCE_DESCRIPTION,
    },
    tags: [
      { name: "GraphQL", description: GRAPHQL_DESCRIPTION },
      { name: "Chrome Extensions" },
      { name: "Firefox Addons" },
      { name: "System" },
    ],
  },
})
  .onError(({ error }) => void consola.error(error))
  .use(corsPlugin)
  .use(restRoutes)
  .use(graphqlRoutes)
  .get(
    "/",
    {
      summary: "API Docs Redirect",
      tags: ["System"],
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
      summary: "Health Check",
      tags: ["System"],
      description: "Used to make sure the API is up and running.",
      response: z.object({
        status: z.literal("ok"),
        version: z.string(),
      }),
    },
    () => ({ status: "ok" as const, version }),
  );

export default app;
export type App = typeof app;
