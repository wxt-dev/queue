export const rootResolver: Gql.RootResolver = {
  chromeExtension: ({ id }, ctx) => ctx.deps.chromeWebStore.getExtension(id),
  chromeExtensions: ({ ids }, ctx) =>
    ctx.deps.chromeWebStore.getExtensions(ids),
  firefoxAddon: ({ id }, ctx) => ctx.deps.firefoxAddonStore.getExtension(id),
  firefoxAddons: ({ ids }, ctx) =>
    ctx.deps.firefoxAddonStore.getExtensions(ids),
  edgeAddon: ({ id }, ctx) => ctx.deps.edgeAddonStore.getExtension(id),
  edgeAddons: ({ ids }, ctx) => ctx.deps.edgeAddonStore.getExtensions(ids),
};
