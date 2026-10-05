import { collectDefaultMetrics, Counter } from "@prometheus-io/client";

const prefix = "wxt_queue_";

collectDefaultMetrics({ prefix });

export const fetchExtensionCounter = new Counter({
  name: prefix + "fetch_extension_total",
  help: "The number of times the server fetched real, upstream extension details without caching",
  labelNames: ["store_name", "result"] as const,
});
