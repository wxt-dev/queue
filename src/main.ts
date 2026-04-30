#!/usr/bin/env bun
import app from "./server";
import { version } from "../package.json";
import { createLogger } from "@aklinker1/logger";

const logger = createLogger("http");

const port = Number(process.env.PORT ?? "3000");
app.listen(port, () => {
  logger.success("@wxt-dev/queue started", { version, port });
});
