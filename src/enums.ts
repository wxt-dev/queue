export enum ExtensionStoreName {
  ChromeWebStore = "chrome-web-store",
  FirefoxAddonStore = "firefox-addon-store",
  EdgeAddonStore = "edge-addon-store",

  /** @deprecated Use {@link ChromeWebStore} instead. */
  ChromeExtensions = "chrome-extensions",
  /** @deprecated Use {@link FirefoxAddonStore} instead. */
  FirefoxExtensions = "firefox-extensions",
  /** @deprecated Use {@link EdgeAddonStore} instead. */
  EdgeExtensions = "edge-extensions",
}

export enum OpenApiTag {
  System = "System",
  ExtensionStores = "Extension Stores",
  Graphql = "GraphQL",
}
