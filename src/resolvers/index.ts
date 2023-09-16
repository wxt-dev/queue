export const rootResolver: Gql.RootResolver = {
  chromeExtension: ({ id }, ctx) => ctx.chrome.getExtension(id),
  chromeExtensions: ({ ids }, ctx) => ctx.chrome.getExtensions(ids),
};
