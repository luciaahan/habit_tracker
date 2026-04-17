import { describe, it, expect } from 'vitest';
import { calculateStreak, calculateLongestStreak } from './streakService';
import type { Completion } from '../types/index';

const id = 'habit-1';

function completions(dates: string[]): Completion[] {
  return dates.map((date) => ({ habitId: id, date }));
}

describe('calculateStreak', () => {
  it('returns 0 for no completions', () => {
    expect(calculateStreak(id, [], '2024-01-10')).toBe(0);
  });

  it('returns 0 when last completion is not today or yesterday (gap)', () => {
    expect(calculateStreak(id, completions(['2024-01-07']), '2024-01-10')).toBe(0);
  });

  it('returns 1 when only today is completed', () => {
    expect(calculateStreak(id, completions(['2024-01-10']), '2024-01-10')).toBe(1);
  });

  it('returns 1 when yesterday is completed but not today', () => {
    expect(calculateStreak(id, completions(['2024-01-09']), '2024-01-10')).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    expect(
      calculateStreak(id, completions(['2024-01-08', '2024-01-09', '2024-01-10']), '2024-01-10')
    ).toBe(3);
  });

  it('stops at a gap', () => {
    expect(
      calculateStreak(id, completions(['2024-01-06', '2024-01-08', '2024-01-09', '2024-01-10']), '2024-01-10')
    ).toBe(3);
  });

  it('ignores completions for other habits', () => {
    const mixed: Completion[] = [
      { habitId: 'other', date: '2024-01-10' },
      { habitId: id, date: '2024-01-09' },
      { habitId: id, date: '2024-01-10' },
    ];
    expect(calculateStreak(id, mixed, '2024-01-10')).toBe(2);
  });
});

describe('calculateLongestStreak', () => {
  it('returns 0 for no completions', () => {
    expect(calculateLongestStreak(id, [])).toBe(0);
  });

  it('returns 1 for a single completion', () => {
    expect(calculateLongestStreak(id, completions(['2024-01-10']))).toBe(1);
  });

  it('returns the length of a single consecutive run', () => {
    expect(
      calculateLongestStreak(id, completions(['2024-01-08', '2024-01-09', '2024-01-10']))
    ).toBe(3);
  });

  it('returns the longest of multiple runs', () => {
    expect(
      calculateLongestStreak(
        id,
        completions(['2024-01-01', '2024-01-02', '2024-01-05', '2024-01-06', '2024-01-07'])
      )
    ).toBe(3);
  });

  it('handles duplicate dates gracefully', () => {
    expect(
      calculateLongestStreak(id, completions(['2024-01-01', '2024-01-01', '2024-01-02']))
    ).toBe(2);
  });

  it('ignores completions for other habits', () => {
    const mixed: Completion[] = [
      { habitId: 'other', date: '2024-01-01' },
      { habitId: 'other', date: '2024-01-02' },
      { habitId: 'other', date: '2024-01-03' },
      { habitId: id, date: '2024-01-05' },
      { habitId: id, date: '2024-01-06' },
    ];
    expect(calculateLongestStreak(id, mixed)).toBe(2);
  });
});
