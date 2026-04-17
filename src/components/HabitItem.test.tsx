import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HabitItem } from './HabitItem';
import type { Habit } from '../types/index';

const mockHabit: Habit = {
  id: 'habit-1',
  name: 'Exercise',
  description: 'Daily workout',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('HabitItem', () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays habit name and streak count', () => {
    render(
      <HabitItem
        habit={mockHabit}
        streak={5}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('🔥 5 day streak')).toBeInTheDocument();
  });

  it('applies "completed" class when isCompletedToday is true', () => {
    const { container } = render(
      <HabitItem
        habit={mockHabit}
        streak={3}
        isCompletedToday={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(container.firstChild).toHaveClass('completed');
  });

  it('does not apply "completed" class when isCompletedToday is false', () => {
    const { container } = render(
      <HabitItem
        habit={mockHabit}
        streak={3}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(container.firstChild).not.toHaveClass('completed');
  });

  it('shows edit and delete buttons in normal mode', () => {
    render(
      <HabitItem
        habit={mockHabit}
        streak={0}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('enters edit mode when Edit button is clicked', () => {
    render(
      <HabitItem
        habit={mockHabit}
        streak={0}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByDisplayValue('Exercise')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Daily workout')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onEdit with updated values on valid submit', () => {
    render(
      <HabitItem
        habit={mockHabit}
        streak={0}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const nameInput = screen.getByDisplayValue('Exercise');
    fireEvent.change(nameInput, { target: { value: 'Running' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onEdit).toHaveBeenCalledWith('habit-1', { name: 'Running', description: 'Daily workout' });
  });

  it('shows validation error and does not call onEdit for empty name', () => {
    render(
      <HabitItem
        habit={mockHabit}
        streak={0}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const nameInput = screen.getByDisplayValue('Exercise');
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('cancels edit and restores original values', () => {
    render(
      <HabitItem
        habit={mockHabit}
        streak={0}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const nameInput = screen.getByDisplayValue('Exercise');
    fireEvent.change(nameInput, { target: { value: 'Changed Name' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('shows confirm dialog and calls onDelete when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <HabitItem
        habit={mockHabit}
        streak={0}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(window.confirm).toHaveBeenCalledWith(
      "Delete 'Exercise'? This will also remove all completion history for this habit."
    );
    expect(onDelete).toHaveBeenCalledWith('habit-1');
  });

  it('does not call onDelete when confirm is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <HabitItem
        habit={mockHabit}
        streak={0}
        isCompletedToday={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onDelete).not.toHaveBeenCalled();
  });
});
