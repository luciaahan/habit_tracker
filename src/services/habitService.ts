import type { Habit, HabitUpdate, Completion, ValidationResult } from '../types/index';

export function validateHabit(name: string, description?: string): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required.');
  } else if (name.length > 100) {
    errors.push('Name must be 100 characters or fewer.');
  }

  if (description !== undefined && description.length > 500) {
    errors.push('Description must be 500 characters or fewer.');
  }

  return { valid: errors.length === 0, errors };
}

export function createHabit(name: string, description?: string): Habit {
  return {
    id: crypto.randomUUID(),
    name,
    description: description ?? '',
    createdAt: new Date().toISOString(),
  };
}

export function updateHabit(id: string, updates: HabitUpdate, habits: Habit[]): Habit[] {
  return habits.map((habit) =>
    habit.id === id ? { ...habit, ...updates } : habit
  );
}

export function deleteHabit(
  id: string,
  habits: Habit[],
  completions: Completion[]
): { habits: Habit[]; completions: Completion[] } {
  return {
    habits: habits.filter((h) => h.id !== id),
    completions: completions.filter((c) => c.habitId !== id),
  };
}

export function sortHabits(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
}
