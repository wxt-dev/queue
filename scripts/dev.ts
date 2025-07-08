#!/usr/bin/env bun
import consola, { LogLevels } from "consola";
import app from "../src/server";
import { generateGqlTypes } from "./generate-gql-types";
import pc from "picocolors";
import { version } from "../package.json";

const fetch = app.build();
await generateGqlTypes(fetch);

consola.level = LogLevels.debug;
const port = Number(process.env.PORT ?? "3000");
Bun.serve({ port, fetch });

consola.success(
  `${pc.cyan("@wxt-dev/queue v" + version)} ${pc.dim("server started")}`,
);
consola.log(`  ${pc.bold(pc.green("➜"))} http://localhost:${port}`);
console.log();
