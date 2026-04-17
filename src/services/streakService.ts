import type { Completion } from '../types/index';

/**
 * Returns the number of consecutive calendar days ending on or including today
 * for which the given habit has a completion.
 * Returns 0 if there is a gap between the last completion and today,
 * or if no completions exist for this habit.
 */
export function calculateStreak(
  habitId: string,
  completions: Completion[],
  today: string
): number {
  const dates = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date);

  if (dates.length === 0) return 0;

  const dateSet = new Set(dates);

  let streak = 0;
  let current = today;

  while (dateSet.has(current)) {
    streak++;
    current = offsetDate(current, -1);
  }

  return streak;
}

/**
 * Returns the maximum length of any consecutive-calendar-day run
 * in the full completion history for the given habit.
 * Returns 0 if no completions exist.
 */
export function calculateLongestStreak(
  habitId: string,
  completions: Completion[]
): number {
  const dates = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date);

  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort();

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (offsetDate(sorted[i - 1], 1) === sorted[i]) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Returns a YYYY-MM-DD date string offset by `days` from the given date string.
 */
function offsetDate(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
