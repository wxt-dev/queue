#!/usr/bin/env bun
import { createLogger } from "@aklinker1/logger";

import { version } from "../package.json";
import { startMetricsServer } from "./metrics-server";
import app from "./server";

startMetricsServer();

const logger = createLogger("http");

const port = Number(process.env.PORT ?? "3000");
app.listen(port, () => {
  logger.success("@wxt-dev/queue started", { version, port });
});
