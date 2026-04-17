import { useState, useEffect } from 'react';
import type { Habit, HabitUpdate, Completion } from '../types/index';
import { StorageError } from '../types/index';
import { storageService } from '../services/storageService';
import {
  validateHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  sortHabits,
} from '../services/habitService';
import { setCompletions, getCompletionsByDate } from '../services/completionService';
import { calculateStreak } from '../services/streakService';

interface HabitStoreState {
  habits: Habit[];
  completions: Completion[];
  errorMessage: string | null;
}

function getToday(): string {
  return new Date().toLocaleDateString('en-CA');
}

/** Returns "YYYY-MM" for the current month */
function getCurrentMonth(): string {
  return getToday().slice(0, 7);
}

/** Returns all YYYY-MM-DD dates in the given "YYYY-MM" month */
function buildMonthDateRange(yearMonth: string): string[] {
  const [year, month] = yearMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const range: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dd = String(d).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    range.push(`${year}-${mm}-${dd}`);
  }
  return range;
}

export function useHabitStore() {
  const today = getToday();

  const [state, setState] = useState<HabitStoreState>(() => {
    const { habits, completions } = storageService.load();
    return { habits, completions, errorMessage: null };
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth);

  useEffect(() => {
    const { habits, completions } = storageService.load();
    setState((prev) => ({ ...prev, habits, completions }));
  }, []);

  function saveState(habits: Habit[], completions: Completion[]) {
    try {
      storageService.save(habits, completions);
    } catch (err) {
      if (err instanceof StorageError) {
        setState((prev) => ({ ...prev, errorMessage: err.message }));
      }
    }
  }

  function addHabit(name: string, description?: string): void {
    const result = validateHabit(name, description);
    if (!result.valid) {
      setState((prev) => ({ ...prev, errorMessage: result.errors.join(' ') }));
      return;
    }
    const habit = createHabit(name, description);
    const newHabits = [...state.habits, habit];
    setState((prev) => ({ ...prev, habits: newHabits }));
    saveState(newHabits, state.completions);
  }

  function editHabit(id: string, updates: HabitUpdate): void {
    const name = updates.name ?? state.habits.find((h) => h.id === id)?.name ?? '';
    const description = updates.description ?? state.habits.find((h) => h.id === id)?.description;
    const result = validateHabit(name, description);
    if (!result.valid) {
      setState((prev) => ({ ...prev, errorMessage: result.errors.join(' ') }));
      return;
    }
    const newHabits = updateHabit(id, updates, state.habits);
    setState((prev) => ({ ...prev, habits: newHabits }));
    saveState(newHabits, state.completions);
  }

  function removeHabit(id: string): void {
    const { habits: newHabits, completions: newCompletions } = deleteHabit(
      id,
      state.habits,
      state.completions
    );
    setState((prev) => ({ ...prev, habits: newHabits, completions: newCompletions }));
    saveState(newHabits, newCompletions);
  }

  function submitCheckin(checkedIds: string[]): void {
    const newCompletions = setCompletions(checkedIds, today, state.completions);
    setState((prev) => ({ ...prev, completions: newCompletions }));
    saveState(state.habits, newCompletions);
  }

  function clearError(): void {
    setState((prev) => ({ ...prev, errorMessage: null }));
  }

  // Derived values
  const sortedHabits = sortHabits(state.habits);
  const dateRange = buildMonthDateRange(selectedMonth);
  const completionsByDate = getCompletionsByDate(state.completions, dateRange);

  const streaks: Record<string, number> = {};
  for (const habit of state.habits) {
    streaks[habit.id] = calculateStreak(habit.id, state.completions, today);
  }

  const todayCompletions = new Set(
    state.completions.filter((c) => c.date === today).map((c) => c.habitId)
  );

  return {
    // State
    habits: state.habits,
    completions: state.completions,
    errorMessage: state.errorMessage,
    today,
    // Derived
    sortedHabits,
    dateRange,
    completionsByDate,
    streaks,
    todayCompletions,
    selectedMonth,
    // Actions
    addHabit,
    editHabit,
    removeHabit,
    submitCheckin,
    clearError,
    setSelectedMonth,
  };
}
