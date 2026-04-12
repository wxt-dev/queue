export const rootResolver: Gql.RootResolver = {
  chromeExtension: ({ id }, ctx) => ctx.chromeWebStore.getExtension(id),
  chromeExtensions: ({ ids }, ctx) => ctx.chromeWebStore.getExtensions(ids),
  firefoxAddon: ({ id }, ctx) => ctx.firefoxAddonStore.getExtension(id),
  firefoxAddons: ({ ids }, ctx) => ctx.firefoxAddonStore.getExtensions(ids),
  edgeAddon: ({ id }, ctx) => ctx.edgeAddonStore.getExtension(id),
  edgeAddons: ({ ids }, ctx) => ctx.edgeAddonStore.getExtensions(ids),
};
