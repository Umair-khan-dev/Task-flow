import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  Users,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Project, ProjectStatus } from '../types';
import { cn, formatDate, isOverdue } from '../lib/utils';
import { useToast } from '../components/ui/ToastProvider';

export const Projects: React.FC = () => {
  const { toast } = useToast();

  const projects = useStore((s) => s.projects);
  const tasks = useStore((s) => s.tasks);
  const members = useStore((s) => s.members);
  const deleteProject = useStore((s) => s.deleteProject);
  const setCreateProjectModalOpen = useStore((s) => s.setCreateProjectModalOpen);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = (id: string, name: string) => {
    deleteProject(id);
    setProjectToDelete(null);
    toast({
      title: 'Project Deleted',
      description: `"${name}" and its associated tasks have been removed.`
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            Projects Portfolio
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {filteredProjects.length} projects
            </span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Architectural initiatives, cross-functional roadmaps, and delivery schedules
          </p>
        </div>

        <button
          onClick={() => setCreateProjectModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and View Toggle Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, key or description..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>

          {/* Grid / List Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              )}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              )}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setProjectToDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 z-10 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Delete Project
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Are you sure you want to delete this project? All associated tasks will also be removed. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const p = projects.find((x) => x.id === projectToDelete);
                  if (p) handleDelete(p.id, p.name);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const pTasks = tasks.filter((t) => t.projectId === p.id);
            const pCompleted = pTasks.filter((t) => t.status === 'completed').length;
            const progress = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;
            const pMembers = members.filter((m) => p.memberIds.includes(m.id));
            const lead = members.find((m) => m.id === p.leadId);

            return (
              <div
                key={p.id}
                className="group p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:border-rose-500/50 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.key}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 capitalize">
                        {p.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(p.id);
                        }}
                        className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <Link to={`/projects/${p.id}`} className="block group-hover:text-rose-500">
                    <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-rose-500 transition-colors">
                      {p.name}
                    </h2>
                  </Link>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Metrics & Progress */}
                <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        {pCompleted}/{pTasks.length} tasks
                      </span>
                    </div>
                    <span className="font-mono font-bold text-rose-500">{progress}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {pMembers.map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          title={`${m.name} (${m.role})`}
                          className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                        />
                      ))}
                    </div>

                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 font-semibold">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Key</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredProjects.map((p) => {
                const pTasks = tasks.filter((t) => t.projectId === p.id);
                const pCompleted = pTasks.filter((t) => t.status === 'completed').length;
                const progress = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;
                const pMembers = members.filter((m) => p.memberIds.includes(m.id));

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/projects/${p.id}`}
                        className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-rose-500 transition-colors flex items-center gap-2"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span>{p.name}</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-neutral-500">
                      {p.key}
                    </td>

                    <td className="py-3.5 px-4 capitalize text-neutral-700 dark:text-neutral-300">
                      {p.status.replace('_', ' ')}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-rose-500">
                          {progress}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {pMembers.slice(0, 3).map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt={m.name}
                            className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-neutral-500">
                      {formatDate(p.dueDate)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${p.id}`}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setProjectToDelete(p.id)}
                          className="p-1 text-neutral-400 hover:text-red-500 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
