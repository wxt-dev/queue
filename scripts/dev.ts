#!/usr/bin/env bun
import { createLogger } from "@aklinker1/logger";

import { version } from "../package.json";
import app from "../src/server";
import { generateGqlTypes } from "./generate-gql-types";

const logger = createLogger("http");

const fetch = app.build();
await generateGqlTypes(fetch);

const server = Bun.serve({ fetch });

logger.success("@wxt-dev/queue server started", { version, url: server.url });
