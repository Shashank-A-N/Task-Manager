export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status   = 'todo' | 'in-progress' | 'review' | 'done';
export type ViewMode = 'kanban' | 'list' | 'calendar' | 'dashboard';
export type ThemeMode = 'dark' | 'light' | 'midnight' | 'cyberpunk';
export type Density   = 'compact' | 'comfortable';
export type SortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'status';
export type SortDir   = 'asc' | 'desc';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  categoryId: string;
  tagIds: string[];
  dueDate: string | null;
  createdAt: string;
  subtasks: SubTask[];
  completed: boolean;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface AppSettings {
  theme: ThemeMode;
  accentColor: string;
  density: Density;
  showCompletedTasks: boolean;
  enableAnimations: boolean;
  sidebarCollapsed: boolean;
  userName: string;
}

export interface FilterState {
  search: string;
  status: Status | 'all';
  priority: Priority | 'all';
  categoryId: string | 'all';
  tagId: string | 'all';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'overdue';
}

export const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
export const STATUS_ORDER: Record<Status, number>     = { todo: 0, 'in-progress': 1, review: 2, done: 3 };

export const STATUS_LABELS: Record<Status, string> = {
  todo:         'To Do',
  'in-progress':'In Progress',
  review:       'Review',
  done:         'Done',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
};

export const STATUS_COLORS: Record<Status, string> = {
  todo:         '#64748b',
  'in-progress':'#3b82f6',
  review:       '#a855f7',
  done:         '#22c55e',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};
