import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { CompletionChart } from './CompletionChart';

// Chart.js requires a canvas implementation; mock it for jsdom
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    canvas: { width: 0, height: 0 },
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: [] })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

const dateRange = ['2024-04-15', '2024-04-16', '2024-04-17'];
const completionsByDate: Record<string, number> = {
  '2024-04-15': 2,
  '2024-04-16': 1,
};

describe('CompletionChart', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <CompletionChart
        dateRange={dateRange}
        completionsByDate={completionsByDate}
        totalHabits={3}
      />
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders a canvas element', () => {
    const { container } = render(
      <CompletionChart
        dateRange={dateRange}
        completionsByDate={completionsByDate}
        totalHabits={3}
      />
    );
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('renders with empty completions', () => {
    const { container } = render(
      <CompletionChart
        dateRange={dateRange}
        completionsByDate={{}}
        totalHabits={3}
      />
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders with empty dateRange', () => {
    const { container } = render(
      <CompletionChart
        dateRange={[]}
        completionsByDate={{}}
        totalHabits={0}
      />
    );
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
