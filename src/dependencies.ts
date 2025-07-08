import { createIocContainer } from "@aklinker1/zero-ioc";
import { createChromeService } from "./utils/chrome/chrome-service";
import { createFirefoxService } from "./utils/firefox/firefox-service";

export const dependencies = createIocContainer().register({
  chrome: createChromeService,
  firefox: createFirefoxService,
});
