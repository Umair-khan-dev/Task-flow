import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  CheckSquare,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Task, TaskStatus } from '../types';
import { cn, formatDate, isOverdue, getPriorityColor, getStatusInfo, triggerConfetti } from '../lib/utils';
import { useToast } from '../components/ui/ToastProvider';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const projects = useStore((s) => s.projects);
  const tasks = useStore((s) => s.tasks);
  const members = useStore((s) => s.members);
  const updateTask = useStore((s) => s.updateTask);
  const updateProject = useStore((s) => s.updateProject);
  const deleteProject = useStore((s) => s.deleteProject);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);
  const openCreateTaskModal = useStore((s) => s.openCreateTaskModal);

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
          Project not found
        </h2>
        <Link to="/projects" className="text-xs text-rose-500 font-semibold hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'completed');
  const inProgressTasks = projectTasks.filter((t) => t.status === 'in_progress');
  const overdueTasks = projectTasks.filter((t) => isOverdue(t.dueDate, t.status));
  const progressPercent =
    projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;

  const projectLead = members.find((m) => m.id === project.leadId);
  const projectMembers = members.filter((m) => project.memberIds.includes(m.id));

  const filteredTasks = projectTasks.filter((t) => {
    if (activeTab === 'active') return t.status !== 'completed';
    if (activeTab === 'completed') return t.status === 'completed';
    return true;
  });

  const handleSaveEdit = () => {
    if (editName.trim()) {
      updateProject(project.id, {
        name: editName.trim(),
        description: editDesc.trim()
      });
      toast({ title: 'Project Updated', description: 'Changes saved successfully.' });
    }
    setIsEditing(false);
  };

  const handleToggleTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: TaskStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    updateTask(task.id, { status: newStatus });
    if (newStatus === 'completed') {
      triggerConfetti();
      toast({ title: 'Task Completed! 🎉' });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Hero Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5">
              <span
                className="px-2.5 py-1 rounded text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: project.color }}
              >
                {project.key}
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 capitalize">
                {project.status.replace('_', ' ')}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-lg font-bold px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-500 text-white"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {project.name}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEditName(project.name);
                setEditDesc(project.description);
                setIsEditing(!isEditing);
              }}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => openCreateTaskModal({ projectId: project.id })}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Project Meta Bar: Lead, Due Date, Budget */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 text-xs">
          {projectLead && (
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Lead:</span>
              <img
                src={projectLead.avatar}
                alt={projectLead.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {projectLead.name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>
              Target: <strong className="text-neutral-700 dark:text-neutral-300 font-mono">{formatDate(project.dueDate)}</strong>
            </span>
          </div>

          {project.budget && (
            <div className="flex items-center gap-1 text-neutral-400 font-mono">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>${project.budget.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Team:</span>
            <div className="flex -space-x-1.5 overflow-hidden">
              {projectMembers.map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  title={m.name}
                  className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Progress KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80">
          <span className="text-[11px] font-medium text-neutral-400">Total Tasks</span>
          <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
            {projectTasks.length}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80">
          <span className="text-[11px] font-medium text-neutral-400">Completed</span>
          <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            {completedTasks.length} ({progressPercent}%)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80">
          <span className="text-[11px] font-medium text-neutral-400">In Progress</span>
          <p className="text-2xl font-bold font-mono text-blue-500 mt-1">
            {inProgressTasks.length}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80">
          <span className="text-[11px] font-medium text-neutral-400">Overdue</span>
          <p className="text-2xl font-bold font-mono text-red-500 mt-1">
            {overdueTasks.length}
          </p>
        </div>
      </div>

      {/* Tasks Table for this project */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Project Work Items ({filteredTasks.length})
            </h2>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                activeTab === 'all' ? 'bg-white dark:bg-neutral-700 shadow-xs' : 'text-neutral-500'
              )}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                activeTab === 'active' ? 'bg-white dark:bg-neutral-700 shadow-xs' : 'text-neutral-500'
              )}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                activeTab === 'completed' ? 'bg-white dark:bg-neutral-700 shadow-xs' : 'text-neutral-500'
              )}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 font-semibold">
                <th className="py-3 px-4 w-10">Done</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-neutral-400">
                    No tasks in this view.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => {
                  const assignee = members.find((m) => m.id === t.assigneeId);
                  const pColor = getPriorityColor(t.priority);
                  const statusInfo = getStatusInfo(t.status);
                  const isDone = t.status === 'completed';

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleToggleTask(t, e)}
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
                      <td className="py-3.5 px-4 font-semibold group-hover:text-rose-500">
                        {t.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded border uppercase font-mono',
                            pColor.bg,
                            pColor.text,
                            pColor.border
                          )}
                        >
                          {pColor.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4">
                        {assignee && (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span>{assignee.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-neutral-500">
                        {formatDate(t.dueDate)}
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
