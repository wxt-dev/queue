#!/usr/bin/env bun
import app from "../src/server";
import { generateGqlTypes } from "./generate-gql-types";
import { version } from "../package.json";
import { createLogger } from "@aklinker1/logger";

const logger = createLogger("http");

const fetch = app.build();
await generateGqlTypes(fetch);

const server = Bun.serve({ fetch });

logger.success("@wxt-dev/queue server started", { version, url: server.url });
