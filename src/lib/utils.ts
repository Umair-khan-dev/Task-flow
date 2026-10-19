import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';
import { Priority, TaskStatus, ProjectStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'No date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    }).format(date);
  } catch {
    return dateString;
  }
}

export function isOverdue(dueDateString?: string, status?: TaskStatus): boolean {
  if (!dueDateString || status === 'completed') return false;
  try {
    const due = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  } catch {
    return false;
  }
}

export function isDueToday(dueDateString?: string): boolean {
  if (!dueDateString) return false;
  try {
    const due = new Date(dueDateString);
    const today = new Date();
    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    );
  } catch {
    return false;
  }
}

export function getPriorityColor(priority: Priority) {
  switch (priority) {
    case 'urgent':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500',
        label: 'Urgent'
      };
    case 'high':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
        label: 'High'
      };
    case 'medium':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/30',
        dot: 'bg-blue-500',
        label: 'Medium'
      };
    case 'low':
    default:
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
        label: 'Low'
      };
  }
}

export function getStatusInfo(status: TaskStatus) {
  switch (status) {
    case 'todo':
      return {
        label: 'To Do',
        color: 'text-slate-500 dark:text-slate-400',
        bg: 'bg-slate-100 dark:bg-slate-800',
        dot: 'bg-slate-400'
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        dot: 'bg-blue-500'
      };
    case 'in_review':
      return {
        label: 'In Review',
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        dot: 'bg-purple-500'
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        dot: 'bg-emerald-500'
      };
  }
}

export function getProjectStatusInfo(status: ProjectStatus) {
  switch (status) {
    case 'planning':
      return { label: 'Planning', color: 'text-sky-500' };
    case 'active':
      return { label: 'Active', color: 'text-emerald-500' };
    case 'in_review':
      return { label: 'In Review', color: 'text-purple-500' };
    case 'completed':
      return { label: 'Completed', color: 'text-teal-500' };
    case 'on_hold':
      return { label: 'On Hold', color: 'text-amber-500' };
  }
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#cbd5e1']
    });
  } catch (e) {
    // ignore if disabled
  }
}
