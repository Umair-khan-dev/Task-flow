import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Kanban,
  Calendar,
  Users,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const projects = useStore((s) => s.projects);
  const notifications = useStore((s) => s.notifications);
  const user = useStore((s) => s.user);
  const openCreateTaskModal = useStore((s) => s.openCreateTaskModal);
  const setCreateProjectModalOpen = useStore((s) => s.setCreateProjectModalOpen);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/my-tasks', icon: CheckSquare },
    { label: 'Kanban Board', path: '/kanban', icon: Kanban },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out',
          'bg-white dark:bg-[#0c0e14] border-r border-neutral-200 dark:border-neutral-800/80',
          'lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800/80 shrink-0">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  TaskFlow
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                </span>
                <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 truncate">
                  Enterprise Workspace
                </span>
              </div>
            )}
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => openCreateTaskModal()}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm text-white',
              'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
              'shadow-sm shadow-rose-500/25 hover:shadow-md hover:shadow-rose-500/35 transition-all active:scale-[0.98]'
            )}
          >
            <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
            {!collapsed && <span className="font-semibold tracking-tight">New Task</span>}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group',
                    isActive
                      ? 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                      isActive ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-500 dark:text-neutral-400'
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1 tracking-tight">{item.label}</span>
                  )}
                  {item.badge !== undefined && !collapsed && (
                    <span className="ml-auto px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-rose-500 text-white font-mono tabular-nums">
                      {item.badge}
                    </span>
                  )}
                  {item.badge !== undefined && collapsed && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0c0e14]" />
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-rose-500 rounded-r" />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Projects Section */}
          {!collapsed && (
            <div className="pt-5 pb-2">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  Projects
                </span>
                <button
                  onClick={() => setCreateProjectModalOpen(true)}
                  className="text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-0.5"
                  title="Create project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0.5">
                {projects.map((project) => {
                  const isActive = location.pathname === `/projects/${project.id}`;
                  return (
                    <NavLink
                      key={project.id}
                      to={`/projects/${project.id}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/40'
                      )}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="truncate flex-1">{project.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {project.key}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer / User Profile & Collapse */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800/80 shrink-0 space-y-2">
          {/* User profile card */}
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl transition-colors',
              'hover:bg-neutral-100 dark:hover:bg-neutral-800/70 text-left w-full'
            )}
          >
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0e14]" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">{user.role}</p>
              </div>
            )}
          </NavLink>

          {/* Desktop collapse toggle */}
          <div className="hidden lg:flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 px-1">
                  <span>Collapse</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
