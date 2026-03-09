import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Task, Category, Tag, AppSettings, FilterState, Status,
  ViewMode, PRIORITY_ORDER, STATUS_ORDER, SortField, SortDir,
} from './types';

const gid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/* ===================== DEFAULTS (empty — user adds their own data) ===================== */
const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Personal',  color: '#06b6d4', icon: '👤' },
  { id: 'cat-2', name: 'Work',      color: '#8b5cf6', icon: '💼' },
  { id: 'cat-3', name: 'Health',    color: '#10b981', icon: '💪' },
  { id: 'cat-4', name: 'Learning',  color: '#f59e0b', icon: '📚' },
  { id: 'cat-5', name: 'Finance',   color: '#ec4899', icon: '💰' },
];

const defaultTags: Tag[] = [
  { id: 'tag-1', name: 'Urgent',     color: '#ef4444' },
  { id: 'tag-2', name: 'Important',  color: '#f97316' },
  { id: 'tag-3', name: 'Quick Win',  color: '#22c55e' },
  { id: 'tag-4', name: 'Research',   color: '#3b82f6' },
  { id: 'tag-5', name: 'Creative',   color: '#a855f7' },
];

const defaultSettings: AppSettings = {
  theme: 'dark',
  accentColor: '#06b6d4',
  density: 'comfortable',
  showCompletedTasks: true,
  enableAnimations: true,
  sidebarCollapsed: false,
  userName: '',
};

// No default tasks — clean start for real user data
const defaultTasks: Task[] = [];

/* ===================== PERSISTENCE ===================== */
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ===================== HELPERS ===================== */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/* ===================== CONTEXT TYPE ===================== */
interface Ctx {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  settings: AppSettings;
  filter: FilterState;
  viewMode: ViewMode;
  showTaskModal: boolean;
  showSettings: boolean;
  editingTask: Task | null;
  sortField: SortField;
  sortDir: SortDir;
  filteredTasks: Task[];
  sidebarOpen: boolean;

  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, u: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, s: Status) => void;
  toggleSubtask: (tid: string, sid: string) => void;

  addCategory: (c: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, u: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addTag: (t: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, u: Partial<Tag>) => void;
  deleteTag: (id: string) => void;

  updateSettings: (u: Partial<AppSettings>) => void;
  updateFilter: (u: Partial<FilterState>) => void;
  setViewMode: (m: ViewMode) => void;
  setShowTaskModal: (v: boolean) => void;
  setShowSettings: (v: boolean) => void;
  setEditingTask: (t: Task | null) => void;
  setSortField: (f: SortField) => void;
  setSortDir: (d: SortDir) => void;
  resetFilters: () => void;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

const defaultFilter: FilterState = {
  search: '', status: 'all', priority: 'all',
  categoryId: 'all', tagId: 'all', dateRange: 'all',
};

/* ===================== PROVIDER ===================== */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks,      setTasks]      = useState<Task[]>     (() => load('ntx-tasks',    defaultTasks));
  const [categories, setCategories] = useState<Category[]> (() => load('ntx-cats',     defaultCategories));
  const [tags,       setTags]       = useState<Tag[]>      (() => load('ntx-tags',     defaultTags));
  const [settings,   setSettings]   = useState<AppSettings>(() => load('ntx-settings', defaultSettings));
  const [filter,     setFilter]     = useState<FilterState>(defaultFilter);
  const [viewMode,   setViewMode]   = useState<ViewMode>   (() => load('ntx-view',     'kanban' as ViewMode));
  const [showTaskModal,  setShowTaskModal]  = useState(false);
  const [showSettings,   setShowSettings]  = useState(false);
  const [editingTask,    setEditingTask]   = useState<Task | null>(null);
  const [sortField,      setSortField]     = useState<SortField>('createdAt');
  const [sortDir,        setSortDir]       = useState<SortDir>('desc');
  const [sidebarOpen,    setSidebarOpen]   = useState(false);

  // Persist on change
  useEffect(() => { save('ntx-tasks',    tasks);    }, [tasks]);
  useEffect(() => { save('ntx-cats',     categories); }, [categories]);
  useEffect(() => { save('ntx-tags',     tags);     }, [tags]);
  useEffect(() => { save('ntx-settings', settings); }, [settings]);
  useEffect(() => { save('ntx-view',     viewMode); }, [viewMode]);

  // Apply theme & accent
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    const [r, g, b] = hexToRgb(settings.accentColor);
    const s = document.documentElement.style;
    s.setProperty('--accent',   settings.accentColor);
    s.setProperty('--accent-r', String(r));
    s.setProperty('--accent-g', String(g));
    s.setProperty('--accent-b', String(b));
  }, [settings.theme, settings.accentColor]);

  /* --- Task CRUD --- */
  const addTask = useCallback((t: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks(prev => [{ ...t, id: gid(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);
  const updateTask = useCallback((id: string, u: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...u } : t));
  }, []);
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);
  const moveTask = useCallback((id: string, status: Status) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status, completed: status === 'done' } : t
    ));
  }, []);
  const toggleSubtask = useCallback((tid: string, sid: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== tid) return t;
      const subtasks = t.subtasks.map(s => s.id === sid ? { ...s, completed: !s.completed } : s);
      return { ...t, subtasks };
    }));
  }, []);

  /* --- Category CRUD --- */
  const addCategory = useCallback((c: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...c, id: gid() }]);
  }, []);
  const updateCategory = useCallback((id: string, u: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...u } : c));
  }, []);
  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  /* --- Tag CRUD --- */
  const addTag = useCallback((t: Omit<Tag, 'id'>) => {
    setTags(prev => [...prev, { ...t, id: gid() }]);
  }, []);
  const updateTag = useCallback((id: string, u: Partial<Tag>) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, ...u } : t));
  }, []);
  const deleteTag = useCallback((id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateSettings = useCallback((u: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...u }));
  }, []);
  const updateFilter = useCallback((u: Partial<FilterState>) => {
    setFilter(prev => ({ ...prev, ...u }));
  }, []);
  const resetFilters = useCallback(() => setFilter(defaultFilter), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), []);

  /* --- Filtered + sorted tasks --- */
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (!settings.showCompletedTasks) list = list.filter(t => !t.completed);

    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s)
      );
    }
    if (filter.status   !== 'all') list = list.filter(t => t.status     === filter.status);
    if (filter.priority !== 'all') list = list.filter(t => t.priority   === filter.priority);
    if (filter.categoryId !== 'all') list = list.filter(t => t.categoryId === filter.categoryId);
    if (filter.tagId    !== 'all') list = list.filter(t => t.tagIds.includes(filter.tagId));

    if (filter.dateRange !== 'all') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      list = list.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate + 'T00:00:00');
        if (filter.dateRange === 'today')  return due.toDateString() === today.toDateString();
        if (filter.dateRange === 'overdue') return due < today && !t.completed;
        if (filter.dateRange === 'week') {
          const end = new Date(today); end.setDate(end.getDate() + 7);
          return due >= today && due <= end;
        }
        if (filter.dateRange === 'month') {
          const end = new Date(today); end.setDate(end.getDate() + 30);
          return due >= today && due <= end;
        }
        return true;
      });
    }

    list.sort((a, b) => {
      let cmp = 0;
      if      (sortField === 'title')     cmp = a.title.localeCompare(b.title);
      else if (sortField === 'priority')  cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      else if (sortField === 'status')    cmp = STATUS_ORDER[a.status]    - STATUS_ORDER[b.status];
      else if (sortField === 'dueDate') {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        cmp = da - db;
      } else {
        cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [tasks, filter, settings.showCompletedTasks, sortField, sortDir]);

  const ctx: Ctx = {
    tasks, categories, tags, settings, filter, viewMode,
    showTaskModal, showSettings, editingTask, sortField, sortDir, filteredTasks, sidebarOpen,
    addTask, updateTask, deleteTask, moveTask, toggleSubtask,
    addCategory, updateCategory, deleteCategory,
    addTag, updateTag, deleteTag,
    updateSettings, updateFilter, setViewMode, setShowTaskModal, setShowSettings,
    setEditingTask, setSortField, setSortDir, resetFilters, setSidebarOpen, toggleSidebar,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}
