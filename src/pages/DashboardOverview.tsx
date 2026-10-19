import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Activity,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useStore } from '../store/useStore';
import { formatDate, isOverdue, getPriorityColor, triggerConfetti } from '../lib/utils';
import { useToast } from '../components/ui/ToastProvider';

export const DashboardOverview: React.FC = () => {
  const { toast } = useToast();

  const user = useStore((s) => s.user);
  const projects = useStore((s) => s.projects);
  const tasks = useStore((s) => s.tasks);
  const members = useStore((s) => s.members);
  const activities = useStore((s) => s.activities);
  const updateTask = useStore((s) => s.updateTask);
  const setSelectedTaskId = useStore((s) => s.setSelectedTaskId);
  const openCreateTaskModal = useStore((s) => s.openCreateTaskModal);
  const setCreateProjectModalOpen = useStore((s) => s.setCreateProjectModalOpen);

  // Compute metrics
  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'planning');
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Upcoming deadlines
  const upcomingDeadlines = tasks
    .filter((t) => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  // My tasks
  const myTasks = tasks
    .filter((t) => t.assigneeId === user.id && t.status !== 'completed')
    .slice(0, 4);

  // Productivity Mock Chart Data (last 7 days)
  const weeklyData = [
    { day: 'Mon', completed: 4, created: 3 },
    { day: 'Tue', completed: 6, created: 5 },
    { day: 'Wed', completed: 8, created: 4 },
    { day: 'Thu', completed: 5, created: 7 },
    { day: 'Fri', completed: 9, created: 6 },
    { day: 'Sat', completed: 3, created: 2 },
    { day: 'Sun', completed: 4, created: 1 }
  ];

  // Project progress data for chart
  const projectChartData = projects.slice(0, 5).map((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    const pCompleted = pTasks.filter((t) => t.status === 'completed').length;
    const rate = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;
    return {
      name: p.key,
      fullName: p.name,
      progress: rate,
      color: p.color
    };
  });

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const handleToggleTaskComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateTask(taskId, { status: 'completed' });
    triggerConfetti();
    toast({
      title: 'Task Completed! 🎉',
      description: 'Progress updated across all dashboards.'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-[#151922] to-neutral-900 border border-neutral-800 text-white relative overflow-hidden shadow-xl shadow-black/20">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-rose-500/10 via-pink-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
            <CalendarDays className="w-4 h-4" />
            <span>{currentDateFormatted}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            You have{' '}
            <span className="text-rose-400 font-semibold">{myTasks.length} pending tasks</span>{' '}
            assigned to you today across {projects.length} active workspace projects.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
          <button
            onClick={() => setCreateProjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/80 transition-colors"
          >
            <FolderKanban className="w-4 h-4 text-rose-400" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Active Projects
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                {activeProjects.length}
              </span>
              <span className="text-[11px] font-medium text-neutral-400">
                / {projects.length} total
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>

        {/* Total Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Tasks
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                {totalTasks}
              </span>
              <span className="text-[11px] font-medium text-rose-500">
                {totalTasks - completedTasks} active
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Completed Tasks & Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Completed Tasks
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                {completedTasks}
              </span>
              <span className="text-[11px] font-bold text-emerald-500 font-mono">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Overdue Tasks
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-red-500">
                {overdueTasks}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">needs attention</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Section: Weekly Productivity & Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Area Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Weekly Productivity Velocity
              </h3>
              <p className="text-xs text-neutral-400">
                Completed vs created tasks over the current sprint
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-neutral-600 dark:text-neutral-400">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                <span className="text-neutral-600 dark:text-neutral-400">Created</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="grayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="day" stroke="#88888880" fontSize={11} tickLine={false} />
                <YAxis stroke="#88888880" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171923',
                    borderColor: '#2d3748',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#roseGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#grayGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Progress Bar Chart (1 col) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Project Completion %
              </h3>
              <p className="text-xs text-neutral-400">By project key</p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <span>All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectChartData}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888820" />
                <XAxis type="number" domain={[0, 100]} fontSize={10} stroke="#88888880" unit="%" />
                <YAxis type="category" dataKey="name" fontSize={11} stroke="#88888880" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171923',
                    borderColor: '#2d3748',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Progress']}
                />
                <Bar dataKey="progress" radius={[0, 6, 6, 0]}>
                  {projectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3 Columns: My Tasks Preview, Upcoming Deadlines, and Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Tasks Preview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                My Focus Tasks
              </h3>
            </div>
            <Link
              to="/my-tasks"
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {myTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                You have no pending tasks! Great job.
              </div>
            ) : (
              myTasks.map((t) => {
                const pColor = getPriorityColor(t.priority);
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTaskId(t.id)}
                    className="group p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-rose-500/40 transition-all cursor-pointer flex items-start gap-2.5"
                  >
                    <button
                      onClick={(e) => handleToggleTaskComplete(t.id, e)}
                      className="mt-0.5 w-4 h-4 rounded border border-neutral-300 dark:border-neutral-700 hover:border-rose-500 flex items-center justify-center transition-colors"
                      title="Mark as completed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-transparent hover:text-rose-500" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-rose-500 transition-colors">
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                        <span className={pColor.text}>{pColor.label}</span>
                        <span>·</span>
                        <span className="font-mono">{formatDate(t.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Upcoming Deadlines
              </h3>
            </div>
            <Link
              to="/calendar"
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <span>Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {upcomingDeadlines.map((t) => {
              const overdue = isOverdue(t.dueDate, t.status);
              const p = projects.find((proj) => proj.id === t.projectId);
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className="p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-rose-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {t.title}
                    </p>
                    <span className="text-[11px] text-neutral-400 truncate block">
                      {p?.name}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                      overdue
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {formatDate(t.dueDate)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Activity Feed
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Live</span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.slice(0, 6).map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-neutral-800 dark:text-neutral-200 leading-snug">
                    <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {act.userName}
                    </strong>{' '}
                    {act.action === 'completed_task' && 'completed'}
                    {act.action === 'created_task' && 'created task'}
                    {act.action === 'moved_task' && 'moved'}
                    {act.action === 'commented' && 'commented on'}{' '}
                    <span className="text-rose-500 dark:text-rose-400 font-medium">
                      &ldquo;{act.targetTitle}&rdquo;
                    </span>
                  </p>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects Cards Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Active Projects Overview
            </h2>
            <p className="text-xs text-neutral-400">
              Track progress, deadlines, and assigned team members
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <span>All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((p) => {
            const pTasks = tasks.filter((t) => t.projectId === p.id);
            const pCompleted = pTasks.filter((t) => t.status === 'completed').length;
            const progress = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;
            const pMembers = members.filter((m) => p.memberIds.includes(m.id));

            return (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="group p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:border-rose-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.key}
                    </span>
                    <span className="text-xs font-mono font-medium text-neutral-400 capitalize">
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-rose-500 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-medium">Progress</span>
                    <span className="font-mono font-bold text-rose-500">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {pMembers.slice(0, 3).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Due {formatDate(p.dueDate)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
