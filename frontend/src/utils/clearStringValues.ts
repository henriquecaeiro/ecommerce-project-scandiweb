/**
 * Recursively clears all string values in an object by replacing them with an empty space (" ").
 * If a property is an object (but not an array), the function is called recursively to clear nested string values.
 *
 * @param obj - The object whose string values should be cleared.
 * @returns A new object with all string values replaced by an empty space.
 */
export function clearStringValues<T extends Record<string, any>>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === "string"
          ? " "
          : typeof value === "object" && value !== null && !Array.isArray(value)
          ? clearStringValues(value)
          : value,
      ])
    ) as T;
  }
  