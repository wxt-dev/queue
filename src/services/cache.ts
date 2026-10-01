export interface Cache {
  with<T>(key: string, fn: () => Promise<T>): Promise<T>;
}

export type CacheSuccess<T> = { success: true; data: T };
export type CacheFailure = { success: false; error: unknown };
export type CacheResult<T> = CacheSuccess<T> | CacheFailure;
