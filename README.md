<p align="center">
  <img src="https://img.shields.io/badge/NexTask-v2.0-06b6d4?style=for-the-badge&labelColor=0a0a1a&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMjBWMTAiLz48cGF0aCBkPSJNMTggMjBWNCIvPjxwYXRoIGQ9Ik02IDIwdi00Ii8+PC9zdmc+" alt="NexTask" />
  <img src="https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react&logoColor=61dafb&labelColor=0a0a1a" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=3178c6&labelColor=0a0a1a" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.x-646cff?style=for-the-badge&logo=vite&logoColor=646cff&labelColor=0a0a1a" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8&labelColor=0a0a1a" alt="Tailwind CSS" />
</p>

<h1 align="center">⚡ NexTask — Advanced Futuristic Task Manager</h1>

<p align="center">
  <strong>A fully customizable, feature-rich task management application with a stunning futuristic UI.</strong><br />
  Built with React 19, TypeScript, Vite 7, and Tailwind CSS 4.
</p>

<p align="center">
  <em>Zero dependencies on external task services. All data stays in your browser via localStorage.</em>
</p>


---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🖥️ Views](#️-views)
- [🎨 Customization](#-customization)
- [📱 Responsive Design](#-responsive-design)
- [🏗️ Architecture](#️-architecture)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Build & Deploy](#-build--deploy)
- [💾 Data Management](#-data-management)
- [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts)
- [🎯 Task Model](#-task-model)
- [📸 Screenshots](#-screenshots)
- [🗺️ Roadmap](#️-roadmap)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Complete Task Management
- **Create, Read, Update, Delete** — Full CRUD operations for tasks
- **Rich task editor** with title, description, status, priority, category, tags, due date, accent color, and subtasks
- **Subtask management** — Add, toggle, delete subtasks within each task; progress tracking
- **Drag & Drop** — Move tasks between Kanban columns to update status
- **Quick completion toggle** — One-click mark tasks as done/undone
- **Inline sort & filter** — Sort by title, status, priority, due date, or creation date

### 🔍 Advanced Filtering & Search
- **Real-time search** across task titles and descriptions
- **Filter by Status** — To Do, In Progress, Review, Done
- **Filter by Priority** — Critical, High, Medium, Low
- **Filter by Category** — User-defined categories with emoji icons
- **Filter by Tag** — User-defined colored tags
- **Filter by Date Range** — Today, This Week, This Month, Overdue
- **Active filter count** badge on the filter button
- **One-click "Clear All"** to reset all active filters

### 🏷️ Organization System
- **Categories** — Customizable with emoji icons and colors (e.g. 👤 Personal, 💼 Work, 💪 Health)
- **Tags** — Colored labels for cross-cutting concerns (e.g. Urgent, Important, Quick Win)
- **Priority Levels** — Critical (red glow), High (orange), Medium (yellow), Low (green)
- **Status Workflow** — To Do → In Progress → Review → Done
- **Color-coded cards** — 12 preset accent colors + custom color picker per task

---

## 🖥️ Views

### 📋 Kanban Board
The default view. A horizontal scrolling board with 4 columns:

| Column | Emoji | Color |
|--------|-------|-------|
| To Do | 📋 | Gray (#64748b) |
| In Progress | ⚡ | Blue (#3b82f6) |
| Review | 🔍 | Purple (#a855f7) |
| Done | ✅ | Green (#22c55e) |

- **Drag and drop** tasks between columns to change status
- Each card shows: priority badge, title, description preview, tags, subtask progress bar, due date, category
- Column headers show task count and a distribution progress bar
- Empty columns show a drop zone with an appropriate icon

### 📄 List View
A sortable table/list view:

- **Desktop** — Full table with columns: Checkbox, Task, Status, Priority, Due Date, Category, Tags, Actions
- **Mobile** — Compact card rows with essential info
- **Click column headers** to sort ASC/DESC (with visual arrow indicators)
- **Inline actions** — Edit and Delete buttons per row
- **Footer** shows total count and current sort state

### 📅 Calendar View
A full month calendar grid:

- **Month navigation** — Previous/Next month buttons + "Today" quick jump
- **Day cells** show task indicators with colored title previews (desktop) or colored dots (mobile)
- **Today highlighting** with accent color border and background
- **Overdue detection** with red border on days with overdue tasks
- **Sidebar panel** (desktop) or bottom section (mobile) listing all tasks for the current month
- **Click any task** to open the edit modal

### 📊 Dashboard
Analytics and overview:

- **Welcome bar** — Personalized greeting with completion rate and overdue alert
- **4 KPI cards** — Total Tasks, Completion %, In Progress count, Overdue count
- **SVG Progress Ring** — Animated circular progress indicator with percentage
- **Status Distribution** — Horizontal bar chart showing tasks per status
- **Priority Distribution** — Horizontal bar chart showing tasks per priority
- **Category Breakdown** — Progress bars per category showing completion ratio
- **Upcoming Deadlines** — List of upcoming tasks sorted by due date
- **Overdue Alerts** — Red highlighted overdue tasks at the top
- **Empty state** when no tasks exist yet

---

## 🎨 Customization

### 🌗 Themes
4 built-in themes with complete CSS variable systems:

| Theme | Background | Description |
|-------|-----------|-------------|
| 🌙 **Dark** | `#05050f` | Deep dark space — the default |
| ☀️ **Light** | `#f1f4f9` | Clean & minimal with white cards |
| 🌌 **Midnight** | `#010b1e` | Deep blue night tones |
| 🤖 **Cyberpunk** | `#080808` | Neon pink/yellow electric vibes |

### 🎨 Accent Colors
- **12 preset colors** — Cyan, Blue, Indigo, Violet, Purple, Pink, Red, Orange, Yellow, Green, Emerald, Teal
- **Custom color picker** — Choose any color via the native color picker
- Accent color is applied globally: buttons, highlights, glows, borders, gradients, progress rings

### 📐 Display Density
- **📦 Compact** — Reduced padding on cards and rows for more content on screen
- **🌟 Comfortable** — Standard spacing with description previews visible

### ⚙️ Preferences
- **Show/hide completed tasks** — Toggle to filter out done tasks from all views
- **Enable/disable animations** — Control fade-in, scale-in, shimmer effects

### 📁 Custom Categories
- Add new categories with:
  - **Name** — Any text
  - **Emoji icon** — Choose from 20 preset emojis
  - **Color** — Custom color picker
- Edit existing category names and colors inline
- Delete categories you no longer need
- Category counts shown in sidebar

### 🏷️ Custom Tags
- Add new tags with:
  - **Name** — Any text
  - **Color** — Custom color picker
- Edit tag names and colors inline
- Delete tags
- Tags displayed as colored chips on task cards

---

## 📱 Responsive Design

NexTask is **fully responsive** across all device sizes:

### Desktop (≥1024px)
- Full sidebar with categories, quick stats, and navigation
- Collapsible sidebar (narrow icon-only mode)
- Header with search, filters, view toggle, and "New Task" button
- Wide Kanban columns, full table rows, large calendar cells

### Tablet (641px–1023px)
- Sidebar becomes a slide-out drawer (activated by hamburger menu)
- Backdrop overlay when sidebar is open
- Bottom navigation bar with view switching + centered FAB for new tasks
- Adapted grid layouts (2-column KPIs, etc.)

### Mobile (≤640px)
- Compact hamburger menu
- Bottom navigation with 4 view tabs + floating action button
- Kanban columns are narrower and horizontally scrollable
- List view shows mobile-optimized card rows
- Calendar shows single-letter day headers and dot indicators
- Modal fills most of the screen with rounded corners
- Filter labels hidden (icon-only buttons)
- Safe area support for notched devices (iPhone etc.)

### Key Responsive Utilities
```css
.hide-mobile     /* Hidden on screens ≤640px */
.hide-tablet     /* Hidden on screens 641px–1023px */
.hide-desktop    /* Hidden on screens ≥1024px */
.bottom-nav      /* Visible only on screens ≤1023px */
```

---

## 🏗️ Architecture

### State Management
- **React Context API** (`AppProvider` + `useApp` hook)
- Single source of truth for all app state
- Memoized filtered/sorted task list via `useMemo`
- Optimized callbacks with `useCallback`

### Data Persistence
- **localStorage** with automatic save on every state change
- Keys used:
  - `ntx-tasks` — All tasks
  - `ntx-cats` — Categories
  - `ntx-tags` — Tags
  - `ntx-settings` — App settings (theme, accent, density, name, etc.)
  - `ntx-view` — Current view mode

### Styling Architecture
- **CSS Variables** for theming (30+ custom properties)
- **Tailwind CSS 4** for utility classes
- **Custom CSS** for glassmorphism, animations, responsive layouts
- **Inline styles** for dynamic/computed values (accent colors, task colors)

### No Demo Data
- App starts completely empty — no sample tasks
- **Welcome screen** guides new users:
  1. First visit: asks for your name
  2. Shows feature overview with icons
  3. "Create First Task" button opens the task modal
- Welcome screen disappears once you have at least one task

---

## 📂 Project Structure

```
nextask/
├── index.html                  # HTML entry point with Inter + JetBrains Mono fonts
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build config (React + SingleFile plugins)
├── README.md                   # This file
│
└── src/
    ├── main.tsx                # ReactDOM entry point
    ├── App.tsx                 # Root component (Header, BottomNav, WelcomeScreen, routing)
    ├── index.css               # Global styles, themes, animations, responsive rules
    ├── types.ts                # TypeScript interfaces & constants
    ├── store.tsx               # Context provider, state management, localStorage persistence
    │
    ├── utils/
    │   └── cn.ts               # clsx + tailwind-merge utility
    │
    └── components/
        ├── Sidebar.tsx         # Desktop sidebar / mobile drawer
        ├── TaskModal.tsx       # Create/Edit task modal dialog
        ├── KanbanBoard.tsx     # Drag-and-drop Kanban board view
        ├── ListView.tsx        # Sortable table/list view
        ├── CalendarView.tsx    # Monthly calendar grid view
        ├── Dashboard.tsx       # Analytics dashboard view
        └── SettingsPanel.tsx   # Settings slide-out panel
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nextask.git
cd nextask

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### First Run
1. Open the app — you'll see the **Welcome Screen**
2. Enter your name and click **"Let's Get Started"**
3. Click **"Create First Task"** to add your first task
4. Explore different views: Kanban, List, Calendar, Dashboard
5. Open **Settings** (gear icon in sidebar) to customize themes, colors, categories, and tags

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.x | UI framework with hooks |
| **TypeScript** | 5.9.x | Type safety |
| **Vite** | 7.2.x | Build tool & dev server |
| **Tailwind CSS** | 4.1.x | Utility-first CSS framework |
| **Lucide React** | 0.577.x | Icon library (tree-shakeable) |
| **clsx** | 2.1.x | Conditional className utility |
| **tailwind-merge** | 3.4.x | Tailwind class deduplication |
| **vite-plugin-singlefile** | 2.3.x | Bundle everything into single HTML |

### No Backend Required
NexTask runs entirely in the browser. There are:
- ❌ No API calls
- ❌ No database
- ❌ No authentication
- ✅ All data stored in `localStorage`
- ✅ Works offline after initial load
- ✅ Zero network requests

---

## 📦 Build & Deploy

### Production Build

```bash
npm run build
```

This generates a **single HTML file** at `dist/index.html` thanks to `vite-plugin-singlefile`. All JavaScript, CSS, and assets are inlined.

### Preview Build

```bash
npm run preview
```

### Deploy Anywhere
Since the build output is a single `index.html` file, you can deploy it:
- **Static hosting** — Netlify, Vercel, GitHub Pages, Cloudflare Pages
- **File share** — Just send the HTML file to anyone
- **Local** — Open `dist/index.html` directly in a browser
- **Intranet** — Drop it on any web server

---

## 💾 Data Management

### Export Backup
1. Open **Settings** → **Data** tab
2. Click **"Export Backup (.json)"**
3. A JSON file is downloaded: `nextask-backup-YYYY-MM-DD.json`

### Import Backup
1. Open **Settings** → **Data** tab
2. Click **"Import Backup (.json)"**
3. Select a previously exported backup file
4. App reloads with restored data

### Reset All Data
1. Open **Settings** → **Data** tab
2. Click **"Reset All Data"** (Danger Zone)
3. Confirm the action
4. All tasks, categories, tags, and settings are cleared

### Backup File Format
```json
{
  "tasks": "[...serialized tasks array...]",
  "categories": "[...serialized categories array...]",
  "tags": "[...serialized tags array...]",
  "settings": "{...serialized settings object...}",
  "exported": "2025-01-15T10:30:00.000Z"
}
```

---

## ⌨️ Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| `Enter` | Subtask input | Add subtask |
| `Enter` | Search input | Trigger search |
| `Enter` | Category/Tag name input | Save and add |
| `Escape` | Modal/Settings | Close panel (click backdrop) |

---

## 🎯 Task Model

Each task contains the following properties:

```typescript
interface Task {
  id: string;            // Unique identifier (auto-generated)
  title: string;         // Task title (required)
  description: string;   // Detailed description
  status: Status;        // 'todo' | 'in-progress' | 'review' | 'done'
  priority: Priority;    // 'critical' | 'high' | 'medium' | 'low'
  categoryId: string;    // Reference to a Category
  tagIds: string[];      // Array of Tag references
  dueDate: string | null;// ISO date string (YYYY-MM-DD) or null
  createdAt: string;     // ISO timestamp (auto-set on creation)
  subtasks: SubTask[];   // Array of subtasks
  completed: boolean;    // Completion flag (synced with status='done')
  color: string;         // Hex color for card accent
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}
```

### Priority Levels

| Priority | Color | Badge Style |
|----------|-------|------------|
| 🔴 Critical | `#ef4444` | Red gradient with glow shadow |
| 🟠 High | `#f97316` | Orange gradient |
| 🟡 Medium | `#eab308` | Yellow gradient |
| 🟢 Low | `#22c55e` | Green gradient |

### Status Workflow

```
📋 To Do  →  ⚡ In Progress  →  🔍 Review  →  ✅ Done
```

---

## 🎨 Design System

### Glassmorphism Cards
- Semi-transparent backgrounds with `backdrop-filter: blur(20px)`
- Subtle border with theme-aware opacity
- Elevation via `box-shadow` with dark/glow variants
- Hover state with increased opacity and border glow

### Animations
- **Fade Up** — Cards and rows animate in from below
- **Scale In** — Modals scale up with slight translation
- **Slide In** — Settings panel slides from right; sidebar slides from left
- **Bounce In** — Logo icon on welcome screen
- **Pulse Glow** — Logo continuously pulses with accent shadow
- **Shimmer** — Cards show a light sweep on hover
- All animations respect the "Enable Animations" setting

### Color System
30+ CSS custom properties control every aspect:
```
--bg-primary, --bg-secondary, --bg-tertiary, --bg-card, --bg-input
--text-primary, --text-secondary, --text-muted
--border-color, --border-glow
--accent, --accent-r, --accent-g, --accent-b
--shadow-card, --shadow-glow
```

---

## 📸 Screenshots

> Since this is a single-page app that starts empty, here's what to expect in each view:

| View | Description |
|------|-------------|
| **Welcome Screen** | Name input + feature cards + "Create First Task" CTA |
| **Kanban Board** | 4-column drag-and-drop board with glass cards |
| **List View** | Sortable table (desktop) / card list (mobile) |
| **Calendar** | Month grid with task dots + sidebar task list |
| **Dashboard** | KPI cards + progress ring + bar charts + deadlines |
| **Settings** | Theme picker, accent colors, categories, tags, data management |
| **Task Modal** | Full-featured form with subtasks, tags, color picker |

---

## 🗺️ Roadmap

Potential future enhancements:

- [ ] 🔄 Recurring tasks (daily, weekly, monthly)
- [ ] 📊 Time tracking per task
- [ ] 🔔 Browser notification reminders
- [ ] 📎 File attachments (stored as base64)
- [ ] 🔗 Task dependencies & blockers
- [ ] 📤 Share tasks via URL (encoded in hash)
- [ ] 🌐 PWA support (offline-first with service worker)
- [ ] 📱 Native app wrapper (Capacitor/Tauri)
- [ ] 🤝 Real-time collaboration (WebRTC/WebSocket)
- [ ] 📈 Weekly/monthly productivity reports
- [ ] 🎙️ Voice input for quick task creation
- [ ] 🔍 Full-text search with fuzzy matching
- [ ] 📋 Task templates & quick-add presets
- [ ] 🏆 Gamification (streaks, achievements, XP)

---

## 🧩 Component Reference

| Component | File | Description |
|-----------|------|-------------|
| `App` | `src/App.tsx` | Root component — layout, header, welcome screen, bottom nav |
| `AppProvider` | `src/store.tsx` | Context provider with all state & actions |
| `Sidebar` | `src/components/Sidebar.tsx` | Desktop sidebar / mobile drawer with nav, categories, stats |
| `TaskModal` | `src/components/TaskModal.tsx` | Create/Edit modal with full form, subtasks, color picker |
| `KanbanBoard` | `src/components/KanbanBoard.tsx` | Drag-and-drop 4-column Kanban view |
| `ListView` | `src/components/ListView.tsx` | Sortable table/list with desktop & mobile layouts |
| `CalendarView` | `src/components/CalendarView.tsx` | Monthly calendar grid with task indicators |
| `Dashboard` | `src/components/Dashboard.tsx` | Analytics with KPIs, charts, progress ring |
| `SettingsPanel` | `src/components/SettingsPanel.tsx` | Slide-out settings with 4 tabs |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ and ⚡ by NexTask</strong><br />
  <sub>A futuristic approach to task management</sub>
</p>
