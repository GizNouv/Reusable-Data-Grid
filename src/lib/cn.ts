/**
 * Tiny utility to merge class names, handling falsy values.
 * Similar to clsx but zero dependencies.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}