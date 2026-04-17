import type { Habit } from '../types';
import { DailyCheckinForm } from './DailyCheckinForm';

export interface CheckinModalProps {
  isOpen: boolean;
  today: string; // YYYY-MM-DD
  date: string; // YYYY-MM-DD — the date being checked in for
  habits: Habit[];
  existingCompletions: Set<string>;
  onSubmit: (checkedIds: string[]) => void;
  onClose: () => void;
}

export function CheckinModal({
  isOpen,
  today,
  date,
  habits,
  existingCompletions,
  onSubmit,
  onClose,
}: CheckinModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '320px',
          maxWidth: '480px',
          width: '100%',
        }}
      >
        {date === today ? (
          <DailyCheckinForm
            habits={habits}
            existingCompletions={existingCompletions}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        ) : (
          <div>
            <p>Past entries cannot be modified.</p>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
