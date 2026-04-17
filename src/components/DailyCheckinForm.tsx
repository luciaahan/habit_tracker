import { useState } from 'react';
import type { Habit } from '../types';

export interface DailyCheckinFormProps {
  habits: Habit[];
  existingCompletions: Set<string>; // habit IDs already completed today
  onSubmit: (checkedIds: string[]) => void;
  onClose: () => void;
}

export function DailyCheckinForm({
  habits,
  existingCompletions,
  onSubmit,
  onClose,
}: DailyCheckinFormProps) {
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(existingCompletions)
  );

  function handleToggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(Array.from(checked));
    onClose();
  }

  if (habits.length === 0) {
    return (
      <p>You have no habits yet. Create a habit first to start logging.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {habits.map((habit) => (
        <div key={habit.id}>
          <label>
            <input
              type="checkbox"
              checked={checked.has(habit.id)}
              onChange={() => handleToggle(habit.id)}
            />
            {habit.name}
          </label>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}
