# TaskFlow — Industry-Level Project Management Dashboard

TaskFlow is a high-performance project management web application inspired by the workflow velocity of Linear, the tactile simplicity of Trello, and the structured clarity of Asana. Built with React 19, TypeScript, Tailwind CSS, and Zustand, TaskFlow features a signature pink accent aesthetic, dark and light theme fidelity, interactive drag-and-drop Kanban pipelines, and responsive analytics.

---

## Key Features

- **Dashboard Overview**: Executive-grade KPI statistics (Active Projects, Total Tasks, Completion %, Overdue alerts), Weekly Productivity Velocity area chart, Project Completion % horizontal bar chart, Focus Tasks preview with inline completion, and a live Activity Feed.
- **Interactive Kanban Board**: 4-column drag-and-drop pipeline (To Do, In Progress, In Review, Completed) with instant drop state persistence to LocalStorage, priority filters, project selectors, and card detail inspection.
- **My Tasks Management**: Dedicated focus views (`Assigned to Me`, `Due Today`, `Upcoming`, `Overdue`, `Completed`) with a sortable, filterable table and instant task status toggles with celebration confetti.
- **Projects Portfolio & Details**: Multi-project tracking with custom color indicators, key identifiers, deliverables progress bars, lead assignees, and dedicated `/projects/:id` drill-down views.
- **Sprint Calendar**: Month and week schedule with color-coded task priorities, date navigation, and direct task creation from any calendar cell.
- **Team Directory**: Team members list with role indicators, department filtering, assigned task loads, completion efficiency ratios, and new member onboarding.
- **Analytics & Velocity**: Deep data visualization powered by Recharts, including throughput velocity curves, task distribution by stage, team workload allocations, and risk priority distribution.
- **Global Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search across tasks, projects, team members, and rapid action triggers.
- **Notification Center**: Real-time alerts for task assignments, impending deadlines, and sprint events with read/unread tracking and interactive simulation.
- **Settings & Data Engine**: Profile configuration, theme toggle (Dark / Light), accent hue selector, notification threshold toggles, and full JSON state export/import with demo reset.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Reactive UI component tree with functional hooks |
| **TypeScript** | Strict type safety for data models, actions, and state |
| **Tailwind CSS v4** | Modern utility-first styling with custom dark/light variants and pink neon glows |
| **Zustand** | Centralized global store with synchronous LocalStorage persistence |
| **React Router v7** | Client-side navigation and deep linking (`/kanban`, `/projects/:id`, etc.) |
| **Recharts** | Hardware-accelerated SVG charts for productivity and telemetry |
| **Lucide React** | Clean, accessible iconography |
| **Canvas Confetti** | Tactile completion reward animations |

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Collapsible responsive sidebar
│   │   ├── TopNav.tsx            # Global breadcrumb, notifications, theme switch
│   │   └── CommandPalette.tsx    # ⌘K search & quick action modal
│   ├── tasks/
│   │   ├── CreateTaskModal.tsx   # Task creation with tags & subtasks
│   │   └── TaskDetailModal.tsx   # Detailed view, checklist, comments
│   ├── projects/
│   │   └── CreateProjectModal.tsx# Project creation with color palette
│   └── ui/
│       └── ToastProvider.tsx     # Toast notifications provider
├── pages/
│   ├── DashboardOverview.tsx     # Executive KPI cards & velocity charts
│   ├── KanbanBoard.tsx           # Drag-and-drop task workflow
│   ├── MyTasks.tsx               # Focus task table with tab filters
│   ├── Projects.tsx              # Grid & list project views
│   ├── ProjectDetails.tsx        # Project-specific deliverables
│   ├── CalendarView.tsx          # Date-mapped task grid
│   ├── TeamMembers.tsx           # Team directory & workload
│   ├── Analytics.tsx             # Recharts velocity & telemetry
│   ├── Notifications.tsx         # Notification center
│   └── Settings.tsx              # Theme, profile & data export
├── data/
│   └── mockData.ts               # Realistic initial SaaS projects & tasks
├── lib/
│   └── utils.ts                  # Date formatting, priority styles, confetti
├── store/
│   └── useStore.ts               # Zustand store with LocalStorage sync
├── types/
│   └── index.ts                  # Core TypeScript interfaces
├── App.tsx                       # Main shell & route mapping
├── main.tsx                      # DOM entry point
└── index.css                     # Tailwind v4 configuration & custom scrollbars
```

---

## Local Development Instructions

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repo-url>
   cd taskflow
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Deployment Instructions

### Deploy to Vercel

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your TaskFlow repository.
4. Set the Build Command to `npm run build` and Output Directory to `dist`.
5. Click **Deploy**.

For single-page application routing, add a `vercel.json` if needed:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy to Netlify

1. Link your repository in [Netlify](https://netlify.com/).
2. Set Build command to: `npm run build`.
3. Set Publish directory to: `dist`.
4. Add a `_redirects` file in `public/` with:
   ```
   /*    /index.html   200
   ```
5. Deploy site.
