import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CheckSquare,
  FolderKanban,
  Kanban,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Plus,
  Sun,
  Moon,
  ArrowRight,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/ToastProvider';

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const isCommandPaletteOpen = useStore((s) => s.isCommandPaletteOpen);
  const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen);
  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const members = useStore((s) => s.members);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);
  const openCreateTaskModal = useStore((s) => s.openCreateTaskModal);
  const setCreateProjectModalOpen = useStore((s) => s.setCreateProjectModalOpen);
  const preferences = useStore((s) => s.preferences);
  const updatePreferences = useStore((s) => s.updatePreferences);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Focus input when open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q)))
    .slice(0, 4);

  const filteredProjects = projects
    .filter((p) => p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q))
    .slice(0, 3);

  const filteredMembers = members
    .filter((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
    .slice(0, 3);

  const quickNav = [
    { label: 'Go to Overview', path: '/', icon: LayoutDashboardIcon },
    { label: 'Go to Kanban Board', path: '/kanban', icon: Kanban },
    { label: 'Go to My Tasks', path: '/my-tasks', icon: CheckSquare },
    { label: 'Go to Projects', path: '/projects', icon: FolderKanban },
    { label: 'Go to Calendar', path: '/calendar', icon: Calendar },
    { label: 'Go to Team Members', path: '/team', icon: Users },
    { label: 'Go to Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Go to Settings', path: '/settings', icon: Settings }
  ].filter((item) => item.label.toLowerCase().includes(q));

  const quickActions = [
    {
      label: 'Create New Task',
      icon: Plus,
      action: () => {
        setCommandPaletteOpen(false);
        openCreateTaskModal();
      }
    },
    {
      label: 'Create New Project',
      icon: Plus,
      action: () => {
        setCommandPaletteOpen(false);
        setCreateProjectModalOpen(true);
      }
    },
    {
      label: preferences.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: preferences.theme === 'dark' ? Sun : Moon,
      action: () => {
        const next = preferences.theme === 'dark' ? 'light' : 'dark';
        updatePreferences({ theme: next });
        toast({ title: `${next === 'dark' ? 'Dark' : 'Light'} Mode Enabled` });
        setCommandPaletteOpen(false);
      }
    }
  ].filter((item) => item.label.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-black/40 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search anything..."
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-neutral-100 dark:divide-neutral-800/40">
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="py-1">
              <span className="px-2.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Actions
              </span>
              <div className="mt-1 space-y-0.5">
                {quickActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.label}
                      onClick={act.action}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-rose-500" />
                        <span>{act.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          {quickNav.length > 0 && (
            <div className="py-1">
              <span className="px-2.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Navigation
              </span>
              <div className="mt-1 space-y-0.5">
                {quickNav.map((nav) => {
                  const Icon = nav.icon;
                  return (
                    <button
                      key={nav.path}
                      onClick={() => {
                        setCommandPaletteOpen(false);
                        navigate(nav.path);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-neutral-400" />
                        <span>{nav.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">{nav.path}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div className="py-1">
              <span className="px-2.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Tasks ({filteredTasks.length})
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      setSelectedTaskId(task.id);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckSquare className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate font-medium">{task.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 shrink-0">
                      {task.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div className="py-1">
              <span className="px-2.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Projects ({filteredProjects.length})
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      navigate(`/projects/${p.id}`);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate font-medium">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{p.key}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {filteredMembers.length > 0 && (
            <div className="py-1">
              <span className="px-2.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Team Members ({filteredMembers.length})
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      navigate('/team');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate font-medium">{m.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 truncate">{m.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {quickActions.length === 0 &&
            quickNav.length === 0 &&
            filteredTasks.length === 0 &&
            filteredProjects.length === 0 &&
            filteredMembers.length === 0 && (
              <div className="py-12 text-center text-xs text-neutral-400">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 rounded text-neutral-600 dark:text-neutral-300">↑</kbd> <kbd className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 rounded text-neutral-600 dark:text-neutral-300">↓</kbd></span>
            <span>Select: <kbd className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 rounded text-neutral-600 dark:text-neutral-300">↵</kbd></span>
          </div>
          <span className="text-rose-500 font-medium">TaskFlow Command Engine</span>
        </div>
      </div>
    </div>
  );
};

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
