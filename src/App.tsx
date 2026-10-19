import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastProvider';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { CreateProjectModal } from './components/projects/CreateProjectModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';

// Pages
import { DashboardOverview } from './pages/DashboardOverview';
import { KanbanBoard } from './pages/KanbanBoard';
import { MyTasks } from './pages/MyTasks';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { CalendarView } from './pages/CalendarView';
import { TeamMembers } from './pages/TeamMembers';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';

import { useStore } from './store/useStore';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const preferences = useStore((s) => s.preferences);

  // Sync dark class on mount & changes
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (preferences.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, [preferences.theme]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#07080c] text-neutral-900 dark:text-neutral-100 flex overflow-x-hidden antialiased">
          {/* Collapsible / Mobile Responsive Sidebar */}
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {/* Top Navigation Bar */}
            <TopNav onOpenMobileMenu={() => setMobileOpen(true)} />

            {/* Viewport Content */}
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/my-tasks" element={<MyTasks />} />
                <Route path="/kanban" element={<KanbanBoard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="/team" element={<TeamMembers />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          {/* Global Modals & Command Palette */}
          <CommandPalette />
          <CreateTaskModal />
          <CreateProjectModal />
          <TaskDetailModal />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
