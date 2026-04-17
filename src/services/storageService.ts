import type { Habit, Completion } from '../types/index';
import { StorageError } from '../types/index';

const STORAGE_KEY = 'habit-tracker';

export const storageService = {
  load(): { habits: Habit[]; completions: Completion[] } {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return { habits: [], completions: [] };
      const parsed = JSON.parse(raw);
      return {
        habits: parsed.habits ?? [],
        completions: parsed.completions ?? [],
      };
    } catch {
      return { habits: [], completions: [] };
    }
  },

  save(habits: Habit[], completions: Completion[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, completions }));
    } catch (err) {
      throw new StorageError('Failed to save data to localStorage', err);
    }
  },
};
