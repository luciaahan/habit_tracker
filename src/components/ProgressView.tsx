import type { Habit, Completion } from '../types';
import { calculateLongestStreak } from '../services/streakService';
import { TrackingGrid } from './TrackingGrid';
import { CompletionChart } from './CompletionChart';

export interface ProgressViewProps {
  habits: Habit[];
  completions: Completion[];
  dateRange: string[];
  completionsByDate: Record<string, number>;
  streaks: Record<string, number>;
  todayCompletions: Set<string>;
  selectedMonth: string;
  onSetSelectedMonth: (month: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function offsetMonth(yearMonth: string, delta: number): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function ProgressView({
  habits,
  completions,
  dateRange,
  completionsByDate,
  streaks,
  todayCompletions,
  selectedMonth,
  onSetSelectedMonth,
}: ProgressViewProps) {
  const totalCompletions = completions.length;
  const totalDays = dateRange.length;
  const completedDays = Object.values(completionsByDate).filter(count => count > 0).length;
  const completionPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const longestStreak = habits.reduce((max, habit) => {
    const streak = calculateLongestStreak(habit.id, completions);
    return streak > max ? streak : max;
  }, 0);

  const currentStreak = habits.length > 0
    ? Math.max(...habits.map(h => streaks[h.id] ?? 0))
    : 0;

  const currentMonth = new Date().toLocaleDateString('en-CA').slice(0, 7);
  const isCurrentMonth = selectedMonth === currentMonth;

  return (
    <div>
      {/* Month picker + stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button type="button" onClick={() => onSetSelectedMonth(offsetMonth(selectedMonth, -1))}>
            ‹
          </button>
          <strong>{formatMonthLabel(selectedMonth)}</strong>
          <button
            type="button"
            onClick={() => onSetSelectedMonth(offsetMonth(selectedMonth, 1))}
            disabled={isCurrentMonth}
            style={{ opacity: isCurrentMonth ? 0.4 : 1 }}
          >
            ›
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#065f46' }}>
          <span>Completions: {completedDays}/{totalDays} days — {completionPct}%</span>
          <span style={{ color: '#6ee7b7' }}>|</span>
          <span>Current Streak: {currentStreak}</span>
          <span style={{ color: '#6ee7b7' }}>|</span>
          <span>Longest Streak: {longestStreak}</span>
        </div>
      </div>
      <TrackingGrid
        habits={habits}
        completions={completions}
        dateRange={dateRange}
        streaks={streaks}
        todayCompletions={todayCompletions}
      />
      <CompletionChart
        dateRange={dateRange}
        completionsByDate={completionsByDate}
        totalHabits={habits.length}
      />
    </div>
  );
}
