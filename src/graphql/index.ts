import { buildSchema, graphql } from "graphql";
import gqlSchema from "../assets/schema.gql" with { type: "text" };
import { rootResolver } from "./resolvers";
import { container } from "../dependencies";
import { createLogger } from "@aklinker1/logger";

const logger = createLogger("gql");

export function createGraphql() {
  const schema = buildSchema(gqlSchema);

  let increment = 0;

  const evaluateQuery = async (method: string, body: GraphQLParams) => {
    const id = ++increment;
    const { operationName = "Unknown", query, variables } = body;

    const start = performance.now();

    logger.debug("Running query", { id, method, operationName });

    const ctx: Gql.WxtQueueCtx = {
      deps: container.registrations,
    };

    const response = await graphql({
      schema,
      source: query,
      contextValue: ctx,
      variableValues: variables,
      rootValue: rootResolver,
    });

    const end = performance.now();
    logger.debug("Query finished", {
      id,
      method,
      operationName,
      durationMs: end - start,
    });

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
