export const rootResolver: Gql.RootResolver = {
  chromeExtension: ({ id }, ctx) => ctx.chrome.getExtension(id),
  chromeExtensions: ({ ids }, ctx) => ctx.chrome.getExtensions(ids),
  firefoxAddon: ({ id }, ctx) => ctx.firefox.getAddon(id),
  firefoxAddons: ({ ids }, ctx) => ctx.firefox.getAddons(ids),
};
