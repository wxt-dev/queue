import { createInMemoryCache } from "../utils/cache";
import { chromeExtension } from "./chromeExtension";

const chromeExtensionCache = createInMemoryCache<Gql.ChromeExtension>({
  expiresInMs: 4.32e7, // 12 hours
});

export const rootResolver: Gql.RootResolver = {
  chromeExtension: chromeExtension(chromeExtensionCache),
};
