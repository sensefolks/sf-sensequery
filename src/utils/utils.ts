// Utility functions for sf-sensequery
export function isValidKey(key: string): boolean {
  return typeof key === 'string' && key.trim().length > 0;
}
