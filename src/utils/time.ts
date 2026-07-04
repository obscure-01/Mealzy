// src/utils/time.ts
/**
 * Convert a number of minutes to a user‑friendly display string.
 * The format follows the design system's requirement for the waiting time badge.
 */
export const formatMinutes = (minutes: number): string => `⏱ ${minutes} min`;
