import type { Completion } from '../types/index';

/**
 * Replaces all completions for the given date with one Completion per habitId.
 * Enforces (habitId, date) uniqueness.
 */
export function setCompletions(
  habitIds: string[],
  date: string,
  existing: Completion[]
): Completion[] {
  const withoutDate = existing.filter((c) => c.date !== date);
  const newCompletions: Completion[] = habitIds.map((habitId) => ({ habitId, date }));
  return [...withoutDate, ...newCompletions];
}

/**
 * Returns all completions matching the given date.
 */
export function getCompletionsForDate(date: string, completions: Completion[]): Completion[] {
  return completions.filter((c) => c.date === date);
}

/**
 * Returns a map of date → completion count for each date in dateRange.
 * Dates with no completions map to 0.
 */
export function getCompletionsByDate(
  completions: Completion[],
  dateRange: string[]
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const date of dateRange) {
    result[date] = 0;
  }
  for (const { date } of completions) {
    if (date in result) {
      result[date]++;
    }
  }
  return result;
}
