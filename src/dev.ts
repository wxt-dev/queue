#!/usr/bin/env bun
import consola, { LogLevels } from "consola";
import { createServer } from "./server";
import { generateGqlTypes } from "../scripts/generate-gql-types";

consola.level = LogLevels.debug;
const server = createServer();
await generateGqlTypes(server);
