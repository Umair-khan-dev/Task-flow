import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Tag
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { getPriorityColor, cn, formatDate, isOverdue } from '../lib/utils';

export const CalendarView: React.FC = () => {
  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);
  const openCreateTaskModal = useStore((s) => s.openCreateTaskModal);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 15)); // Oct 2026
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
  };

  const goToday = () => {
    setCurrentDate(new Date(2026, 9, 15));
  };

  // Month grid calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate calendar cells (6 rows x 7 cols = 42 cells)
  const calendarCells: { dateString: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, d);
    const dateString = prevMonthDate.toISOString().split('T')[0];
    calendarCells.push({ dateString, dayNum: d, isCurrentMonth: false, isToday: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const dateString = curDate.toISOString().split('T')[0];
    const isToday = d === 15 && month === 9 && year === 2026;
    calendarCells.push({ dateString, dayNum: d, isCurrentMonth: true, isToday });
  }

  // Next month leading days
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const dateString = nextMonthDate.toISOString().split('T')[0];
    calendarCells.push({ dateString, dayNum: d, isCurrentMonth: false, isToday: false });
  }

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

  // Group tasks by dueDate
  const tasksByDate: Record<string, typeof tasks> = {};
  tasks.forEach((t) => {
    if (t.dueDate) {
      if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
      tasksByDate[t.dueDate].push(t);
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            Sprint Calendar
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Deliverables timeline and release milestones
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800 rounded-xl p-1">
            <button
              onClick={prevPeriod}
              className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToday}
              className="px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextPeriod}
              className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 min-w-[140px] text-center font-mono">
            {monthName}
          </span>

          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 text-center py-2.5 text-xs font-bold text-neutral-500 dark:text-neutral-400">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* 42 Calendar Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-neutral-100 dark:divide-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800">
          {calendarCells.map((cell) => {
            const dayTasks = tasksByDate[cell.dateString] || [];

            return (
              <div
                key={cell.dateString}
                onClick={() => openCreateTaskModal()}
                className={cn(
                  'min-h-[110px] p-2 flex flex-col justify-between transition-colors cursor-pointer group hover:bg-neutral-50/80 dark:hover:bg-neutral-800/20',
                  !cell.isCurrentMonth && 'opacity-35 bg-neutral-50/30 dark:bg-neutral-950/20',
                  cell.isToday && 'bg-rose-500/[0.03] dark:bg-rose-500/[0.06]'
                )}
              >
                {/* Cell Top Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'text-xs font-bold font-mono w-6 h-6 rounded-full flex items-center justify-center',
                      cell.isToday
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/40'
                        : cell.isCurrentMonth
                        ? 'text-neutral-800 dark:text-neutral-200'
                        : 'text-neutral-400'
                    )}
                  >
                    {cell.dayNum}
                  </span>

                  <span className="opacity-0 group-hover:opacity-100 text-[10px] text-rose-500 font-semibold transition-opacity">
                    + Add
                  </span>
                </div>

                {/* Day Tasks List */}
                <div className="space-y-1 flex-1 overflow-hidden">
                  {dayTasks.slice(0, 3).map((task) => {
                    const p = projects.find((proj) => proj.id === task.projectId);
                    const pColor = getPriorityColor(task.priority);

                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTaskId(task.id);
                        }}
                        className="px-1.5 py-1 rounded-md text-[10px] font-medium truncate flex items-center gap-1.5 transition-transform hover:scale-[1.02] shadow-2xs border bg-white dark:bg-neutral-800/90 border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200"
                        title={task.title}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', pColor.dot)} />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] font-mono text-neutral-400 px-1">
                      +{dayTasks.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
