import { createApp } from "@aklinker1/zeta";
import { dependencies } from "../dependencies";

export const contextPlugin = createApp()
  .decorate(dependencies.resolveAll())
  .export();
