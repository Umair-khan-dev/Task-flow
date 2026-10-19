import React, { useState } from 'react';
import {
  X,
  Trash2,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Plus,
  AlertTriangle,
  FolderKanban,
  Flag
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Priority, TaskStatus } from '../../types';
import { cn, formatDate, isOverdue, getPriorityColor, getStatusInfo, triggerConfetti } from '../../lib/utils';
import { useToast } from '../ui/ToastProvider';

export const TaskDetailModal: React.FC = () => {
  const { toast } = useToast();

  const selectedTaskId = useStore((s) => s.selectedTaskId);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);
  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const members = useStore((s) => s.members);
  const updateTask = useStore((s) => s.updateTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const toggleSubtask = useStore((s) => s.toggleSubtask);
  const addComment = useStore((s) => s.addComment);

  const [commentText, setCommentText] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const task = tasks.find((t) => t.id === selectedTaskId);

  if (!selectedTaskId || !task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const assignee = members.find((m) => m.id === task.assigneeId);
  const statusInfo = getStatusInfo(task.status);
  const priorityInfo = getPriorityColor(task.priority);
  const overdue = isOverdue(task.dueDate, task.status);

  const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
    if (newStatus === 'completed') {
      triggerConfetti();
      toast({ title: 'Task Completed! 🎉', description: 'Moved to completed column.' });
    } else {
      toast({ title: 'Status Updated', description: `Task is now ${newStatus.replace('_', ' ')}.` });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText.trim());
    setCommentText('');
    toast({ title: 'Comment Added' });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    const newSubtasks = [
      ...(task.subtasks || []),
      { id: `sub-${Date.now()}`, title: newSubtaskText.trim(), completed: false }
    ];
    updateTask(task.id, { subtasks: newSubtasks });
    setNewSubtaskText('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const newSubtasks = (task.subtasks || []).filter((s) => s.id !== subtaskId);
    updateTask(task.id, { subtasks: newSubtasks });
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    toast({ title: 'Task Deleted', description: `"${task.title}" was removed.` });
    setSelectedTaskId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setSelectedTaskId(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-black/40 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2 text-xs">
            {project && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-white font-medium shadow-xs"
                style={{ backgroundColor: project.color }}
              >
                <span>{project.key}</span>
              </span>
            )}
            <span className="text-neutral-400 font-mono text-[11px]">{task.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTaskId(null)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Warning */}
        {showDeleteConfirm && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-3 flex items-center justify-between text-xs text-red-600 dark:text-red-400">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Are you sure you want to permanently delete this task?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 rounded-md hover:bg-red-500/10 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-3 py-1 rounded-md bg-red-600 text-white font-bold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Title & Description */}
          <div className="space-y-3">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 text-lg font-bold px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (editTitle.trim()) {
                      updateTask(task.id, { title: editTitle.trim() });
                    }
                    setIsEditingTitle(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500 text-white hover:bg-rose-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <h2
                onClick={() => {
                  setEditTitle(task.title);
                  setIsEditingTitle(true);
                }}
                className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight hover:text-rose-500 cursor-pointer transition-colors"
                title="Click to edit title"
              >
                {task.title}
              </h2>
            )}

            <div>
              <textarea
                rows={3}
                value={editDesc || task.description}
                onChange={(e) => setEditDesc(e.target.value)}
                onBlur={() => {
                  if (editDesc && editDesc !== task.description) {
                    updateTask(task.id, { description: editDesc });
                    toast({ title: 'Description saved' });
                  }
                }}
                placeholder="Add a detailed description..."
                className="w-full text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 bg-neutral-50/50 dark:bg-neutral-900/50 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800/80 focus:outline-none focus:ring-2 focus:ring-rose-500/40 resize-none transition-all"
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
            {/* Status */}
            <div>
              <span className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Status
              </span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <span className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Priority
              </span>
              <select
                value={task.priority}
                onChange={(e) => {
                  updateTask(task.id, { priority: e.target.value as Priority });
                  toast({ title: 'Priority updated' });
                }}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500 capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <span className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Assignee
              </span>
              <select
                value={task.assigneeId}
                onChange={(e) => {
                  updateTask(task.id, { assigneeId: e.target.value });
                  toast({ title: 'Assignee updated' });
                }}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <span className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Due Date
              </span>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => {
                  updateTask(task.id, { dueDate: e.target.value });
                  toast({ title: 'Due date updated' });
                }}
                className={cn(
                  'w-full text-xs font-mono px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-500',
                  overdue ? 'text-red-500 font-bold' : 'text-neutral-800 dark:text-neutral-200'
                )}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Tags
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                >
                  <Tag className="w-3 h-3 text-rose-500" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Subtasks / Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>Checklist</span>
                <span className="text-xs font-mono text-neutral-400">
                  ({completedSubtasks}/{totalSubtasks})
                </span>
              </span>
              {totalSubtasks > 0 && (
                <span className="text-xs font-mono text-rose-500 font-semibold">
                  {progressPercent}%
                </span>
              )}
            </div>

            {totalSubtasks > 0 && (
              <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            <div className="space-y-1.5">
              {(task.subtasks || []).map((st) => (
                <div
                  key={st.id}
                  className="group flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => toggleSubtask(task.id, st.id)}
                      className="w-4 h-4 rounded text-rose-500 accent-rose-500 cursor-pointer"
                    />
                    <span
                      className={cn(
                        'text-xs transition-colors truncate',
                        st.completed
                          ? 'line-through text-neutral-400 dark:text-neutral-500'
                          : 'text-neutral-800 dark:text-neutral-200'
                      )}
                    >
                      {st.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity p-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                placeholder="Add subtask item..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Activity / Comments Thread */}
          <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-500" />
              <span>Discussion & Updates ({(task.comments || []).length})</span>
            </span>

            {/* Comments List */}
            <div className="space-y-3">
              {(task.comments || []).map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {c.authorName}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment or update..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-rose-500 hover:bg-rose-600 transition-colors flex items-center gap-1.5 shadow-sm shadow-rose-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
