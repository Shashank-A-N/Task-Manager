import { useState } from 'react';
import { AppProvider, useApp } from './store';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import Dashboard from './components/Dashboard';
import TaskModal from './components/TaskModal';
import SettingsPanel from './components/SettingsPanel';
import {
  Search, X, Kanban, List, CalendarDays, LayoutDashboard,
  SlidersHorizontal, ChevronDown, Plus, Menu,
} from 'lucide-react';
import { Status, Priority, STATUS_LABELS, PRIORITY_LABELS, ViewMode } from './types';

/* ===================== HEADER ===================== */
function Header() {
  const {
    filter, updateFilter, resetFilters,
    viewMode, setViewMode,
    categories, tags, tasks,
    setShowTaskModal, setEditingTask,
    toggleSidebar,
  } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filter.status    !== 'all',
    filter.priority  !== 'all',
    filter.categoryId !== 'all',
    filter.tagId     !== 'all',
    filter.dateRange !== 'all',
  ].filter(Boolean).length;

  const selectBase: React.CSSProperties = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: 10,
    padding: '7px 28px 7px 10px',
    fontSize: 12,
    fontWeight: 500,
  };

  const viewBtns: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
    { id: 'kanban',    icon: <Kanban size={15} />,        label: 'Kanban' },
    { id: 'list',      icon: <List size={15} />,          label: 'List' },
    { id: 'calendar',  icon: <CalendarDays size={15} />,  label: 'Calendar' },
    { id: 'dashboard', icon: <LayoutDashboard size={15} />,label: 'Dashboard' },
  ];

  return (
    <header className="top-header flex-shrink-0">
      {/* Hamburger (mobile/tablet) */}
      <button
        className="lg:hidden p-2 rounded-xl transition-all flex-shrink-0"
        style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        onClick={toggleSidebar}
      >
        <Menu size={17} />
      </button>

      {/* Logo (mobile only) */}
      <div className="lg:hidden flex items-center gap-1.5 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
          style={{ background: `linear-gradient(135deg, var(--accent), #818cf8)` }}
        >N</div>
        <span className="font-mono font-black text-sm gradient-text">NexTask</span>
      </div>

      {/* Search bar */}
      <div className="flex-1 relative" style={{ maxWidth: 380 }}>
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={filter.search}
          onChange={e => updateFilter({ search: e.target.value })}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-8 py-2 rounded-xl text-sm transition-all"
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
        {filter.search && (
          <button
            onClick={() => updateFilter({ search: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter button */}
      <button
        onClick={() => setShowFilters(v => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative flex-shrink-0"
        style={{
          background: showFilters || activeFilterCount > 0
            ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1)'
            : 'var(--bg-input)',
          border: `1px solid ${showFilters || activeFilterCount > 0
            ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.3)'
            : 'var(--border-color)'}`,
          color: showFilters || activeFilterCount > 0 ? 'var(--accent)' : 'var(--text-secondary)',
        }}
      >
        <SlidersHorizontal size={13} />
        <span className="hide-mobile">Filters</span>
        {activeFilterCount > 0 && (
          <span
            className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent)' }}
          >
            {activeFilterCount}
          </span>
        )}
        <ChevronDown
          size={11}
          className={`hide-mobile transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
      </button>

      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 hide-mobile"
          style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          Clear
        </button>
      )}

      {/* View Toggle (desktop) */}
      <div
        className="hidden sm:flex items-center rounded-xl overflow-hidden flex-shrink-0"
        style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
      >
        {viewBtns.map(v => (
          <button
            key={v.id}
            onClick={() => setViewMode(v.id)}
            className="p-2.5 transition-all tooltip"
            data-tip={v.label}
            style={{
              background: viewMode === v.id
                ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.15)'
                : 'transparent',
              color: viewMode === v.id ? 'var(--accent)' : 'var(--text-muted)',
            }}
            title={v.label}
          >
            {v.icon}
          </button>
        ))}
      </div>

      {/* New Task (desktop / tablet) */}
      <button
        onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
        className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all hover:scale-[1.03] active:scale-[0.97]"
        style={{
          background: `linear-gradient(135deg, var(--accent), #818cf8)`,
          boxShadow: '0 0 16px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.3)',
        }}
      >
        <Plus size={15} />
        <span className="hide-mobile">New Task</span>
      </button>

      {/* Task count */}
      <span
        className="text-[11px] font-mono flex-shrink-0 hide-mobile"
        style={{ color: 'var(--text-muted)' }}
      >
        {tasks.length} tasks
      </span>

      {/* Filter dropdown */}
      {showFilters && (
        <div
          className="absolute top-full left-0 right-0 z-30 px-4 py-3 flex flex-wrap gap-2 anim-fade-down"
          style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <select
            value={filter.status}
            onChange={e => updateFilter({ status: e.target.value as Status | 'all' })}
            style={selectBase}
          >
            <option value="all">All Status</option>
            {(Object.keys(STATUS_LABELS) as Status[]).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>

          <select
            value={filter.priority}
            onChange={e => updateFilter({ priority: e.target.value as Priority | 'all' })}
            style={selectBase}
          >
            <option value="all">All Priority</option>
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map(p => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>

          <select
            value={filter.categoryId}
            onChange={e => updateFilter({ categoryId: e.target.value })}
            style={selectBase}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>

          <select
            value={filter.tagId}
            onChange={e => updateFilter({ tagId: e.target.value })}
            style={selectBase}
          >
            <option value="all">All Tags</option>
            {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <select
            value={filter.dateRange}
            onChange={e => updateFilter({ dateRange: e.target.value as FilterState['dateRange'] })}
            style={selectBase}
          >
            <option value="all">Any Time</option>
            <option value="today">Due Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="overdue">Overdue</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </header>
  );
}

type FilterState = import('./types').FilterState;

/* ===================== BOTTOM NAV (mobile) ===================== */
function BottomNav() {
  const { viewMode, setViewMode, setShowTaskModal, setEditingTask } = useApp();
  const views: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
    { id: 'kanban',    icon: <Kanban size={20} />,        label: 'Board' },
    { id: 'list',      icon: <List size={20} />,          label: 'List' },
    { id: 'calendar',  icon: <CalendarDays size={20} />,  label: 'Calendar' },
    { id: 'dashboard', icon: <LayoutDashboard size={20} />,label: 'Stats' },
  ];

  return (
    <nav className="bottom-nav">
      {views.slice(0, 2).map(v => (
        <button
          key={v.id}
          onClick={() => setViewMode(v.id)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all"
          style={{ color: viewMode === v.id ? 'var(--accent)' : 'var(--text-muted)' }}
        >
          {v.icon}
          <span className="text-[9px] font-semibold">{v.label}</span>
        </button>
      ))}

      {/* FAB in center */}
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, var(--accent), #818cf8)`,
            boxShadow: '0 0 20px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.5)',
            marginTop: -16,
          }}
        >
          <Plus size={22} />
        </button>
      </div>

      {views.slice(2).map(v => (
        <button
          key={v.id}
          onClick={() => setViewMode(v.id)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all"
          style={{ color: viewMode === v.id ? 'var(--accent)' : 'var(--text-muted)' }}
        >
          {v.icon}
          <span className="text-[9px] font-semibold">{v.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ===================== MAIN CONTENT ===================== */
function Content() {
  const { viewMode } = useApp();
  return (
    <main
      className="flex-1 overflow-hidden main-content-area"
      style={{ padding: '12px 14px 12px 14px' }}
    >
      {viewMode === 'kanban'    && <KanbanBoard />}
      {viewMode === 'list'      && <ListView />}
      {viewMode === 'calendar'  && <CalendarView />}
      {viewMode === 'dashboard' && <Dashboard />}
    </main>
  );
}

/* ===================== WELCOME SCREEN ===================== */
function WelcomeScreen() {
  const { tasks, setShowTaskModal, setEditingTask, settings, updateSettings } = useApp();
  const [nameInput, setNameInput] = useState(settings.userName || '');
  const [step, setStep] = useState<'name' | 'ready'>(settings.userName ? 'ready' : 'name');

  if (tasks.length > 0) return null;

  const handleName = () => {
    if (nameInput.trim()) {
      updateSettings({ userName: nameInput.trim() });
      setStep('ready');
    }
  };

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-4"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="glass rounded-3xl p-8 max-w-md w-full text-center anim-scale"
        style={{
          pointerEvents: 'auto',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 0 80px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.08)',
        }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white font-black text-2xl anim-bounce-in"
          style={{
            background: `linear-gradient(135deg, var(--accent), #818cf8)`,
            boxShadow: '0 0 32px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.4)',
          }}
        >
          N
        </div>

        {step === 'name' ? (
          <>
            <h2 className="text-2xl font-black gradient-text mb-2 font-mono">Welcome to NexTask</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Your advanced futuristic task manager. What should we call you?
            </p>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleName()}
              placeholder="Your name..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm mb-4 text-center"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={handleName}
              disabled={!nameInput.trim()}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, var(--accent), #818cf8)`,
                boxShadow: '0 4px 20px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.3)',
              }}
            >
              Let's Get Started →
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black gradient-text mb-2 font-mono">
              Hey, {settings.userName}! 👋
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Your workspace is empty and ready. Create your first task to get started.
            </p>
            <div className="grid grid-cols-1 gap-3 mb-4">
              {[
                { emoji: '⚡', title: 'Kanban Board', desc: 'Drag & drop tasks across columns' },
                { emoji: '📋', title: 'List View',    desc: 'Sortable table with filters' },
                { emoji: '📅', title: 'Calendar',     desc: 'View tasks by due date' },
                { emoji: '📊', title: 'Dashboard',    desc: 'Analytics & progress tracking' },
              ].map(f => (
                <div
                  key={f.title}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-left"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
                >
                  <span className="text-xl">{f.emoji}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{f.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, var(--accent), #818cf8)`,
                boxShadow: '0 4px 20px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.3)',
              }}
            >
              <Plus size={16} className="inline mr-2" />
              Create First Task
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ===================== APP INNER ===================== */
function AppInner() {
  return (
    <div className="app-layout app-grid-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header />
        <div className="flex-1 overflow-hidden relative">
          <WelcomeScreen />
          <Content />
        </div>
      </div>

      {/* Bottom Nav (mobile) */}
      <BottomNav />

      {/* Modals */}
      <TaskModal />
      <SettingsPanel />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
