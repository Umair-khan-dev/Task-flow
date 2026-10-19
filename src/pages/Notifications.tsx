import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  CheckSquare,
  FolderKanban,
  Clock,
  Sparkles,
  Info,
  Filter
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { useToast } from '../components/ui/ToastProvider';

export const Notifications: React.FC = () => {
  const { toast } = useToast();

  const notifications = useStore((s) => s.notifications);
  const markNotificationAsRead = useStore((s) => s.markNotificationAsRead);
  const markAllNotificationsAsRead = useStore((s) => s.markAllNotificationsAsRead);
  const clearNotifications = useStore((s) => s.clearNotifications);
  const addNotification = useStore((s) => s.addNotification);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);

  const [filter, setFilter] = useState<'all' | 'unread' | 'task' | 'deadline'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'task' && n.type !== 'task' && n.type !== 'mention') return false;
    if (filter === 'deadline' && n.type !== 'deadline') return false;
    return true;
  });

  const handleSimulateNotification = () => {
    const simulationTypes = [
      {
        title: 'New PR Review Requested',
        message: 'Elena Rostova requested review on "Figma token build script" in HyperFlow Design System.',
        type: 'task' as const
      },
      {
        title: 'Sprint Milestone Update',
        message: 'Marcus Chen updated the CRDT benchmark report with 120fps benchmark numbers.',
        type: 'project' as const
      },
      {
        title: 'Impending Due Date',
        message: '"Stripe Webhook replay protection" is scheduled for QA in 18 hours.',
        type: 'deadline' as const
      }
    ];
    const picked = simulationTypes[Math.floor(Math.random() * simulationTypes.length)];
    addNotification({
      title: picked.title,
      message: picked.message,
      type: picked.type,
      read: false
    });
    toast({
      title: 'New Notification Simulated',
      description: picked.title
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            Notification Center
            {unreadCount > 0 && (
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500 text-white">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time updates on assignments, mentions, sprint events, and approaching deadlines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateNotification}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Alert</span>
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllNotificationsAsRead();
                toast({ title: 'All notifications marked as read' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => {
                clearNotifications();
                toast({ title: 'Notifications cleared' });
              }}
              className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Clear all notifications"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'task', label: 'Tasks & Mentions' },
          { id: 'deadline', label: 'Deadlines' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              filter === tab.id
                ? 'bg-white dark:bg-neutral-800 text-rose-500 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800/60 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Bell className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <p className="text-xs font-medium text-neutral-500">
              No notifications in this filter category
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.entityId && n.entityId.startsWith('tsk-')) {
                  setSelectedTaskId(n.entityId);
                }
              }}
              className={cn(
                'p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer',
                !n.read && 'bg-rose-500/[0.03] dark:bg-rose-500/[0.05]'
              )}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                    n.type === 'deadline'
                      ? 'bg-amber-500/10 text-amber-500'
                      : n.type === 'project'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-rose-500/10 text-rose-500'
                  )}
                >
                  {n.type === 'deadline' ? (
                    <Clock className="w-4 h-4" />
                  ) : n.type === 'project' ? (
                    <FolderKanban className="w-4 h-4" />
                  ) : (
                    <CheckSquare className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'text-xs sm:text-sm font-bold tracking-tight',
                        !n.read ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400'
                      )}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                {n.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
