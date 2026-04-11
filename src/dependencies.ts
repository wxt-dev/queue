import { createIocContainer } from "@aklinker1/zero-ioc";
import { createChromeService } from "./utils/chrome/chrome-service";
import { createFirefoxService } from "./utils/firefox/firefox-service";
import { createEdgeService } from "./utils/edge/edge-service";

export const dependencies = createIocContainer()
  .register("chrome", createChromeService)
  .register("firefox", createFirefoxService)
  .register("edge", createEdgeService);
