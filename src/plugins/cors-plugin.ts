import { createApp } from "@aklinker1/zeta";

export const corsPlugin = createApp()
  .onRequest(({ method, set }) => {
    set.headers["Access-Control-Allow-Origin"] = "*";
    set.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    set.headers["Access-Control-Allow-Headers"] = "*";
    if (method === "OPTIONS") {
      set.status = 204;
    }
  })
  .export();
