import { useState } from 'react';
import './App.css';
import { useHabitStore } from './hooks/useHabitStore';
import { MainView } from './components/MainView';
import { EditHabitsModal } from './components/EditHabitsModal';

export default function App() {
  const store = useHabitStore();
  const [isEditHabitsOpen, setIsEditHabitsOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);

  return (
    <div>
      {/* Top header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '16px',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.94rem', flex: 1 }}>Habit Tracker</h1>
        <button type="button" onClick={() => setIsEditHabitsOpen(true)}>
          Edit Habits
        </button>
        <button type="button" onClick={() => setIsCheckinOpen(true)}>
          Log Today
        </button>
      </div>

      {isEditHabitsOpen && (
        <EditHabitsModal
          habits={store.sortedHabits}
          onAddHabit={store.addHabit}
          onEditHabit={store.editHabit}
          onDeleteHabit={store.removeHabit}
          onClose={() => setIsEditHabitsOpen(false)}
        />
      )}

      <MainView
        sortedHabits={store.sortedHabits}
        completions={store.completions}
        streaks={store.streaks}
        todayCompletions={store.todayCompletions}
        dateRange={store.dateRange}
        completionsByDate={store.completionsByDate}
        today={store.today}
        selectedMonth={store.selectedMonth}
        errorMessage={store.errorMessage}
        isCheckinOpen={isCheckinOpen}
        onSubmitCheckin={store.submitCheckin}
        onClearError={store.clearError}
        onSetSelectedMonth={store.setSelectedMonth}
        onCloseCheckin={() => setIsCheckinOpen(false)}
      />
    </div>
  );
}
