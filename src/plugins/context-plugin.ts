import { createApp } from "@aklinker1/zeta";
import { container } from "../dependencies";

export const contextPlugin = createApp()
  .decorate({ deps: container.registrations })
  .export();
