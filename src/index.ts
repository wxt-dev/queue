#!/usr/bin/env bun
import consola, { LogLevels } from "consola";
import { createServer } from "./server";

if (process.env.NODE_ENV === "development") {
  consola.level = LogLevels.debug;
}

const server = createServer();

if (process.env.NODE_ENV === "development") {
  const { generateGqlTypes } = await import("../scripts/generate-gql-types");
  await generateGqlTypes(server);
}
