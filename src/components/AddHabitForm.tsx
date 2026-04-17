import { useState } from 'react';
import { validateHabit } from '../services/habitService';

export interface AddHabitFormProps {
  onAddHabit: (name: string, description?: string) => void;
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = validateHabit(name, description || undefined);

    if (!result.valid) {
      const nameErr = result.errors.find(
        (err) => err.toLowerCase().includes('name')
      ) ?? '';
      const descErr = result.errors.find(
        (err) => err.toLowerCase().includes('description')
      ) ?? '';
      setNameError(nameErr);
      setDescriptionError(descErr);
      return;
    }

    setNameError('');
    setDescriptionError('');
    onAddHabit(name, description || undefined);
    setName('');
    setDescription('');
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="habit-name">Name</label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-describedby={nameError ? 'habit-name-error' : undefined}
          aria-invalid={!!nameError}
        />
        {nameError && (
          <span id="habit-name-error" role="alert">
            {nameError}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="habit-description">Description (optional)</label>
        <textarea
          id="habit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-describedby={descriptionError ? 'habit-description-error' : undefined}
          aria-invalid={!!descriptionError}
        />
        {descriptionError && (
          <span id="habit-description-error" role="alert">
            {descriptionError}
          </span>
        )}
      </div>

      <button type="submit">Add Habit</button>
    </form>
  );
}
