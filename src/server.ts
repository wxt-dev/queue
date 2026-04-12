import consola from "consola";
import { createApp } from "@aklinker1/zeta";
import { corsPlugin } from "./plugins/cors-plugin";
import { graphqlApis } from "./apis/graphql-apis";
import { extensionStoreApis } from "./apis/extension-store-apis";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import { version } from "./version";
import dedent from "dedent";
import { systemApis } from "./apis/system-apis";
import { OpenApiTag } from "./enums";

const app = createApp({
  schemaAdapter: zodSchemaAdapter,
  openApi: {
    info: {
      title: "WXT Queue API Reference",
      version,
      description: dedent`
        # Overview

        As of right now, the WXT Queue API is free to use with no authentication
        requirements.

        > [!IMPORTANT]
        > If you want to keep it this way, **be respectful of how you use it**.
        > Do not spam or abuse it.

        <br/>

        ## REST vs GraphQL

        The WXT Queue API is mostly a GraphQL API, with a few REST endpoints.
        This document covers all the REST endpoints, including the one used to
        make GraphQL requests.
      `,
    },
    tags: [
      {
        name: OpenApiTag.Graphql,
        description: dedent`
          To play around with the GraphQL API, checkout the
          [GraphiQL Playground](/playground).
        `,
      },
      { name: OpenApiTag.ExtensionStores },
      { name: OpenApiTag.System },
    ],
  },
})
  .onGlobalError(({ error }) => void consola.error(error))
  .use(corsPlugin)
  .use(systemApis)
  .use(extensionStoreApis)
  .use(graphqlApis);

export default app;
export type App = typeof app;
