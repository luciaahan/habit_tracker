import type { Habit, Completion } from '../types';
import { ProgressView } from './ProgressView';
import { CheckinModal } from './CheckinModal';

export interface MainViewProps {
  sortedHabits: Habit[];
  completions: Completion[];
  streaks: Record<string, number>;
  todayCompletions: Set<string>;
  dateRange: string[];
  completionsByDate: Record<string, number>;
  today: string;
  selectedMonth: string;
  errorMessage: string | null;
  isCheckinOpen: boolean;
  onSubmitCheckin: (checkedIds: string[]) => void;
  onClearError: () => void;
  onSetSelectedMonth: (month: string) => void;
  onCloseCheckin: () => void;
}

export function MainView({
  sortedHabits,
  completions,
  streaks,
  todayCompletions,
  dateRange,
  completionsByDate,
  today,
  selectedMonth,
  errorMessage,
  isCheckinOpen,
  onSubmitCheckin,
  onClearError,
  onSetSelectedMonth,
  onCloseCheckin,
}: MainViewProps) {

  return (
    <div>
      {errorMessage && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            marginBottom: '16px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            color: '#991b1b',
          }}
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={onClearError}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              color: '#991b1b',
              padding: '0 0 0 12px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div>
        <ProgressView
          habits={sortedHabits}
          completions={completions}
          dateRange={dateRange}
          completionsByDate={completionsByDate}
          streaks={streaks}
          todayCompletions={todayCompletions}
          selectedMonth={selectedMonth}
          onSetSelectedMonth={onSetSelectedMonth}
        />
      </div>

      <CheckinModal
        isOpen={isCheckinOpen}
        today={today}
        date={today}
        habits={sortedHabits}
        existingCompletions={todayCompletions}
        onSubmit={(ids) => { onSubmitCheckin(ids); onCloseCheckin(); }}
        onClose={onCloseCheckin}
      />
    </div>
  );
}
