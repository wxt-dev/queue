import { createApp } from "@aklinker1/zeta";
import PLAYGROUND_HTML_TEMPLATE from "../assets/playground.html.tmpl" with { type: "text" };
import { version } from "../../package.json";
import { createGraphql } from "../graphql";
import { z } from "zod/v4";

const PLAYGROUND_HTML = PLAYGROUND_HTML_TEMPLATE.replace(
  "{{VERSION}}",
  version,
);

const graphql = createGraphql();

export const graphqlRoutes = createApp()
  .post(
    "/api",
    {
      summary: "Send Query",
      tags: ["GraphQL"],
      description:
        "Send a query to the GraphQL API. You can play around with queries on the [GraphiQL playground](/playground).",
      body: z
        .object({
          query: z.string(),
          variables: z.record(z.string(), z.any()).optional(),
          operationName: z.string().optional(),
        })
        .meta({
          example: {
            query: `query GetExtension($id: String!) {
  chromeExtension(id: $id) {
    id
    screenshots { rawUrl }
  }
}`,
            variables: {
              id: "ocfdgncpifmegplaglcnglhioflaimkd",
            },
            operationName: "GetExtension",
          },
        }),
      response: z
        .object({
          data: z.any(),
        })
        .meta({
          example: {
            data: {
              chromeExtension: {
                id: "ocfdgncpifmegplaglcnglhioflaimkd",
                screenshots: [
                  {
                    rawUrl:
                      "https://lh3.googleusercontent.com/GUgh0ThX2FDPNvbaumYl4DqsUhsbYiCe-Hut9FoVEnkmTrXyA-sHbMk5jmZTj_t-dDP8rAmy6X6a6GNTCn9F8zo4VYU=s1280",
                  },
                  {
                    rawUrl:
                      "https://lh3.googleusercontent.com/qRi-kO0il8W6CnWa_-7oFzCwWKwr73w607I-rpYF9MM27omsuoN0k4dkgBbBECD3vZszdTSkQnoW9sywsfvAQ_7M9Q=s1280",
                  },
                ],
              },
            },
          },
        }),
    },
    ({ request, body }) => graphql.evaluateQuery(request.method, body),
  )
  .get(
    "/playground",
    {
      summary: "Playground",
      tags: ["GraphQL"],
      description:
        "Open the GraphiQL playground. This is where you can interact and test out the GraphQL API. It also contains the GraphQL documentation explorer.",
      response: z.string().meta({ contentType: "text/html" }),
    },
    ({ set }) => {
      set.headers["Content-Type"] = "text/html; charset=utf-8";
      return PLAYGROUND_HTML;
    },
  );
