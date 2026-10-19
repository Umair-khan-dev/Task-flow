import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Users,
  Activity,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useStore } from '../store/useStore';
import { isOverdue } from '../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  todo: '#94a3b8',
  in_progress: '#3b82f6',
  in_review: '#a855f7',
  completed: '#10b981'
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#f43f5e',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#94a3b8'
};

export const Analytics: React.FC = () => {
  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const members = useStore((s) => s.members);

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'quarter' | 'all'>('30d');

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 1. Tasks by Status (Pie chart)
  const statusCounts = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    in_review: tasks.filter((t) => t.status === 'in_review').length,
    completed: completedTasks
  };
  const statusData = [
    { name: 'To Do', value: statusCounts.todo, color: STATUS_COLORS.todo },
    { name: 'In Progress', value: statusCounts.in_progress, color: STATUS_COLORS.in_progress },
    { name: 'In Review', value: statusCounts.in_review, color: STATUS_COLORS.in_review },
    { name: 'Completed', value: statusCounts.completed, color: STATUS_COLORS.completed }
  ];

  // 2. Tasks by Priority
  const priorityData = [
    { name: 'Urgent', count: tasks.filter((t) => t.priority === 'urgent').length, fill: PRIORITY_COLORS.urgent },
    { name: 'High', count: tasks.filter((t) => t.priority === 'high').length, fill: PRIORITY_COLORS.high },
    { name: 'Medium', count: tasks.filter((t) => t.priority === 'medium').length, fill: PRIORITY_COLORS.medium },
    { name: 'Low', count: tasks.filter((t) => t.priority === 'low').length, fill: PRIORITY_COLORS.low }
  ];

  // 3. Team Workload Distribution
  const workloadData = members.map((m) => {
    const mTasks = tasks.filter((t) => t.assigneeId === m.id);
    const mDone = mTasks.filter((t) => t.status === 'completed').length;
    return {
      name: m.name.split(' ')[0],
      active: mTasks.length - mDone,
      completed: mDone
    };
  });

  // 4. Velocity Trend Data
  const trendData = [
    { date: 'Oct 01', throughput: 4, velocity: 12 },
    { date: 'Oct 04', throughput: 7, velocity: 15 },
    { date: 'Oct 07', throughput: 5, velocity: 14 },
    { date: 'Oct 10', throughput: 9, velocity: 18 },
    { date: 'Oct 13', throughput: 8, velocity: 22 },
    { date: 'Oct 16', throughput: 11, velocity: 26 },
    { date: 'Oct 19', throughput: 14, velocity: 30 }
  ];

  // 5. Project Progress Comparison
  const projectComparisonData = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    const pDone = pTasks.filter((t) => t.status === 'completed').length;
    return {
      key: p.key,
      name: p.name,
      total: pTasks.length,
      completed: pDone,
      rate: pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0,
      color: p.color
    };
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            Analytics & Velocity
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Operational metrics, sprint throughput, team load, and project completion telemetry
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800">
          {(['7d', '30d', 'quarter', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-colors ${
                dateRange === r
                  ? 'bg-white dark:bg-neutral-800 text-rose-500 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === 'quarter' ? 'Quarter' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Sprint Completion Rate</span>
          <p className="text-2xl font-extrabold font-mono tabular-nums text-rose-500 mt-1">
            {completionRate}%
          </p>
          <span className="text-[11px] text-neutral-400 font-medium">
            {completedTasks} of {totalTasks} tasks resolved
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Velocity Index</span>
          <p className="text-2xl font-extrabold font-mono tabular-nums text-emerald-500 mt-1">
            28.4 pts
          </p>
          <span className="text-[11px] text-emerald-500 font-medium">+18% vs last sprint</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Overdue Ratio</span>
          <p className="text-2xl font-extrabold font-mono tabular-nums text-amber-500 mt-1">
            {totalTasks > 0 ? ((overdueTasks / totalTasks) * 100).toFixed(1) : 0}%
          </p>
          <span className="text-[11px] text-neutral-400 font-medium">
            {overdueTasks} tasks require triage
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Team Allocation</span>
          <p className="text-2xl font-extrabold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
            {members.length} members
          </p>
          <span className="text-[11px] text-neutral-400 font-medium">
            Across {projects.length} portfolios
          </span>
        </div>
      </div>

      {/* Main Charts: Velocity Trend & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Velocity Trend Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Cumulative Throughput Velocity
              </h2>
              <p className="text-xs text-neutral-400">Daily burnup trajectory</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-500">+24% trend</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="roseAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="date" stroke="#88888880" fontSize={11} tickLine={false} />
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
                  dataKey="velocity"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#roseAnalytics)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Status Donut Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Tasks by Stage
            </h2>
            <p className="text-xs text-neutral-400">Distribution across pipeline</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171923',
                    borderColor: '#2d3748',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-neutral-600 dark:text-neutral-400">{s.name}:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Team Workload & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Workload Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Team Workload Allocation
            </h2>
            <p className="text-xs text-neutral-400">Active vs completed tasks per engineer</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" stroke="#88888880" fontSize={11} tickLine={false} />
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
                <Legend />
                <Bar dataKey="active" name="Active" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11141c] border border-neutral-200 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Tasks by Severity / Priority
            </h2>
            <p className="text-xs text-neutral-400">Risk classification of pending items</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" stroke="#88888880" fontSize={11} tickLine={false} />
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
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
