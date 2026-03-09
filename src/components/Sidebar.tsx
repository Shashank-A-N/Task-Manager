import React from 'react';
import {
  LayoutDashboard, List, CalendarDays, Kanban, Plus, Settings,
  ChevronLeft, CheckCircle2, Clock, AlertTriangle, Inbox, X, Zap,
} from 'lucide-react';
import { useApp } from '../store';
import { ViewMode } from '../types';

const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'kanban',    label: 'Kanban Board', icon: <Kanban size={17} /> },
  { id: 'list',      label: 'List View',    icon: <List size={17} /> },
  { id: 'calendar',  label: 'Calendar',     icon: <CalendarDays size={17} /> },
  { id: 'dashboard', label: 'Dashboard',    icon: <LayoutDashboard size={17} /> },
];

export default function Sidebar() {
  const {
    viewMode, setViewMode, settings, updateSettings,
    categories, tasks, filter, updateFilter,
    setShowTaskModal, setEditingTask, setShowSettings,
    sidebarOpen, setSidebarOpen,
  } = useApp();

  const collapsed = settings.sidebarCollapsed;

  const total    = tasks.length;
  const done     = tasks.filter(t => t.completed).length;
  const overdue  = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate + 'T00:00:00') < new Date(new Date().toDateString());
  }).length;
  const active   = tasks.filter(t => t.status === 'in-progress').length;

  const handleNewTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
    setSidebarOpen(false);
  };

  const handleNav = (id: ViewMode) => {
    setViewMode(id);
    setSidebarOpen(false); // close on mobile after navigation
  };

  const handleCatFilter = (id: string) => {
    updateFilter({ categoryId: id });
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        style={{ width: collapsed ? 68 : 260 }}
      >
        {/* Logo & close btn */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 flex-shrink-0">
          {/* Logo */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0 anim-pulse"
            style={{
              background: `linear-gradient(135deg, var(--accent), #818cf8)`,
              boxShadow: '0 0 16px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.4)',
            }}
          >
            N
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="font-mono font-black text-lg gradient-text tracking-tight leading-none">NexTask</h1>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Task Manager</p>
            </div>
          )}
          {/* Close on mobile */}
          <button
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
          {/* Collapse on desktop */}
          {!collapsed && (
            <button
              className="hidden lg:flex p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => updateSettings({ sidebarCollapsed: true })}
            >
              <ChevronLeft size={15} />
            </button>
          )}
        </div>

        {/* New Task Button */}
        <div className="px-3 pb-3 flex-shrink-0">
          <button
            onClick={handleNewTask}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, var(--accent), #818cf8)`,
              boxShadow: '0 4px 20px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.35)',
            }}
          >
            <Plus size={16} />
            {!collapsed && 'New Task'}
          </button>
        </div>

        <div className="neon-line mx-3 flex-shrink-0" />

        {/* Views */}
        <nav className="px-2 py-2 space-y-0.5 flex-shrink-0">
          {!collapsed && (
            <p className="text-[10px] uppercase tracking-widest font-bold px-2 pb-1.5 pt-1"
               style={{ color: 'var(--text-muted)' }}>
              Views
            </p>
          )}
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => handleNav(v.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${collapsed ? 'justify-center' : ''} tooltip`}
              data-tip={collapsed ? v.label : undefined}
              style={{
                background: viewMode === v.id
                  ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12)'
                  : 'transparent',
                color: viewMode === v.id ? 'var(--accent)' : 'var(--text-secondary)',
                borderLeft: viewMode === v.id
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
              }}
            >
              {v.icon}
              {!collapsed && <span className="text-[13px]">{v.label}</span>}
              {!collapsed && viewMode === v.id && (
                <Zap size={10} className="ml-auto" style={{ color: 'var(--accent)', opacity: 0.7 }} />
              )}
            </button>
          ))}
        </nav>

        <div className="neon-line mx-3 my-1 flex-shrink-0" />

        {/* Categories */}
        {!collapsed && (
          <div className="px-2 flex-1 overflow-y-auto py-2">
            <p className="text-[10px] uppercase tracking-widest font-bold px-2 pb-1.5"
               style={{ color: 'var(--text-muted)' }}>
              Categories
            </p>
            <div className="space-y-0.5">
              <button
                onClick={() => handleCatFilter('all')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all"
                style={{
                  background: filter.categoryId === 'all'
                    ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.08)'
                    : 'transparent',
                  color: filter.categoryId === 'all' ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <Inbox size={14} />
                <span className="flex-1 text-left">All Tasks</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                      style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                  {total}
                </span>
              </button>
              {categories.map(cat => {
                const count = tasks.filter(t => t.categoryId === cat.id).length;
                const active = filter.categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCatFilter(cat.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all"
                    style={{
                      background: active
                        ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.08)'
                        : 'transparent',
                      color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{cat.icon}</span>
                    <span className="flex-1 text-left truncate">{cat.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!collapsed && (
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="neon-line mb-3" />
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { icon: <Inbox size={11} />,         label: 'Total',   val: total,  clr: 'var(--accent)' },
                { icon: <CheckCircle2 size={11} />,  label: 'Done',    val: done,   clr: '#22c55e' },
                { icon: <Clock size={11} />,         label: 'Active',  val: active, clr: '#3b82f6' },
                { icon: <AlertTriangle size={11} />, label: 'Overdue', val: overdue,clr: '#ef4444' },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-xl px-2.5 py-2 flex items-center gap-2"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                  <span style={{ color: s.clr }}>{s.icon}</span>
                  <div>
                    <p className="text-xs font-mono font-bold leading-none" style={{ color: s.clr }}>{s.val}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom: expand / settings */}
        <div
          className="px-2 pb-4 pt-2 flex items-center gap-2 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <button
            onClick={() => { setShowSettings(true); setSidebarOpen(false); }}
            className={`flex items-center gap-2 py-2 px-3 rounded-xl text-[13px] font-medium transition-all ${collapsed ? 'w-full justify-center' : 'flex-1'} tooltip`}
            data-tip={collapsed ? 'Settings' : undefined}
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <Settings size={15} />
            {!collapsed && 'Settings'}
          </button>

          {collapsed ? (
            <button
              className="w-full p-2 rounded-xl transition-all flex items-center justify-center tooltip"
              data-tip="Expand"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              onClick={() => updateSettings({ sidebarCollapsed: false })}
            >
              <ChevronLeft size={14} className="rotate-180" />
            </button>
          ) : null}
        </div>
      </aside>
    </>
  );
}
