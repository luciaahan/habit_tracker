import type { Habit, HabitUpdate } from '../types/index';
import { HabitItem } from './HabitItem';
import { AddHabitForm } from './AddHabitForm';

export interface HabitListPanelProps {
  habits: Habit[];
  streaks: Record<string, number>;
  todayCompletions: Set<string>;
  onAddHabit: (name: string, description?: string) => void;
  onEditHabit: (id: string, updates: HabitUpdate) => void;
  onDeleteHabit: (id: string) => void;
}

export function HabitListPanel({
  habits,
  streaks,
  todayCompletions,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
}: HabitListPanelProps) {
  return (
    <div>
      {habits.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No habits yet. Add one below.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {habits.map((habit) => (
            <li key={habit.id}>
              <HabitItem
                habit={habit}
                streak={streaks[habit.id] ?? 0}
                isCompletedToday={todayCompletions.has(habit.id)}
                onEdit={onEditHabit}
                onDelete={onDeleteHabit}
              />
            </li>
          ))}
        </ul>
      )}
      <AddHabitForm onAddHabit={onAddHabit} />
    </div>
  );
}
