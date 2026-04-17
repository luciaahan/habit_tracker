import { useState } from 'react';
import type { Habit, HabitUpdate } from '../types';
import { validateHabit } from '../services/habitService';

interface EditHabitsModalProps {
  habits: Habit[];
  onAddHabit: (name: string, description?: string) => void;
  onEditHabit: (id: string, updates: HabitUpdate) => void;
  onDeleteHabit: (id: string) => void;
  onClose: () => void;
}

interface EditingState {
  name: string;
  description: string;
  nameError: string;
  descError: string;
}

export function EditHabitsModal({
  habits,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onClose,
}: EditHabitsModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditingState>({ name: '', description: '', nameError: '', descError: '' });

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newNameError, setNewNameError] = useState('');
  const [newDescError, setNewDescError] = useState('');

  function startEdit(habit: Habit) {
    setEditingId(habit.id);
    setEditState({ name: habit.name, description: habit.description, nameError: '', descError: '' });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditState({ name: '', description: '', nameError: '', descError: '' });
  }

  function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateHabit(editState.name, editState.description || undefined);
    if (!result.valid) {
      setEditState((s) => ({
        ...s,
        nameError: result.errors.find((err) => err.toLowerCase().includes('name')) ?? '',
        descError: result.errors.find((err) => err.toLowerCase().includes('description')) ?? '',
      }));
      return;
    }
    onEditHabit(editingId!, { name: editState.name, description: editState.description });
    cancelEdit();
  }

  function handleDelete(habit: Habit) {
    const confirmed = window.confirm(
      `Delete '${habit.name}'? This will also remove all completion history for this habit.`
    );
    if (confirmed) onDeleteHabit(habit.id);
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    const result = validateHabit(newName, newDesc || undefined);
    if (!result.valid) {
      setNewNameError(result.errors.find((err) => err.toLowerCase().includes('name')) ?? '');
      setNewDescError(result.errors.find((err) => err.toLowerCase().includes('description')) ?? '');
      return;
    }
    onAddHabit(newName, newDesc || undefined);
    setNewName('');
    setNewDesc('');
    setNewNameError('');
    setNewDescError('');
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Habits"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '80vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Edit Habits</h2>
          <button type="button" onClick={onClose} aria-label="Close" style={{ fontSize: '1.25rem', background: 'none', border: 'none' }}>✕</button>
        </div>

        {/* Existing habits */}
        {habits.length === 0 ? (
          <p style={{ color: '#6b7280', margin: 0 }}>No habits yet. Add one below.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {habits.map((habit) => (
              <li key={habit.id} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px 12px' }}>
                {editingId === habit.id ? (
                  <form onSubmit={submitEdit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <label htmlFor={`edit-name-${habit.id}`} style={{ display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>Name</label>
                      <input
                        id={`edit-name-${habit.id}`}
                        type="text"
                        value={editState.name}
                        onChange={(e) => setEditState((s) => ({ ...s, name: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        aria-invalid={!!editState.nameError}
                      />
                      {editState.nameError && <span role="alert" style={{ color: '#dc2626', fontSize: '0.8rem' }}>{editState.nameError}</span>}
                    </div>
                    <div>
                      <label htmlFor={`edit-desc-${habit.id}`} style={{ display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>Description (optional)</label>
                      <textarea
                        id={`edit-desc-${habit.id}`}
                        value={editState.description}
                        onChange={(e) => setEditState((s) => ({ ...s, description: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        rows={2}
                        aria-invalid={!!editState.descError}
                      />
                      {editState.descError && <span role="alert" style={{ color: '#dc2626', fontSize: '0.8rem' }}>{editState.descError}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit">Save</button>
                      <button type="button" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{habit.name}</div>
                      {habit.description && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{habit.description}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button type="button" onClick={() => startEdit(habit)}>Edit</button>
                      <button type="button" onClick={() => handleDelete(habit)}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Add new habit */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <h3 style={{ margin: '0 0 10px' }}>Add New Habit</h3>
          <form onSubmit={submitAdd} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label htmlFor="new-habit-name" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>Name</label>
              <input
                id="new-habit-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Morning run"
                style={{ width: '100%', boxSizing: 'border-box' }}
                aria-invalid={!!newNameError}
              />
              {newNameError && <span role="alert" style={{ color: '#dc2626', fontSize: '0.8rem' }}>{newNameError}</span>}
            </div>
            <div>
              <label htmlFor="new-habit-desc" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>Description (optional)</label>
              <textarea
                id="new-habit-desc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Optional description"
                style={{ width: '100%', boxSizing: 'border-box' }}
                rows={2}
                aria-invalid={!!newDescError}
              />
              {newDescError && <span role="alert" style={{ color: '#dc2626', fontSize: '0.8rem' }}>{newDescError}</span>}
            </div>
            <button type="submit" style={{ alignSelf: 'flex-start' }}>+ Add Habit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
