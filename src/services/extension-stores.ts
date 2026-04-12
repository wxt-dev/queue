import type { ExtensionStoreName } from "../enums";
import type { ExtensionStore } from "./extension-store";

export type ExtensionStores = Record<ExtensionStoreName, ExtensionStore<any>>;
