import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from './storageService';
import { StorageError } from '../types/index';

const STORAGE_KEY = 'habit-tracker';

const sampleHabits = [
  { id: '1', name: 'Exercise', description: 'Daily workout', createdAt: '2024-01-01' },
];
const sampleCompletions = [{ habitId: '1', date: '2024-01-01' }];

beforeEach(() => {
  localStorage.clear();
});

describe('storageService.load', () => {
  it('returns empty arrays when localStorage has no entry', () => {
    const result = storageService.load();
    expect(result).toEqual({ habits: [], completions: [] });
  });

  it('returns parsed habits and completions from localStorage', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ habits: sampleHabits, completions: sampleCompletions })
    );
    const result = storageService.load();
    expect(result.habits).toEqual(sampleHabits);
    expect(result.completions).toEqual(sampleCompletions);
  });

  it('returns empty arrays when localStorage contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
    const result = storageService.load();
    expect(result).toEqual({ habits: [], completions: [] });
  });

  it('falls back to empty arrays when parsed object is missing keys', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    const result = storageService.load();
    expect(result).toEqual({ habits: [], completions: [] });
  });
});

describe('storageService.save', () => {
  it('writes habits and completions to localStorage', () => {
    storageService.save(sampleHabits, sampleCompletions);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.habits).toEqual(sampleHabits);
    expect(parsed.completions).toEqual(sampleCompletions);
  });

  it('round-trips: save then load returns the same data', () => {
    storageService.save(sampleHabits, sampleCompletions);
    const result = storageService.load();
    expect(result.habits).toEqual(sampleHabits);
    expect(result.completions).toEqual(sampleCompletions);
  });

  it('throws StorageError when localStorage.setItem fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => storageService.save(sampleHabits, sampleCompletions)).toThrow(StorageError);
  });
});
