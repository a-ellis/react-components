/**
 * Converts `percent` to a `value`, given `min` and `max`, rounded to nearest integer.
 */
export const percentToValue = (percent: number, min: number, max: number) => Math.round((max - min) * percent + min);

/**
 * Converts `value` to `percent`, given `min` and `max`, rounded to the nearest integer.
 */
export const valueToPercent = (value: number, min: number, max: number) =>
  Math.round(((value - min) * 100) / (max - min));

/**
 * Used to clamp provided `value` within range defined by `min` and `max`, inclusive.
 */
export const clampValueToRange = (value: number, min: number, max: number) => Math.min(Math.max(min, value), max);
