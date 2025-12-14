/**
 * Base path for API calls - must match vite.config.ts base setting
 * This ensures API calls work when deployed under subpath
 */
export const BASE_PATH = '/projects/currency-converter';

/**
 * Construct an API URL with the base path
 */
export function apiUrl(path: string): string {
  return `${BASE_PATH}${path}`;
}
