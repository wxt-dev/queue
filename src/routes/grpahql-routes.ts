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
      body: z.object({
        query: z.string(),
        variables: z.record(z.string(), z.any()).optional(),
        operationName: z.string().optional(),
      }),
      response: z.any(),
    },
    ({ request, body }) => graphql.evaluateQuery(request.method, body),
  )
  .get("/playground", ({ set }) => {
    set.headers["Content-Type"] = "text/html; charset=utf-8";
    return PLAYGROUND_HTML;
  });
