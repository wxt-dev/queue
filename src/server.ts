import pc from "picocolors";
import pkg from "../package.json";
import { evaluateQuery } from "./graphql";
import playgroundHtml from "./public/playground.html";
import consola from "consola";

export function createServer(config?: ServerConfig) {
  let port = config?.port;
  if (port == null) port = Number(process.env.PORT ?? "3000");

  consola.info(
    `${pc.cyan("store-api v" + pkg.version)} ${pc.dim("server started")}`
  );
  consola.log(`  ${pc.bold(pc.green("➜"))} http://localhost:${port}`);
  console.log();

  const httpServer = Bun.serve({
    port,
    error(request) {
      consola.error(request);
    },
    async fetch(req) {
      // GraphQL
      if (req.url.endsWith("/api")) {
        const res = await evaluateQuery(req);
        return new Response(JSON.stringify(res), {
          headers: {
            "content-type": "application/json",
          },
        });
      }

      // GraphiQL
      if (req.url.endsWith("/playground"))
        return new Response(
          playgroundHtml.replace("{{VERSION}}", pkg.version),
          {
            headers: {
              "content-type": "text/html",
            },
          }
        );

      // Redirect to GraphiQL
      return new Response(undefined, {
        status: 302,
        headers: {
          location: "/playground",
        },
      });
    },
  });

  return {
    httpServer,
    async introspect(): Promise<any> {
      const request = new Request("http://localhost/api", {
        body: JSON.stringify({
          operationName: "IntrospectionQuery",
          query:
            "query IntrospectionQuery { __schema { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } } } ",
        }),
        method: "POST",
      });
      const res = await httpServer.fetch(request);
      return await res.json();
    },
  };
}

export type Server = ReturnType<typeof createServer>;

export interface ServerConfig {
  port?: number;
}