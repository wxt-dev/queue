#!/usr/bin/env bun
import consola from "consola";
import app from "./server";
import pc from "picocolors";
import { version } from "../package.json";

if (process.env.LOG_LEVEL) {
  // silent: Number.NEGATIVE_INFINITY
  // fatal: 0
  // error: 0
  // warn: 1
  // log: 2
  // info: 3
  // success: 3
  // fail: 3
  // ready: 3
  // start: 3
  // box: 3
  // debug: 4
  // trace: 5
  // verbose: Number.POSITIVE_INFINITY
  consola.level = Number(process.env.LOG_LEVEL);
}

const port = Number(process.env.PORT ?? "3000");
app.listen(port, () => {
  consola.info(
    `${pc.cyan("@wxt-dev/queue v" + version)} ${pc.dim("server started")}`,
  );
});
