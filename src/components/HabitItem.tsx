import { useState } from 'react';
import { validateHabit } from '../services/habitService';
import type { Habit, HabitUpdate } from '../types/index';

export interface HabitItemProps {
  habit: Habit;
  streak: number;
  isCompletedToday: boolean;
  onEdit: (id: string, updates: HabitUpdate) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, streak, isCompletedToday, onEdit, onDelete }: HabitItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = validateHabit(editName, editDescription || undefined);

    if (!result.valid) {
      const nameErr = result.errors.find((err) => err.toLowerCase().includes('name')) ?? '';
      const descErr = result.errors.find((err) => err.toLowerCase().includes('description')) ?? '';
      setNameError(nameErr);
      setDescriptionError(descErr);
      return;
    }

    setNameError('');
    setDescriptionError('');
    onEdit(habit.id, { name: editName, description: editDescription });
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setEditName(habit.name);
    setEditDescription(habit.description);
    setNameError('');
    setDescriptionError('');
    setIsEditing(false);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete '${habit.name}'? This will also remove all completion history for this habit.`
    );
    if (confirmed) {
      onDelete(habit.id);
    }
  }

  return (
    <div className={isCompletedToday ? 'completed' : undefined}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit} noValidate>
          <div>
            <label htmlFor={`edit-name-${habit.id}`}>Name</label>
            <input
              id={`edit-name-${habit.id}`}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              aria-describedby={nameError ? `edit-name-error-${habit.id}` : undefined}
              aria-invalid={!!nameError}
            />
            {nameError && (
              <span id={`edit-name-error-${habit.id}`} role="alert">
                {nameError}
              </span>
            )}
          </div>

          <div>
            <label htmlFor={`edit-desc-${habit.id}`}>Description (optional)</label>
            <textarea
              id={`edit-desc-${habit.id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              aria-describedby={descriptionError ? `edit-desc-error-${habit.id}` : undefined}
              aria-invalid={!!descriptionError}
            />
            {descriptionError && (
              <span id={`edit-desc-error-${habit.id}`} role="alert">
                {descriptionError}
              </span>
            )}
          </div>

          <button type="submit">Save</button>
          <button type="button" onClick={handleCancelEdit}>Cancel</button>
        </form>
      ) : (
        <>
          <span>{habit.name}</span>
          <span>🔥 {streak} day streak</span>
          <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
          <button type="button" onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}
