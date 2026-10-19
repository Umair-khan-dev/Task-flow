import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Palette,
  Bell,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToast } from '../components/ui/ToastProvider';

export const Settings: React.FC = () => {
  const { toast } = useToast();

  const user = useStore((s) => s.user);
  const updateUser = useStore((s) => s.updateUser);
  const preferences = useStore((s) => s.preferences);
  const updatePreferences = useStore((s) => s.updatePreferences);
  const resetToDemoData = useStore((s) => s.resetToDemoData);
  const store = useStore();

  // Profile Form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [bio, setBio] = useState(user.bio || '');

  // Confirm reset modal
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, role, bio });
    toast({
      title: 'Profile Saved',
      description: 'Your user profile details have been updated.'
    });
  };

  const handleExportData = () => {
    const data = {
      projects: store.projects,
      tasks: store.tasks,
      members: store.members,
      notifications: store.notifications,
      activities: store.activities,
      user: store.user,
      preferences: store.preferences,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'TaskFlow backup downloaded.' });
  };

  const handleConfirmReset = () => {
    resetToDemoData();
    setShowResetModal(false);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setBio(user.bio || '');
    toast({
      title: 'Demo Data Restored',
      description: 'TaskFlow workspace has been reset to default state.'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          Settings & Preferences
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Customize your interface theme, workspace profile, notification thresholds, and manage data
        </p>
      </div>

      {/* 1. Profile Settings */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <User className="w-4 h-4 text-rose-500" />
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            User Profile & Identity
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-500/30"
            />
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {user.name}
              </p>
              <p className="text-xs text-neutral-400">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Department
              </label>
              <input
                type="text"
                disabled
                value={user.department}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/20 transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* 2. Appearance & Theme */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <Palette className="w-4 h-4 text-rose-500" />
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Appearance & Aesthetic
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => updatePreferences({ theme: 'dark' })}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                  preferences.theme === 'dark'
                    ? 'border-rose-500 bg-rose-500/5 text-rose-500 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-xs">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => updatePreferences({ theme: 'light' })}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                  preferences.theme === 'light'
                    ? 'border-rose-500 bg-rose-500/5 text-rose-500 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-xs">Light Mode</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Primary Accent Tone
            </label>
            <div className="flex items-center gap-3">
              {[
                { name: 'Signature Pink', key: 'pink', bg: 'bg-[#f43f5e]' },
                { name: 'Fuchsia Neon', key: 'fuchsia', bg: 'bg-[#ec4899]' },
                { name: 'Rose Quartz', key: 'rose', bg: 'bg-[#fb7185]' },
                { name: 'Indigo Deep', key: 'indigo', bg: 'bg-[#6366f1]' },
                { name: 'Emerald', key: 'emerald', bg: 'bg-[#10b981]' }
              ].map((acc) => (
                <button
                  type="button"
                  key={acc.key}
                  onClick={() => updatePreferences({ accentColor: acc.key as any })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    preferences.accentColor === acc.key
                      ? 'border-rose-500 shadow-xs text-neutral-900 dark:text-white font-bold'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${acc.bg}`} />
                  <span>{acc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Notification & Alert Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <Bell className="w-4 h-4 text-rose-500" />
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Notifications & Alerts
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Deadline Proximity Alerts
              </p>
              <p className="text-[11px] text-neutral-400">
                Notify 48 hours and 24 hours prior to sprint milestones
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.deadlineAlerts}
              onChange={(e) => updatePreferences({ deadlineAlerts: e.target.checked })}
              className="w-4 h-4 rounded text-rose-500 accent-rose-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Daily Email Digest
              </p>
              <p className="text-[11px] text-neutral-400">
                Receive 9:00 AM summary of pending focus tasks
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
              className="w-4 h-4 rounded text-rose-500 accent-rose-500"
            />
          </label>
        </div>
      </div>

      {/* 4. Data Management & Backup */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <Download className="w-4 h-4 text-rose-500" />
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Workspace Data Management
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Export Full Workspace State
            </p>
            <p className="text-[11px] text-neutral-400">
              Download your projects, tasks, comments, and members as JSON
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-red-500">
              Reset to Factory Demo State
            </p>
            <p className="text-[11px] text-neutral-400">
              Restore default mock projects, tasks, and team members
            </p>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowResetModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-500">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Confirm Workspace Reset
              </h3>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              This will reset all projects, tasks, and settings back to their initial sample state.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
