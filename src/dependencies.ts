import { createIocContainer } from "@aklinker1/zero-ioc";
import { createChromeWebStore } from "./services/chrome-web-store";
import { createFirefoxAddonStore } from "./services/firefox-addon-store";
import { createEdgeAddonStore } from "./services/edge-addon-store";
import type { ExtensionStores } from "./services/extension-stores";
import { ExtensionStoreName } from "./enums";

export const dependencies = createIocContainer()
  .register("chromeWebStore", createChromeWebStore)
  .register("firefoxAddonStore", createFirefoxAddonStore)
  .register("edgeAddonStore", createEdgeAddonStore)
  .register(
    "stores",
    (deps) =>
      ({
        [ExtensionStoreName.ChromeExtensions]: deps.chromeWebStore,
        [ExtensionStoreName.ChromeWebStore]: deps.chromeWebStore,
        [ExtensionStoreName.FirefoxExtensions]: deps.firefoxAddonStore,
        [ExtensionStoreName.FirefoxAddonStore]: deps.firefoxAddonStore,
        [ExtensionStoreName.EdgeExtensions]: deps.edgeAddonStore,
        [ExtensionStoreName.EdgeAddonStore]: deps.edgeAddonStore,
      }) satisfies ExtensionStores,
  );
