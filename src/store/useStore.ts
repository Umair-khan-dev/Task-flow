import { create } from 'zustand';
import {
  Project,
  Task,
  TeamMember,
  NotificationItem,
  ActivityEvent,
  UserProfile,
  UserPreferences,
  TaskStatus
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PREFERENCES,
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES
} from '../data/mockData';

const STORAGE_KEYS = {
  PROJECTS: 'taskflow_projects_v1',
  TASKS: 'taskflow_tasks_v1',
  MEMBERS: 'taskflow_members_v1',
  NOTIFICATIONS: 'taskflow_notifications_v1',
  ACTIVITIES: 'taskflow_activities_v1',
  USER: 'taskflow_user_v1',
  PREFERENCES: 'taskflow_preferences_v1'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

interface StoreState {
  projects: Project[];
  tasks: Task[];
  members: TeamMember[];
  notifications: NotificationItem[];
  activities: ActivityEvent[];
  user: UserProfile;
  preferences: UserPreferences;

  // UI state
  searchQuery: string;
  selectedTaskId: string | null;
  isCreateTaskModalOpen: boolean;
  createTaskDefaultStatus: TaskStatus;
  createTaskDefaultProject: string | null;
  isCreateProjectModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  activeFilterProject: string | 'all';
  activeFilterAssignee: string | 'all';
  activeFilterPriority: string | 'all';

  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (taskId: string, content: string) => void;

  // Actions - Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Actions - Members
  addMember: (member: Omit<TeamMember, 'id' | 'joinedDate'>) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;

  // Actions - Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp'>) => void;

  // Actions - Preferences & User
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  resetToDemoData: () => void;

  // UI Controls
  setSearchQuery: (query: string) => void;
  setSelectedTaskId: (id: string | null) => void;
  openCreateTaskModal: (options?: { status?: TaskStatus; projectId?: string }) => void;
  closeCreateTaskModal: () => void;
  setCreateProjectModalOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveFilterProject: (id: string | 'all') => void;
  setActiveFilterAssignee: (id: string | 'all') => void;
  setActiveFilterPriority: (priority: string | 'all') => void;
}

export const useStore = create<StoreState>((set, get) => ({
  projects: loadStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
  tasks: loadStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  members: loadStorage<TeamMember[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS),
  notifications: loadStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  activities: loadStorage<ActivityEvent[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  user: loadStorage<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER),
  preferences: loadStorage<UserPreferences>(STORAGE_KEYS.PREFERENCES, INITIAL_PREFERENCES),

  searchQuery: '',
  selectedTaskId: null,
  isCreateTaskModalOpen: false,
  createTaskDefaultStatus: 'todo',
  createTaskDefaultProject: null,
  isCreateProjectModalOpen: false,
  isCommandPaletteOpen: false,
  activeFilterProject: 'all',
  activeFilterAssignee: 'all',
  activeFilterPriority: 'all',

  addTask: (taskData) => {
    const id = `tsk-${Date.now()}`;
    const newTask: Task = {
      ...taskData,
      id,
      createdAt: new Date().toISOString()
    };
    const updated = [newTask, ...get().tasks];
    saveStorage(STORAGE_KEYS.TASKS, updated);

    // Record activity
    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      userId: get().user.id,
      userName: get().user.name,
      action: 'created_task',
      targetTitle: newTask.title,
      targetId: id,
      timestamp: 'Just now',
      details: `Created in ${get().projects.find(p => p.id === newTask.projectId)?.name || 'Project'}`
    };
    const updatedActivities = [newActivity, ...get().activities].slice(0, 30);
    saveStorage(STORAGE_KEYS.ACTIVITIES, updatedActivities);

    set({ tasks: updated, activities: updatedActivities });
    return id;
  },

  updateTask: (id, updates) => {
    const prevTasks = get().tasks;
    const taskIndex = prevTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    const oldTask = prevTasks[taskIndex];
    const updatedTask = { ...oldTask, ...updates };
    const updated = [...prevTasks];
    updated[taskIndex] = updatedTask;

    saveStorage(STORAGE_KEYS.TASKS, updated);

    // If status changed to completed, record activity
    let updatedActivities = get().activities;
    if (updates.status === 'completed' && oldTask.status !== 'completed') {
      const act: ActivityEvent = {
        id: `act-${Date.now()}`,
        userId: get().user.id,
        userName: get().user.name,
        action: 'completed_task',
        targetTitle: updatedTask.title,
        targetId: id,
        timestamp: 'Just now'
      };
      updatedActivities = [act, ...updatedActivities].slice(0, 30);
      saveStorage(STORAGE_KEYS.ACTIVITIES, updatedActivities);
    }

    set({ tasks: updated, activities: updatedActivities });
  },

  deleteTask: (id) => {
    const updated = get().tasks.filter(t => t.id !== id);
    saveStorage(STORAGE_KEYS.TASKS, updated);
    set({
      tasks: updated,
      selectedTaskId: get().selectedTaskId === id ? null : get().selectedTaskId
    });
  },

  moveTask: (taskId, newStatus) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const updated = get().tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    saveStorage(STORAGE_KEYS.TASKS, updated);

    const act: ActivityEvent = {
      id: `act-${Date.now()}`,
      userId: get().user.id,
      userName: get().user.name,
      action: newStatus === 'completed' ? 'completed_task' : 'moved_task',
      targetTitle: task.title,
      targetId: taskId,
      timestamp: 'Just now',
      details: `Moved to ${newStatus.replace('_', ' ').toUpperCase()}`
    };
    const updatedActivities = [act, ...get().activities].slice(0, 30);
    saveStorage(STORAGE_KEYS.ACTIVITIES, updatedActivities);

    set({ tasks: updated, activities: updatedActivities });
  },

  toggleSubtask: (taskId, subtaskId) => {
    const updated = get().tasks.map(t => {
      if (t.id !== taskId) return t;
      const updatedSubtasks = (t.subtasks || []).map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      return { ...t, subtasks: updatedSubtasks };
    });
    saveStorage(STORAGE_KEYS.TASKS, updated);
    set({ tasks: updated });
  },

  addComment: (taskId, content) => {
    const user = get().user;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString()
    };
    const updated = get().tasks.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, comments: [...(t.comments || []), newComment] };
    });
    saveStorage(STORAGE_KEYS.TASKS, updated);

    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      const act: ActivityEvent = {
        id: `act-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        action: 'commented',
        targetTitle: task.title,
        targetId: taskId,
        timestamp: 'Just now',
        details: content.length > 50 ? `${content.slice(0, 50)}...` : content
      };
      const updatedActivities = [act, ...get().activities].slice(0, 30);
      saveStorage(STORAGE_KEYS.ACTIVITIES, updatedActivities);
      set({ tasks: updated, activities: updatedActivities });
    } else {
      set({ tasks: updated });
    }
  },

  addProject: (projectData) => {
    const id = `prj-${Date.now()}`;
    const newProject: Project = {
      ...projectData,
      id,
      createdAt: new Date().toISOString()
    };
    const updated = [newProject, ...get().projects];
    saveStorage(STORAGE_KEYS.PROJECTS, updated);

    const act: ActivityEvent = {
      id: `act-${Date.now()}`,
      userId: get().user.id,
      userName: get().user.name,
      action: 'created_project',
      targetTitle: newProject.name,
      targetId: id,
      timestamp: 'Just now'
    };
    const updatedActivities = [act, ...get().activities].slice(0, 30);
    saveStorage(STORAGE_KEYS.ACTIVITIES, updatedActivities);

    set({ projects: updated, activities: updatedActivities });
    return id;
  },

  updateProject: (id, updates) => {
    const updated = get().projects.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    saveStorage(STORAGE_KEYS.PROJECTS, updated);
    set({ projects: updated });
  },

  deleteProject: (id) => {
    const updatedProjects = get().projects.filter(p => p.id !== id);
    // Also reassign or remove tasks under this project
    const updatedTasks = get().tasks.filter(t => t.projectId !== id);
    saveStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
    saveStorage(STORAGE_KEYS.TASKS, updatedTasks);
    set({
      projects: updatedProjects,
      tasks: updatedTasks,
      activeFilterProject: get().activeFilterProject === id ? 'all' : get().activeFilterProject
    });
  },

  addMember: (memberData) => {
    const id = `usr-${Date.now()}`;
    const newMember: TeamMember = {
      ...memberData,
      id,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [...get().members, newMember];
    saveStorage(STORAGE_KEYS.MEMBERS, updated);
    set({ members: updated });
  },

  updateMember: (id, updates) => {
    const updated = get().members.map(m =>
      m.id === id ? { ...m, ...updates } : m
    );
    saveStorage(STORAGE_KEYS.MEMBERS, updated);
    set({ members: updated });
  },

  markNotificationAsRead: (id) => {
    const updated = get().notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated });
  },

  markAllNotificationsAsRead: () => {
    const updated = get().notifications.map(n => ({ ...n, read: true }));
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated });
  },

  clearNotifications: () => {
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, []);
    set({ notifications: [] });
  },

  addNotification: (item) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now'
    };
    const updated = [newItem, ...get().notifications].slice(0, 40);
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated });
  },

  updatePreferences: (updates) => {
    const updated = { ...get().preferences, ...updates };
    saveStorage(STORAGE_KEYS.PREFERENCES, updated);
    set({ preferences: updated });

    // Sync theme class to document
    if (updates.theme) {
      if (updates.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (updates.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    }
  },

  updateUser: (updates) => {
    const updated = { ...get().user, ...updates };
    saveStorage(STORAGE_KEYS.USER, updated);
    set({ user: updated });
  },

  resetToDemoData: () => {
    saveStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    saveStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    saveStorage(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    saveStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    saveStorage(STORAGE_KEYS.USER, INITIAL_USER);
    saveStorage(STORAGE_KEYS.PREFERENCES, INITIAL_PREFERENCES);
    set({
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      members: INITIAL_MEMBERS,
      notifications: INITIAL_NOTIFICATIONS,
      activities: INITIAL_ACTIVITIES,
      user: INITIAL_USER,
      preferences: INITIAL_PREFERENCES
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  openCreateTaskModal: (options) =>
    set({
      isCreateTaskModalOpen: true,
      createTaskDefaultStatus: options?.status || 'todo',
      createTaskDefaultProject: options?.projectId || null
    }),
  closeCreateTaskModal: () => set({ isCreateTaskModalOpen: false }),
  setCreateProjectModalOpen: (open) => set({ isCreateProjectModalOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setActiveFilterProject: (id) => set({ activeFilterProject: id }),
  setActiveFilterAssignee: (id) => set({ activeFilterAssignee: id }),
  setActiveFilterPriority: (priority) => set({ activeFilterPriority: priority })
}));
