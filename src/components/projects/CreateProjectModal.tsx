import React, { useState } from 'react';
import { X, FolderKanban, AlertCircle, Palette, Calendar, DollarSign, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ProjectStatus } from '../../types';
import { useToast } from '../ui/ToastProvider';

const COLOR_PRESETS = [
  { name: 'TaskFlow Pink', hex: '#f43f5e' },
  { name: 'Neon Fuchsia', hex: '#ec4899' },
  { name: 'Electric Violet', hex: '#8b5cf6' },
  { name: 'Cyber Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Solar Amber', hex: '#f59e0b' },
  { name: 'Indigo Deep', hex: '#6366f1' }
];

export const CreateProjectModal: React.FC = () => {
  const { toast } = useToast();

  const isCreateProjectModalOpen = useStore((s) => s.isCreateProjectModalOpen);
  const setCreateProjectModalOpen = useStore((s) => s.setCreateProjectModalOpen);
  const members = useStore((s) => s.members);
  const addProject = useStore((s) => s.addProject);

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#f43f5e');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  });
  const [leadId, setLeadId] = useState(members[0]?.id || 'usr-1');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([members[0]?.id || 'usr-1']);
  const [budget, setBudget] = useState('50000');
  const [error, setError] = useState('');

  if (!isCreateProjectModalOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!key || key === name.slice(0, 4).toUpperCase()) {
      const generated = val
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 4)
        .toUpperCase();
      setKey(generated);
    }
  };

  const toggleMember = (mId: string) => {
    if (selectedMemberIds.includes(mId)) {
      if (selectedMemberIds.length > 1) {
        setSelectedMemberIds(selectedMemberIds.filter((id) => id !== mId));
      }
    } else {
      setSelectedMemberIds([...selectedMemberIds, mId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!key.trim()) {
      setError('Project key identifier is required');
      return;
    }

    addProject({
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim(),
      color,
      status,
      startDate,
      dueDate,
      leadId,
      memberIds: selectedMemberIds,
      budget: budget ? parseInt(budget, 10) : undefined
    });

    toast({
      title: 'Project Created',
      description: `"${name.trim()}" is now active in your workspace.`
    });

    setCreateProjectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCreateProjectModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-black/40 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <FolderKanban className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Create New Project
              </h2>
              <p className="text-xs text-neutral-500">
                Organize tasks, milestones, and team members
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreateProjectModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Key */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Realtime Collaborative Engine"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Key Identifier <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={key}
                maxLength={6}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="RCE"
                className="w-full px-3.5 py-2 text-sm font-mono uppercase rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are the goals, deliverables, and scope of this project?"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>Project Color Theme</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.hex}
                  onClick={() => setColor(p.hex)}
                  title={p.name}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: p.hex }}
                >
                  {color === p.hex && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Status & Lead */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Project Lead
              </label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Assigned Team Members</span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {selectedMemberIds.length} selected
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1">
              {members.map((m) => {
                const isChecked = selectedMemberIds.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border text-xs transition-colors ${
                      isChecked
                        ? 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10 text-neutral-900 dark:text-white font-medium'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-500'
                    }`}
                  >
                    <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="truncate">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateProjectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/25 transition-all"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
