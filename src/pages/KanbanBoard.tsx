import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Tag,
  ArrowUpDown,
  MoreHorizontal,
  ChevronDown,
  CheckSquare
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { TaskStatus, Priority, Task } from '../types';
import { cn, formatDate, isOverdue, getPriorityColor, triggerConfetti } from '../lib/utils';
import { useToast } from '../components/ui/ToastProvider';

interface ColumnDef {
  id: TaskStatus;
  title: string;
  color: string;
  accent: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'todo', title: 'To Do', color: 'border-slate-500/40', accent: 'bg-slate-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-blue-500/40', accent: 'bg-blue-500' },
  { id: 'in_review', title: 'In Review', color: 'border-purple-500/40', accent: 'bg-purple-500' },
  { id: 'completed', title: 'Completed', color: 'border-emerald-500/40', accent: 'bg-emerald-500' }
];

export const KanbanBoard: React.FC = () => {
  const { toast } = useToast();

  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const members = useStore((s) => s.members);
  const moveTask = useStore((s) => s.moveTask);
  const updateTask = useStore((s) => s.updateTask);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);
  const openCreateTaskModal = useStore((s) => s.openCreateTaskModal);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'dueDate' | 'priority'>('default');

  // Dragging state
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedProject !== 'all' && t.projectId !== selectedProject) return false;
    if (selectedAssignee !== 'all' && t.assigneeId !== selectedAssignee) return false;
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  // Sort tasks
  const sortTasks = (taskList: Task[]) => {
    return [...taskList].sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== targetStatus) {
        moveTask(taskId, targetStatus);
        if (targetStatus === 'completed') {
          triggerConfetti();
          toast({ title: 'Task Completed! 🎉', description: `"${task.title}" moved to Completed.` });
        } else {
          toast({ title: 'Status Updated', description: `Task moved to ${targetStatus.replace('_', ' ')}.` });
        }
      }
    }
    setDraggingTaskId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-full mx-auto">
      {/* Board Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            Kanban Board
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {filteredTasks.length} tasks
            </span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Drag and drop tasks between stages to advance your team&apos;s sprint
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tasks or tags..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#11141c] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#11141c] text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#11141c] text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#11141c] text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="default">Sort: Recent</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
          </select>

          {/* Add Task Button */}
          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-sm shadow-rose-500/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 4 Kanban Columns Layout (Horizontally scrollable on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto pb-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = sortTasks(filteredTasks.filter((t) => t.status === col.id));
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={cn(
                'flex flex-col rounded-2xl bg-neutral-100/70 dark:bg-[#0c0e14]/70 border transition-all min-w-[280px]',
                isOver
                  ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/[0.03] dark:bg-rose-500/[0.05]'
                  : 'border-neutral-200 dark:border-neutral-800/80'
              )}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', col.accent)} />
                  <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {col.title}
                  </h2>
                  <span className="text-[11px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => openCreateTaskModal({ status: col.id })}
                  className="p-1 text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks List Container */}
              <div className="p-2.5 space-y-2.5 min-h-[500px]">
                {colTasks.length === 0 ? (
                  <div className="h-32 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col items-center justify-center text-xs text-neutral-400 gap-1">
                    <span>No tasks in {col.title}</span>
                    <button
                      onClick={() => openCreateTaskModal({ status: col.id })}
                      className="text-rose-500 hover:underline font-medium text-[11px]"
                    >
                      + Create task
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const assignee = members.find((m) => m.id === task.assigneeId);
                    const pColor = getPriorityColor(task.priority);
                    const overdue = isOverdue(task.dueDate, task.status);
                    const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
                    const totalSubtasks = (task.subtasks || []).length;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={cn(
                          'group p-3.5 rounded-xl bg-white dark:bg-[#131620] border border-neutral-200 dark:border-neutral-800/90 shadow-xs hover:border-rose-500/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none space-y-3',
                          draggingTaskId === task.id && 'opacity-40 scale-95'
                        )}
                      >
                        {/* Card Top: Project tag & Priority badge */}
                        <div className="flex items-center justify-between gap-2">
                          {project && (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: project.color }}
                            >
                              {project.key}
                            </span>
                          )}
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
                        </div>

                        {/* Title */}
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug">
                          {task.title}
                        </h3>

                        {/* Description snippet if available */}
                        {task.description && (
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer: Subtasks, Due Date & Assignee Avatar */}
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                          <div className="flex items-center gap-2.5">
                            {/* Subtask count */}
                            {totalSubtasks > 0 && (
                              <div className="flex items-center gap-1 font-mono">
                                <CheckSquare className="w-3 h-3 text-rose-500" />
                                <span>
                                  {completedSubtasks}/{totalSubtasks}
                                </span>
                              </div>
                            )}

                            {/* Due date */}
                            {task.dueDate && (
                              <div
                                className={cn(
                                  'flex items-center gap-1 font-mono text-[10px]',
                                  overdue && 'text-red-500 font-bold'
                                )}
                              >
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(task.dueDate)}</span>
                              </div>
                            )}
                          </div>

                          {/* Assignee Avatar */}
                          {assignee && (
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              title={assignee.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700"
                            />
                          )}
                        </div>

                        {/* Quick Mobile/Tablet Move Select */}
                        <div className="pt-1 flex items-center justify-between md:hidden">
                          <span className="text-[10px] text-neutral-400">Move:</span>
                          <select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              moveTask(task.id, e.target.value as TaskStatus);
                              toast({ title: 'Task moved' });
                            }}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="in_review">In Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
