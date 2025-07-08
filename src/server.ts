import consola from "consola";
import { createApp } from "@aklinker1/zeta";
import { corsPlugin } from "./plugins/cors-plugin";
import { graphqlRoutes } from "./routes/grpahql-routes";
import { restRoutes } from "./routes/rest-routes";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import { version } from "../package.json";

const app = createApp({
  schemaAdapter: zodSchemaAdapter,
  openApi: {
    info: {
      title: "WXT Queue API Reference",
      version,
    },
  },
})
  .onError(({ error }) => void consola.error(error))
  .use(corsPlugin)
  .use(restRoutes)
  .use(graphqlRoutes)
  .get(
    "/",
    { description: "Redirect to the GraphQL Playground" },
    ({ set }) => {
      set.status = 302;
      set.headers.Location = "/playground";
    },
  );

export default app;
export type App = typeof app;
