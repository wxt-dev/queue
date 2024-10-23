import * as radix3 from "radix3";

export type RouteHandler<TParams = {}> = (
  params: TParams,
  url: URL,
  req: Request,
) => Response | Promise<Response>;

export interface Route {
  method: string;
  handler: RouteHandler;
}

export function createRestRouter() {
  const r = radix3.createRouter<Route>();
  const router = {
    get(path: string, handler: RouteHandler<any>) {
      r.insert(path, { method: "GET", handler });
      return router;
    },
    post(path: string, handler: RouteHandler<any>) {
      r.insert(path, { method: "POST", handler });
      return router;
    },
    any(path: string, handler: RouteHandler<any>) {
      r.insert(path, { method: "ANY", handler });
      return router;
    },
    on(method: string, path: string, handler: RouteHandler<any>) {
      r.insert(path, { method, handler });
      return router;
    },
    async fetch(url: URL, req: Request): Promise<Response> {
      const match = r.lookup(url.pathname);
      if (match && (req.method === match.method || match.method === "ANY")) {
        return await match.handler(match.params ?? {}, url, req);
      }
      return new Response(null, { status: 404 });
    },
  };
  return router;
}
