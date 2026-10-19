import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  CheckCircle2,
  Clock,
  Briefcase,
  X,
  ExternalLink,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { TeamMember } from '../types';
import { useToast } from '../components/ui/ToastProvider';

export const TeamMembers: React.FC = () => {
  const { toast } = useToast();

  const members = useStore((s) => s.members);
  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const addMember = useStore((s) => s.addMember);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  const filteredMembers = members.filter((m) => {
    if (roleFilter !== 'all' && m.department.toLowerCase() !== roleFilter.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !email.trim()) {
      toast({ title: 'Validation Error', description: 'Please fill out all required fields.' });
      return;
    }

    addMember({
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      department,
      status: 'active',
      avatar:
        avatar.trim() ||
        `https://images.unsplash.com/photo-${1534528741775 + members.length}?w=150&auto=format&fit=crop&q=80`
    });

    toast({
      title: 'Member Added',
      description: `${name.trim()} has been added to your workspace directory.`
    });

    setIsAddModalOpen(false);
    setName('');
    setRole('');
    setEmail('');
    setAvatar('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            Team Members
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {filteredMembers.length} active
            </span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Cross-functional team roster, sprint allocations, and productivity throughput
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role or email..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="all">All Departments</option>
          <option value="engineering">Engineering</option>
          <option value="design">Design</option>
          <option value="product">Product</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="quality">Quality</option>
        </select>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((m) => {
          const mTasks = tasks.filter((t) => t.assigneeId === m.id);
          const mCompleted = mTasks.filter((t) => t.status === 'completed').length;
          const rate = mTasks.length > 0 ? Math.round((mCompleted / mTasks.length) * 100) : 0;

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMember(m)}
              className="group p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:border-rose-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#11141c] ${
                        m.status === 'active'
                          ? 'bg-emerald-500'
                          : m.status === 'away'
                          ? 'bg-amber-500'
                          : 'bg-neutral-400'
                      }`}
                    />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-rose-500 transition-colors">
                      {m.name}
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{m.role}</p>
                    <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                      {m.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono truncate">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{m.email}</span>
              </div>

              {/* Task Performance Strip */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/60 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60">
                  <span className="text-[10px] text-neutral-400">Assigned Tasks</span>
                  <p className="font-mono font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {mTasks.length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/60">
                  <span className="text-[10px] text-neutral-400">Completion Rate</span>
                  <p className="font-mono font-bold text-rose-500 mt-0.5">{rate}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          />
          <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {selectedMember.role} · {selectedMember.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 text-neutral-400 hover:text-neutral-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                Active Assigned Tasks
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {tasks.filter((t) => t.assigneeId === selectedMember.id).length === 0 ? (
                  <p className="text-xs text-neutral-400">No active tasks assigned.</p>
                ) : (
                  tasks
                    .filter((t) => t.assigneeId === selectedMember.id)
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedMember(null);
                          setSelectedTaskId(t.id);
                        }}
                        className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 flex items-center justify-between text-xs hover:border-rose-500 cursor-pointer"
                      >
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                          {t.title}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {t.status}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Add New Team Member
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Liam Anderson"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Job Title / Role *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Security Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="liam@taskflow.io"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Quality">Quality</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
