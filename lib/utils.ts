/**
 * Format a number as a standardized price string (e.g. PKR 55,000)
 */
export function formatPrice(value: number): string {
  return `PKR ${value.toLocaleString('en-US')}`;
}
