/**
 * Utility functions for sf-sensequery
 */

/**
 * Check if a survey key is valid
 * @param key The survey key to validate
 * @returns True if the key is valid, false otherwise
 */
export function isValidKey(key: string | undefined | null): boolean {
  return typeof key === 'string' && key.trim().length > 0;
}

/**
 * Format error messages for display
 * @param error The error object or message
 * @returns A formatted error message string
 */
export function formatErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}
