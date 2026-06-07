export const STORAGE_NAMESPACE = "biopharm-lab";
export const SCHEMA_VERSION = 1;

export function namespacedKey(slice: string): string {
  return `${STORAGE_NAMESPACE}:${slice}`;
}

export const isBrowser = typeof window !== "undefined";
