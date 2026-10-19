import { Project, Task, TeamMember, NotificationItem, ActivityEvent, UserProfile, UserPreferences } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@taskflow.io',
  role: 'Senior Product Engineer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  department: 'Frontend Architecture',
  bio: 'Building hyper-scalable UI systems and developer productivity tools.'
};

export const INITIAL_PREFERENCES: UserPreferences = {
  theme: 'dark',
  accentColor: 'pink',
  defaultView: 'dashboard',
  emailNotifications: true,
  deadlineAlerts: true,
  soundEffects: false,
  compactSidebar: false
};

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    role: 'Lead Frontend Engineer',
    email: 'alex.rivera@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    avatarBg: '#f43f5e',
    department: 'Engineering',
    status: 'active',
    joinedDate: '2024-01-15'
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    role: 'Principal Product Designer',
    email: 'elena.rostova@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    avatarBg: '#ec4899',
    department: 'Design',
    status: 'active',
    joinedDate: '2023-11-01'
  },
  {
    id: 'usr-3',
    name: 'Marcus Chen',
    role: 'Staff Systems Architect',
    email: 'marcus.chen@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    avatarBg: '#6366f1',
    department: 'Engineering',
    status: 'active',
    joinedDate: '2024-03-10'
  },
  {
    id: 'usr-4',
    name: 'Sarah Kim',
    role: 'Product Manager',
    email: 'sarah.kim@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    avatarBg: '#10b981',
    department: 'Product',
    status: 'away',
    joinedDate: '2023-09-20'
  },
  {
    id: 'usr-5',
    name: 'David Vance',
    role: 'DevOps & Cloud Engineer',
    email: 'david.vance@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    avatarBg: '#f59e0b',
    department: 'Infrastructure',
    status: 'active',
    joinedDate: '2024-02-05'
  },
  {
    id: 'usr-6',
    name: 'Zoe Martinez',
    role: 'QA & Automation Specialist',
    email: 'zoe.m@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    avatarBg: '#06b6d4',
    department: 'Quality',
    status: 'offline',
    joinedDate: '2024-04-12'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    name: 'HyperFlow Design System v3',
    key: 'HDS',
    description: 'Component architecture, multi-brand tokens, accessible primitives, and micro-interactions for modern Web3 and SaaS.',
    color: '#f43f5e', // Signature Pink / Rose
    status: 'active',
    startDate: '2026-09-01',
    dueDate: '2026-11-15',
    leadId: 'usr-2',
    memberIds: ['usr-1', 'usr-2', 'usr-4'],
    budget: 45000,
    createdAt: '2026-09-01'
  },
  {
    id: 'prj-2',
    name: 'Realtime Sync Engine & CRDTs',
    key: 'SYNC',
    description: 'Low-latency collaborative state sync engine using peer-to-peer state replication and optimistic offline queueing.',
    color: '#ec4899', // Pink Fuchsia
    status: 'active',
    startDate: '2026-09-15',
    dueDate: '2026-10-30',
    leadId: 'usr-3',
    memberIds: ['usr-1', 'usr-3', 'usr-5'],
    budget: 68000,
    createdAt: '2026-09-15'
  },
  {
    id: 'prj-3',
    name: 'Stripe Billing & Metered Usage',
    key: 'BILL',
    description: 'End-to-end upgrade to Stripe Tax, tiered multi-seat subscriptions, webhook idempotency, and automated dunning.',
    color: '#8b5cf6', // Violet
    status: 'in_review',
    startDate: '2026-08-20',
    dueDate: '2026-10-25',
    leadId: 'usr-1',
    memberIds: ['usr-1', 'usr-4', 'usr-6'],
    budget: 32000,
    createdAt: '2026-08-20'
  },
  {
    id: 'prj-4',
    name: 'Mobile PWA & Touch Gestures',
    key: 'MOB',
    description: 'Ultra-fluid 120fps gesture navigation, tactile haptic feedback triggers, and offline background sync capabilities.',
    color: '#06b6d4', // Cyan
    status: 'planning',
    startDate: '2026-10-10',
    dueDate: '2026-12-20',
    leadId: 'usr-1',
    memberIds: ['usr-1', 'usr-2', 'usr-6'],
    budget: 52000,
    createdAt: '2026-10-01'
  },
  {
    id: 'prj-5',
    name: 'Multi-Region Kubernetes Fleet',
    key: 'OPS',
    description: 'Global ingress routing, zero-downtime blue/green deployment pipelines, and sub-10ms edge caching.',
    color: '#10b981', // Emerald
    status: 'completed',
    startDate: '2026-07-01',
    dueDate: '2026-09-30',
    leadId: 'usr-5',
    memberIds: ['usr-3', 'usr-5'],
    budget: 80000,
    createdAt: '2026-07-01'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-101',
    title: 'Implement accessible Command Palette (Cmd+K)',
    description: 'Build a keyboard-first modal with fuzzy search across projects, tasks, team members, and instant command triggers with high contrast focus rings.',
    status: 'in_progress',
    priority: 'urgent',
    projectId: 'prj-1',
    assigneeId: 'usr-1',
    dueDate: '2026-10-18',
    createdAt: '2026-10-05',
    tags: ['UI', 'Accessibility', 'Keyboard'],
    subtasks: [
      { id: 'sub-1', title: 'Global keydown event listener', completed: true },
      { id: 'sub-2', title: 'Fuzzy search ranking algorithm', completed: true },
      { id: 'sub-3', title: 'Screen reader aria-activedescendant', completed: false }
    ],
    comments: [
      {
        id: 'c-1',
        authorId: 'usr-2',
        authorName: 'Elena Rostova',
        content: 'Make sure the backdrop blur matches the 12px blur token from HDS v3 specs.',
        createdAt: '2026-10-12T14:32:00Z'
      }
    ],
    estimatedHours: 12,
    actualHours: 8
  },
  {
    id: 'tsk-102',
    title: 'Design token export script for Tailwind 4 & CSS Vars',
    description: 'Automate Figma Variables sync into CSS custom properties and JSON token dictionaries with lint validation.',
    status: 'todo',
    priority: 'high',
    projectId: 'prj-1',
    assigneeId: 'usr-2',
    dueDate: '2026-10-22',
    createdAt: '2026-10-06',
    tags: ['Design System', 'Tokens', 'Figma'],
    subtasks: [
      { id: 'sub-4', title: 'Setup Figma REST API webhook', completed: true },
      { id: 'sub-5', title: 'Format dark/light contrast matrix', completed: false }
    ],
    comments: [],
    estimatedHours: 8,
    actualHours: 3
  },
  {
    id: 'tsk-103',
    title: 'Conflict-free replicated data types (CRDT) prototype',
    description: 'Benchmark Yjs vs Automerge for concurrent collaborative document edits under simulated 200ms latency.',
    status: 'in_progress',
    priority: 'urgent',
    projectId: 'prj-2',
    assigneeId: 'usr-3',
    dueDate: '2026-10-20',
    createdAt: '2026-10-01',
    tags: ['Backend', 'Algorithms', 'CRDT'],
    subtasks: [
      { id: 'sub-6', title: 'Network throttling test suite', completed: true },
      { id: 'sub-7', title: 'Memory allocation profiling', completed: false }
    ],
    comments: [
      {
        id: 'c-2',
        authorId: 'usr-1',
        authorName: 'Alex Rivera',
        content: 'Yjs binary encoding was 40% faster in our initial stress test.',
        createdAt: '2026-10-13T09:15:00Z'
      }
    ],
    estimatedHours: 24,
    actualHours: 18
  },
  {
    id: 'tsk-104',
    title: 'Stripe Webhook replay protection & idempotency keys',
    description: 'Ensure incoming webhook events cannot be double-processed during intermittent network retries.',
    status: 'in_review',
    priority: 'high',
    projectId: 'prj-3',
    assigneeId: 'usr-1',
    dueDate: '2026-10-16',
    createdAt: '2026-09-28',
    tags: ['Billing', 'Security', 'Fintech'],
    subtasks: [
      { id: 'sub-8', title: 'Redis lock implementation', completed: true },
      { id: 'sub-9', title: 'Audit event transaction rollback', completed: true }
    ],
    comments: [],
    estimatedHours: 10,
    actualHours: 10
  },
  {
    id: 'tsk-105',
    title: 'Implement Dark/Light pink luminous theme switch',
    description: 'Create zero-flicker theme hydration, high contrast typography, and signature pink-500 accent highlight states.',
    status: 'completed',
    priority: 'medium',
    projectId: 'prj-1',
    assigneeId: 'usr-1',
    dueDate: '2026-10-14',
    createdAt: '2026-10-02',
    tags: ['Theme', 'Tailwind', 'Polish'],
    subtasks: [
      { id: 'sub-10', title: 'Store theme preference in LocalStorage', completed: true },
      { id: 'sub-11', title: 'Contrast check for WCAG AA compliance', completed: true }
    ],
    comments: [],
    estimatedHours: 6,
    actualHours: 5
  },
  {
    id: 'tsk-106',
    title: 'Touch drag gesture physics for Kanban columns',
    description: 'Add natural momentum scrolling and haptic touch drag handles for tablet and mobile viewport widths.',
    status: 'todo',
    priority: 'medium',
    projectId: 'prj-4',
    assigneeId: 'usr-1',
    dueDate: '2026-10-28',
    createdAt: '2026-10-10',
    tags: ['Mobile', 'Gestures', 'Kanban'],
    subtasks: [
      { id: 'sub-12', title: 'PointerEvent boundary tracking', completed: false }
    ],
    comments: [],
    estimatedHours: 16,
    actualHours: 0
  },
  {
    id: 'tsk-107',
    title: 'Cluster auto-scaler tuning for zero cold starts',
    description: 'Configure proactive Pod autoscaling based on incoming queue depth and cpu throttle metrics.',
    status: 'completed',
    priority: 'high',
    projectId: 'prj-5',
    assigneeId: 'usr-5',
    dueDate: '2026-09-29',
    createdAt: '2026-09-18',
    tags: ['DevOps', 'Kubernetes', 'K8s'],
    subtasks: [
      { id: 'sub-13', title: 'Prometheus adapter config', completed: true },
      { id: 'sub-14', title: 'Stress test spike from 10 to 500 pods', completed: true }
    ],
    comments: [],
    estimatedHours: 20,
    actualHours: 19
  },
  {
    id: 'tsk-108',
    title: 'Audit sprint velocity & backlog prioritization',
    description: 'Review Q4 team throughput, refine epics, and identify blocker dependencies for upcoming release.',
    status: 'in_progress',
    priority: 'low',
    projectId: 'prj-2',
    assigneeId: 'usr-4',
    dueDate: '2026-10-19',
    createdAt: '2026-10-08',
    tags: ['Product', 'Planning', 'Sprint'],
    subtasks: [
      { id: 'sub-15', title: 'Synthesize engineering feedback', completed: true },
      { id: 'sub-16', title: 'Update milestone dates in roadmap', completed: false }
    ],
    comments: [],
    estimatedHours: 8,
    actualHours: 4
  },
  {
    id: 'tsk-109',
    title: 'Automated E2E Playwright regression pipeline',
    description: 'Run daily synthetic tests against staging environment covering signup, billing upgrade, and kanban drag.',
    status: 'in_review',
    priority: 'medium',
    projectId: 'prj-3',
    assigneeId: 'usr-6',
    dueDate: '2026-10-17',
    createdAt: '2026-10-04',
    tags: ['QA', 'Playwright', 'CI/CD'],
    subtasks: [
      { id: 'sub-17', title: 'Matrix test on Chromium, Firefox, WebKit', completed: true },
      { id: 'sub-18', title: 'Slack failure alerts integration', completed: true }
    ],
    comments: [],
    estimatedHours: 14,
    actualHours: 12
  },
  {
    id: 'tsk-110',
    title: 'Multi-currency invoice PDF generation',
    description: 'Generate EU VAT compliant tax invoices with currency conversion breakdown and downloadable PDFs.',
    status: 'todo',
    priority: 'low',
    projectId: 'prj-3',
    assigneeId: 'usr-4',
    dueDate: '2026-10-29',
    createdAt: '2026-10-09',
    tags: ['Fintech', 'PDF', 'Tax'],
    subtasks: [],
    comments: [],
    estimatedHours: 10,
    actualHours: 0
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Task Assigned',
    message: 'Elena Rostova assigned you to "Implement accessible Command Palette (Cmd+K)"',
    type: 'task',
    read: false,
    timestamp: '10 minutes ago',
    entityId: 'tsk-101'
  },
  {
    id: 'notif-2',
    title: 'Upcoming Deadline',
    message: '"Stripe Webhook replay protection" is due in 2 days (Oct 16)',
    type: 'deadline',
    read: false,
    timestamp: '1 hour ago',
    entityId: 'tsk-104'
  },
  {
    id: 'notif-3',
    title: 'Comment Mention',
    message: 'Elena commented on "Implement accessible Command Palette": "Make sure the backdrop blur matches..."',
    type: 'mention',
    read: false,
    timestamp: '3 hours ago',
    entityId: 'tsk-101'
  },
  {
    id: 'notif-4',
    title: 'Project Milestone Achieved',
    message: 'Multi-Region Kubernetes Fleet reached 100% completion status!',
    type: 'project',
    read: true,
    timestamp: 'Yesterday',
    entityId: 'prj-5'
  },
  {
    id: 'notif-5',
    title: 'System Notice',
    message: 'Weekly velocity report generated. Team completed 18 tasks this week (+24%).',
    type: 'system',
    read: true,
    timestamp: '2 days ago'
  }
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    userId: 'usr-1',
    userName: 'Alex Rivera',
    action: 'completed_task',
    targetTitle: 'Implement Dark/Light pink luminous theme switch',
    targetId: 'tsk-105',
    timestamp: '20 mins ago',
    details: 'Moved to Completed column'
  },
  {
    id: 'act-2',
    userId: 'usr-2',
    userName: 'Elena Rostova',
    action: 'commented',
    targetTitle: 'Implement accessible Command Palette (Cmd+K)',
    targetId: 'tsk-101',
    timestamp: '3 hours ago',
    details: 'Added design token feedback'
  },
  {
    id: 'act-3',
    userId: 'usr-3',
    userName: 'Marcus Chen',
    action: 'moved_task',
    targetTitle: 'CRDT prototype',
    targetId: 'tsk-103',
    timestamp: '5 hours ago',
    details: 'Moved from To Do to In Progress'
  },
  {
    id: 'act-4',
    userId: 'usr-1',
    userName: 'Alex Rivera',
    action: 'created_task',
    targetTitle: 'Touch drag gesture physics for Kanban columns',
    targetId: 'tsk-106',
    timestamp: 'Yesterday',
    details: 'Tagged with Mobile, Gestures'
  },
  {
    id: 'act-5',
    userId: 'usr-5',
    userName: 'David Vance',
    action: 'completed_task',
    targetTitle: 'Cluster auto-scaler tuning for zero cold starts',
    targetId: 'tsk-107',
    timestamp: '2 days ago',
    details: 'All subtasks verified in staging'
  }
];
