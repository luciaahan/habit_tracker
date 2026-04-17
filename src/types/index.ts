/**
 * Core data types for the Habit Tracker application.
 */

/** A user-defined recurring activity. */
export interface Habit {
  /** UUID v4 unique identifier */
  id: string;
  /** 1–100 characters */
  name: string;
  /** 0–500 characters */
  description: string;
  /** ISO 8601 date string (creation timestamp) */
  createdAt: string;
}

/** Partial update payload for an existing habit. */
export interface HabitUpdate {
  name?: string;
  description?: string;
}

/** A record that a habit was completed on a specific date. */
export interface Completion {
  /** References Habit.id */
  habitId: string;
  /** YYYY-MM-DD in the user's local timezone */
  date: string;
}

/** Result of a validation operation. */
export interface ValidationResult {
  valid: boolean;
  /** Human-readable error messages */
  errors: string[];
}

/** Shape of the data persisted to localStorage. */
export interface StorageSchema {
  habits: Habit[];
  completions: Completion[];
}

/** Thrown when a localStorage write operation fails. */
export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}
