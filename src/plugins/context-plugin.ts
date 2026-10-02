import { createApp } from "@aklinker1/zeta";

import { requestScope } from "../dependencies";

export const contextPlugin = createApp()
  .onTransform(() => ({ deps: requestScope({}).registrations }))
  .export();
