import type { Cache } from "./cache";

export function createInMemoryCache(): Cache {
  let cache: Record<string, any> = Object.create(null);

  return {
    get: async (key: string) => {
      return cache[key];
    },
    set: async (key: string, value: any) => {
      cache[key] = value;
    },
  };
}
