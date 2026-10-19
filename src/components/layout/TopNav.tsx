import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  CheckCheck,
  CheckSquare,
  FolderKanban,
  User,
  Settings,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn, formatDate } from '../../lib/utils';
import { useToast } from '../ui/ToastProvider';

interface TopNavProps {
  onOpenMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = useStore((s) => s.user);
  const preferences = useStore((s) => s.preferences);
  const updatePreferences = useStore((s) => s.updatePreferences);
  const notifications = useStore((s) => s.notifications);
  const markAllNotificationsAsRead = useStore((s) => s.markAllNotificationsAsRead);
  const markNotificationAsRead = useStore((s) => s.markNotificationAsRead);
  const openCreateTaskModal = useStore((s) => s.openCreateTaskModal);
  const setCreateProjectModalOpen = useStore((s) => s.setCreateProjectModalOpen);
  const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen);
  const resetToDemoData = useStore((s) => s.resetToDemoData);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.read);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    updatePreferences({ theme: nextTheme });
    toast({
      title: `${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode Enabled`,
      description: 'Your appearance preference has been updated.'
    });
  };

  // Compute breadcrumb title
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview';
    if (path === '/my-tasks') return 'My Tasks';
    if (path === '/kanban') return 'Kanban Board';
    if (path === '/projects') return 'Projects';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path === '/calendar') return 'Calendar';
    if (path === '/team') return 'Team Members';
    if (path === '/analytics') return 'Analytics';
    if (path === '/notifications') return 'Notifications';
    if (path === '/settings') return 'Settings';
    return 'Workspace';
  };

  return (
    <header className="h-16 px-4 md:px-6 border-b border-neutral-200 dark:border-neutral-800/80 bg-white/90 dark:bg-[#0c0e14]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-400 dark:text-neutral-500 font-medium hidden sm:inline">
            Workspace
          </span>
          <span className="text-neutral-300 dark:text-neutral-600 hidden sm:inline">/</span>
          <h1 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate tracking-tight text-base sm:text-sm">
            {getBreadcrumb()}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search shortcut */}
      <div className="hidden md:flex flex-1 max-w-md mx-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            'w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs text-neutral-400',
            'bg-neutral-100/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800',
            'hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-colors group text-left'
          )}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-500 transition-colors" />
            <span className="group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
              Search tasks, projects, people...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-neutral-200/80 dark:bg-neutral-700/60 rounded text-neutral-500 dark:text-neutral-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="md:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Create Dropdown */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setCreateOpen(!createOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/30"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="w-3 h-3 text-rose-200" />
          </button>

          {createOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/10 dark:shadow-black/40 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setCreateOpen(false);
                  openCreateTaskModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-left"
              >
                <CheckSquare className="w-4 h-4 text-rose-500" />
                <span>New Task</span>
              </button>
              <button
                onClick={() => {
                  setCreateOpen(false);
                  setCreateProjectModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-left"
              >
                <FolderKanban className="w-4 h-4 text-rose-500" />
                <span>New Project</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title={`Switch to ${preferences.theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {preferences.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </button>

        {/* Notification Bell & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0c0e14]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50">
              <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Notifications
                  </span>
                  {unreadNotifications.length > 0 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono">
                      {unreadNotifications.length}
                    </span>
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-[11px] font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    No notifications right now
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={cn(
                        'p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer text-left',
                        !n.read && 'bg-rose-500/[0.03] dark:bg-rose-500/[0.05]'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-xs font-semibold tracking-tight', !n.read ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400')}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-rose-500/30 transition-all"
            aria-label="User account menu"
          >
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/10 dark:shadow-black/40 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-neutral-200 dark:border-neutral-800">
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-neutral-400 truncate font-mono">
                  {user.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/my-tasks');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <CheckSquare className="w-4 h-4 text-neutral-400" />
                  <span>My Assigned Tasks</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-neutral-400" />
                  <span>Preferences & Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    resetToDemoData();
                    toast({
                      title: 'Reset Completed',
                      description: 'TaskFlow demo state has been restored to default.'
                    });
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
