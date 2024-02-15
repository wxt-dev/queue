import { buildSchema, graphql } from "graphql";
import gqlSchema from "./schema.gql";
import { rootResolver } from "./resolvers";
import { consola } from "consola";
import pc from "picocolors";

export function createGraphql(ctx: WxtQueueCtx) {
  const schema = buildSchema(gqlSchema);

  let increment = 0;

  const evaluateQuery = async (req: Request) => {
    const method = req.method.toUpperCase();
    const id = ++increment;
    const {
      operationName = "Unknown",
      query,
      variables,
    } = await req.json<GraphQLParams>();

    const start = performance.now();
    consola.debug(
      `${pc.dim(`←-- [${id}]`)} ${pc.green(method)} ${pc.cyan(
        pc.bold(operationName),
      )}`,
    );

    const response = await graphql({
      schema,
      source: query,
      contextValue: ctx,
      variableValues: variables,
      rootValue: rootResolver,
    });

    const end = performance.now();
    consola.debug(
      `${pc.dim(`--→ [${id}]`)} ${pc.green(method)} ${pc.cyan(
        pc.bold(operationName),
      )} ${(end - start).toFixed(3)}ms`,
    );

    return response;
  };

  return {
    evaluateQuery,
  };
}

export interface GraphQLParams {
  query: string;
  variables?: {
    readonly [name: string]: unknown;
  };
  operationName?: string;
}
