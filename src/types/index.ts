export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';

export type ProjectStatus = 'planning' | 'active' | 'in_review' | 'completed' | 'on_hold';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  assigneeId: string;
  dueDate: string; // ISO date YYYY-MM-DD
  createdAt: string;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface Project {
  id: string;
  name: string;
  key: string; // e.g. "FLOW", "CORE"
  description: string;
  color: string; // Hex color or Tailwind accent identifier
  status: ProjectStatus;
  startDate: string;
  dueDate: string;
  leadId: string;
  memberIds: string[];
  budget?: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  avatarBg?: string;
  department: string;
  status: 'active' | 'away' | 'offline';
  joinedDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'project' | 'mention' | 'deadline' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
  entityId?: string;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: 'created_task' | 'completed_task' | 'moved_task' | 'created_project' | 'commented' | 'assigned_task';
  targetTitle: string;
  targetId: string;
  timestamp: string;
  details?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
  bio?: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  accentColor: 'pink' | 'rose' | 'fuchsia' | 'indigo' | 'emerald';
  defaultView: 'dashboard' | 'kanban' | 'tasks' | 'projects' | 'calendar';
  emailNotifications: boolean;
  deadlineAlerts: boolean;
  soundEffects: boolean;
  compactSidebar: boolean;
}
