import { register } from "@prometheus-io/client";

/**
 * Serve internal metrics on another port so infra can control access separate from the main API
 * server.
 */
export function startMetricsServer() {
  return Bun.serve({
    hostname: process.env.METRICS_HOSTNAME,
    port: Number(process.env.METRICS_PORT) || 3333,
    routes: {
      "/metrics": {
        GET: async () =>
          new Response(await register.metrics(), {
            headers: { "Content-Type": register.contentType },
          }),
      },
    },
  });
}
