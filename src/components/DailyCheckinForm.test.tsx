import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DailyCheckinForm } from './DailyCheckinForm';
import type { Habit } from '../types';

const makeHabit = (id: string, name: string): Habit => ({
  id,
  name,
  description: '',
  createdAt: '2024-01-01T00:00:00.000Z',
});

const habits = [
  makeHabit('h1', 'Exercise'),
  makeHabit('h2', 'Read'),
  makeHabit('h3', 'Meditate'),
];

describe('DailyCheckinForm', () => {
  it('renders a checkbox for each habit', () => {
    render(
      <DailyCheckinForm
        habits={habits}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.getByLabelText('Exercise')).toBeInTheDocument();
    expect(screen.getByLabelText('Read')).toBeInTheDocument();
    expect(screen.getByLabelText('Meditate')).toBeInTheDocument();
  });

  it('pre-checks habits in existingCompletions', () => {
    render(
      <DailyCheckinForm
        habits={habits}
        existingCompletions={new Set(['h1', 'h3'])}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Exercise')).toBeChecked();
    expect(screen.getByLabelText('Read')).not.toBeChecked();
    expect(screen.getByLabelText('Meditate')).toBeChecked();
  });

  it('shows empty-state message when habits array is empty', () => {
    render(
      <DailyCheckinForm
        habits={[]}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        'You have no habits yet. Create a habit first to start logging.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('calls onSubmit with checked IDs then onClose on submit', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <DailyCheckinForm
        habits={habits}
        existingCompletions={new Set(['h1'])}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    );

    // Toggle h2 on, h1 stays checked
    fireEvent.click(screen.getByLabelText('Read'));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith(expect.arrayContaining(['h1', 'h2']));
    expect(onSubmit.mock.calls[0][0]).toHaveLength(2);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn();

    render(
      <DailyCheckinForm
        habits={habits}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('toggling a checkbox changes its checked state', () => {
    render(
      <DailyCheckinForm
        habits={habits}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const checkbox = screen.getByLabelText('Exercise');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
