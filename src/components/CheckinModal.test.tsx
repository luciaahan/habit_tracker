import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckinModal } from './CheckinModal';
import type { Habit } from '../types';

const makeHabit = (id: string, name: string): Habit => ({
  id,
  name,
  description: '',
  createdAt: '2024-01-01T00:00:00.000Z',
});

const habits = [makeHabit('h1', 'Exercise'), makeHabit('h2', 'Read')];
const TODAY = '2024-06-15';

describe('CheckinModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <CheckinModal
        isOpen={false}
        today={TODAY}
        date={TODAY}
        habits={habits}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog overlay when isOpen is true', () => {
    render(
      <CheckinModal
        isOpen={true}
        today={TODAY}
        date={TODAY}
        habits={habits}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('renders DailyCheckinForm when date equals today', () => {
    render(
      <CheckinModal
        isOpen={true}
        today={TODAY}
        date={TODAY}
        habits={habits}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('renders past-date message when date does not equal today', () => {
    render(
      <CheckinModal
        isOpen={true}
        today={TODAY}
        date="2024-06-10"
        habits={habits}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('Past entries cannot be modified.')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked on past date', () => {
    const onClose = vi.fn();
    render(
      <CheckinModal
        isOpen={true}
        today={TODAY}
        date="2024-06-10"
        habits={habits}
        existingCompletions={new Set()}
        onSubmit={vi.fn()}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });
});
