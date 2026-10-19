import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Tag,
  AlertTriangle,
  Calendar,
  User
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Task, TaskStatus, Priority } from '../types';
import { cn, formatDate, isOverdue, isDueToday, getPriorityColor, getStatusInfo, triggerConfetti } from '../lib/utils';
import { useToast } from '../components/ui/ToastProvider';

type TabType = 'all' | 'assigned_to_me' | 'today' | 'upcoming' | 'overdue' | 'completed';

export const MyTasks: React.FC = () => {
  const { toast } = useToast();

  const user = useStore((s) => s.user);
  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const members = useStore((s) => s.members);
  const updateTask = useStore((s) => s.updateTask);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);
  const openCreateTaskModal = useStore((s) => s.openCreateTaskModal);

  const [activeTab, setActiveTab] = useState<TabType>('assigned_to_me');
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'status'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter tasks based on tab & filters
  const filteredTasks = tasks.filter((t) => {
    // Tab filter
    if (activeTab === 'assigned_to_me' && t.assigneeId !== user.id) return false;
    if (activeTab === 'today') {
      if (!isDueToday(t.dueDate) || t.status === 'completed') return false;
    }
    if (activeTab === 'upcoming') {
      if (!t.dueDate || isOverdue(t.dueDate, t.status) || isDueToday(t.dueDate) || t.status === 'completed') return false;
    }
    if (activeTab === 'overdue' && !isOverdue(t.dueDate, t.status)) return false;
    if (activeTab === 'completed' && t.status !== 'completed') return false;

    // Dropdown filters
    if (filterProject !== 'all' && t.projectId !== filterProject) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  // Sort
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'dueDate') {
      cmp = new Date(a.dueDate || '9999').getTime() - new Date(b.dueDate || '9999').getTime();
    } else if (sortBy === 'priority') {
      const pOrder: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      cmp = pOrder[b.priority] - pOrder[a.priority];
    } else if (sortBy === 'title') {
      cmp = a.title.localeCompare(b.title);
    } else if (sortBy === 'status') {
      cmp = a.status.localeCompare(b.status);
    }
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const handleToggleComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: TaskStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    updateTask(task.id, { status: newStatus });
    if (newStatus === 'completed') {
      triggerConfetti();
      toast({ title: 'Task Completed! 🎉', description: `"${task.title}" has been completed.` });
    } else {
      toast({ title: 'Task Reopened', description: `"${task.title}" moved back to in progress.` });
    }
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'assigned_to_me', label: 'Assigned to Me', count: tasks.filter((t) => t.assigneeId === user.id && t.status !== 'completed').length },
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'today', label: 'Due Today', count: tasks.filter((t) => isDueToday(t.dueDate) && t.status !== 'completed').length },
    { id: 'upcoming', label: 'Upcoming', count: tasks.filter((t) => !isOverdue(t.dueDate, t.status) && !isDueToday(t.dueDate) && t.status !== 'completed').length },
    { id: 'overdue', label: 'Overdue', count: tasks.filter((t) => isOverdue(t.dueDate, t.status)).length },
    { id: 'completed', label: 'Completed', count: tasks.filter((t) => t.status === 'completed').length }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            My Tasks
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {sortedTasks.length} items
            </span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your personal backlog, sprint obligations, and track deliverables
          </p>
        </div>

        <button
          onClick={() => openCreateTaskModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Tabs / Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0',
              activeTab === tab.id
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'text-[10px] font-mono px-1.5 py-0.2 rounded-full',
                activeTab === tab.id
                  ? 'bg-rose-500/10 text-rose-500 font-bold'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or tag..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      <div className="rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 font-semibold">
                <th className="py-3 px-4 w-10">Done</th>
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-neutral-400">
                    No tasks found matching your active filter criteria.
                  </td>
                </tr>
              ) : (
                sortedTasks.map((t) => {
                  const project = projects.find((p) => p.id === t.projectId);
                  const assignee = members.find((m) => m.id === t.assigneeId);
                  const pColor = getPriorityColor(t.priority);
                  const statusInfo = getStatusInfo(t.status);
                  const overdue = isOverdue(t.dueDate, t.status);
                  const isDone = t.status === 'completed';

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleToggleComplete(t, e)}
                          className={cn(
                            'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-neutral-300 dark:border-neutral-700 hover:border-rose-500'
                          )}
                        >
                          {isDone && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                        </button>
                      </td>

                      {/* Title & Tags */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'font-semibold group-hover:text-rose-500 transition-colors',
                              isDone ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-100'
                            )}
                          >
                            {t.title}
                          </span>
                          {t.subtasks?.length > 0 && (
                            <span className="text-[10px] text-neutral-400 font-mono">
                              ({t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length})
                            </span>
                          )}
                        </div>
                        {t.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            {t.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium text-neutral-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Project */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {project ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              {project.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider font-mono',
                            pColor.bg,
                            pColor.text,
                            pColor.border
                          )}
                        >
                          {pColor.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'text-[11px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1.5',
                            statusInfo.bg,
                            statusInfo.color
                          )}
                        >
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusInfo.dot)} />
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-neutral-700 dark:text-neutral-300">
                              {assignee.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-400">Unassigned</span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <span
                          className={cn(
                            'text-xs',
                            overdue ? 'text-red-500 font-bold' : 'text-neutral-600 dark:text-neutral-400'
                          )}
                        >
                          {formatDate(t.dueDate)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
