import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrackingGrid, formatDateLabel } from './TrackingGrid';
import type { Habit, Completion } from '../types';

const habits: Habit[] = [
  { id: 'h1', name: 'Exercise', description: '', createdAt: '2024-01-01' },
  { id: 'h2', name: 'Read', description: '', createdAt: '2024-01-01' },
];

const dateRange = ['2024-04-15', '2024-04-16', '2024-04-17'];

const completions: Completion[] = [
  { habitId: 'h1', date: '2024-04-15' },
  { habitId: 'h2', date: '2024-04-16' },
];

describe('formatDateLabel', () => {
  it('formats ISO date to MM/DD', () => {
    expect(formatDateLabel('2024-04-16')).toBe('04/16');
  });

  it('pads single-digit month and day', () => {
    expect(formatDateLabel('2024-01-05')).toBe('01/05');
  });

  it('handles December 31', () => {
    expect(formatDateLabel('2024-12-31')).toBe('12/31');
  });
});

describe('TrackingGrid', () => {
  it('renders date headers in order', () => {
    render(<TrackingGrid habits={habits} completions={completions} dateRange={dateRange} />);
    const headers = screen.getAllByRole('columnheader');
    // First is "Habits", then dates in order
    expect(headers[0].textContent).toBe('Habits');
    expect(headers[1].textContent).toBe('04/15');
    expect(headers[2].textContent).toBe('04/16');
    expect(headers[3].textContent).toBe('04/17');
  });

  it('renders one row per habit', () => {
    render(<TrackingGrid habits={habits} completions={completions} dateRange={dateRange} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 2 habit rows
    expect(rows).toHaveLength(3);
  });

  it('displays habit names on the left (first cell of each row)', () => {
    render(<TrackingGrid habits={habits} completions={completions} dateRange={dateRange} />);
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
  });

  it('shows O for completed (habitId, date) pairs', () => {
    render(<TrackingGrid habits={habits} completions={completions} dateRange={dateRange} />);
    const rows = screen.getAllByRole('row');
    // Row 1 = Exercise: first td is name, then 04/15 → O, 04/16 → X, 04/17 → X
    const exerciseCells = rows[1].querySelectorAll('td');
    expect(exerciseCells[1].textContent).toBe('O');
    expect(exerciseCells[2].textContent).toBe('X');
    expect(exerciseCells[3].textContent).toBe('X');
  });

  it('shows X for missing completions', () => {
    render(<TrackingGrid habits={habits} completions={completions} dateRange={dateRange} />);
    const rows = screen.getAllByRole('row');
    // Row 2 = Read: first td is name, then 04/15 → X, 04/16 → O, 04/17 → X
    const readCells = rows[2].querySelectorAll('td');
    expect(readCells[1].textContent).toBe('X');
    expect(readCells[2].textContent).toBe('O');
    expect(readCells[3].textContent).toBe('X');
  });

  it('renders empty grid with no habits', () => {
    render(<TrackingGrid habits={[]} completions={[]} dateRange={dateRange} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1); // only header row
  });

  it('cells are read-only (no click handlers on cells)', () => {
    const { container } = render(
      <TrackingGrid habits={habits} completions={completions} dateRange={dateRange} />
    );
    const cells = container.querySelectorAll('td');
    cells.forEach((cell) => {
      expect(cell.onclick).toBeNull();
    });
  });
});
