import React from 'react';
import type { Habit, Completion } from '../types';

interface TrackingGridProps {
  habits: Habit[];           // ordered alphabetically
  completions: Completion[]; // all completions in the date range
  dateRange: string[];       // ISO date strings YYYY-MM-DD, oldest → newest
  streaks?: Record<string, number>;
  todayCompletions?: Set<string>;
}

/** Format "2024-04-16" → "04/16" */
export function formatDateLabel(isoDate: string): string {
  const [, month, day] = isoDate.split('-');
  return `${month}/${day}`;
}

export function TrackingGrid({
  habits,
  completions,
  dateRange,
  streaks = {},
}: TrackingGridProps) {
  const completionSet = new Set(
    completions.map((c) => `${c.habitId}|${c.date}`)
  );

  const stickyLabelStyle: React.CSSProperties = {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    backgroundColor: 'var(--color-sticky-bg)',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ ...stickyLabelStyle, textAlign: 'left', padding: '4px 12px' }}>
              Habits
            </th>
            {dateRange.map((date) => (
              <th
                key={date}
                style={{ padding: '4px 6px', textAlign: 'center', fontSize: '0.65rem', whiteSpace: 'nowrap', backgroundColor: 'var(--color-teal-bg)' }}
              >
                {formatDateLabel(date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id}>
              <td style={{ ...stickyLabelStyle, padding: '4px 12px' }}>
                <span style={{ marginRight: '8px' }}>{habit.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  🔥 {streaks[habit.id] ?? 0}
                </span>
              </td>
              {dateRange.map((date) => {
                const completed = completionSet.has(`${habit.id}|${date}`);
                return (
                  <td
                    key={date}
                    style={{
                      padding: '4px 6px',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: completed ? 'rgba(16, 185, 129, 0.4)' : 'transparent',
                      color: completed ? 'inherit' : 'inherit',
                    }}
                  >
                    {completed ? 'O' : 'X'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
