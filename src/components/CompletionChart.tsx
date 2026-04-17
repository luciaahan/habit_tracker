import type { TooltipItem } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatDateLabel } from './TrackingGrid';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface CompletionChartProps {
  dateRange: string[];
  completionsByDate: Record<string, number>;
  totalHabits: number;
}

export function CompletionChart({ dateRange, completionsByDate, totalHabits }: CompletionChartProps) {
  const labels = dateRange.map(formatDateLabel);
  const dataPoints = dateRange.map((date) => completionsByDate[date] ?? 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Completions',
        data: dataPoints,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Completions',
      },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'line'>[]) => items[0]?.label ?? '',
          label: (item: TooltipItem<'line'>) =>
            `Completions: ${item.parsed.y ?? 0}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: totalHabits,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
