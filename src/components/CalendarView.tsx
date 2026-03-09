import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react';
import { useApp } from '../store';
import { STATUS_COLORS } from '../types';

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export default function CalendarView() {
  const { filteredTasks, setEditingTask, setShowTaskModal } = useApp();
  const [current, setCurrent] = useState(new Date());

  const year     = current.getFullYear();
  const month    = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay  = new Date(year, month + 1, 0).getDate();
  const today    = new Date();

  const prev    = () => setCurrent(new Date(year, month - 1, 1));
  const next    = () => setCurrent(new Date(year, month + 1, 1));
  const goToday = () => setCurrent(new Date());

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredTasks.filter(t => t.dueDate === dateStr);
  };

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const openTask = (task: typeof filteredTasks[0]) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Get all tasks with due dates in this month for the sidebar list
  const monthTasks = filteredTasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate + 'T00:00:00');
    return d.getMonth() === month && d.getFullYear() === year;
  }).sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1));

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black font-mono gradient-text">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={goToday}
              className="px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
              style={{ background: 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.2)' }}
            >
              Today
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              className="p-2 rounded-xl transition-all btn-ghost"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-xl transition-all btn-ghost"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
              className="ml-2 p-2 rounded-xl text-white transition-all btn-primary"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1 flex-shrink-0">
          {DAYS.map(d => (
            <div
              key={d}
              className="text-center py-2 hide-mobile"
              style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              {d}
            </div>
          ))}
          {DAYS_SHORT.map((d, i) => (
            <div
              key={`m-${i}`}
              className="text-center py-2 sm:hidden"
              style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr min-h-0 overflow-hidden">
          {cells.map((day, i) => {
            if (day === null) {
              return (
                <div
                  key={`e-${i}`}
                  className="rounded-xl"
                  style={{ background: 'var(--bg-secondary)', opacity: 0.25 }}
                />
              );
            }

            const dayTasks = getTasksForDay(day);
            const isT      = isToday(day);
            const hasOver  = dayTasks.some(t => !t.completed && t.dueDate && new Date(t.dueDate + 'T00:00:00') < today);

            return (
              <div
                key={`d-${day}`}
                className="rounded-xl p-1 overflow-hidden transition-all relative group"
                style={{
                  background: isT
                    ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1)'
                    : 'var(--bg-secondary)',
                  border: isT
                    ? '1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.35)'
                    : hasOver
                      ? '1px solid rgba(239,68,68,0.3)'
                      : '1px solid transparent',
                }}
              >
                <div
                  className="text-xs font-mono font-bold mb-1 leading-none"
                  style={{ color: isT ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  {day}
                </div>
                <div className="space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100% - 20px)' }}>
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      onClick={() => openTask(task)}
                      className="px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold truncate cursor-pointer transition-all hover:opacity-80"
                      style={{
                        background: task.color + '22',
                        color: task.color,
                        borderLeft: `2px solid ${task.color}`,
                      }}
                    >
                      <span className="hide-mobile">{task.title}</span>
                      <span className="sm:hidden">●</span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[8px] text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                      +{dayTasks.length - 3}
                    </div>
                  )}
                </div>

                {/* Dot indicator on mobile */}
                {dayTasks.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 sm:hidden">
                    {dayTasks.slice(0, 3).map(t => (
                      <div key={t.id} className="w-1 h-1 rounded-full" style={{ background: t.color }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar: upcoming tasks */}
      <div
        className="w-full lg:w-64 flex-shrink-0 glass rounded-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '100%' }}
      >
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <CalendarDays size={14} style={{ color: 'var(--accent)' }} />
            <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {MONTHS[month]} Tasks
            </h3>
            <span
              className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12)', color: 'var(--accent)' }}
            >
              {monthTasks.length}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {monthTasks.length === 0 && (
            <div className="empty-state py-8">
              <div className="empty-icon">
                <CalendarDays size={20} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>No tasks this month</p>
            </div>
          )}
          {monthTasks.map(task => {
            const d = new Date(task.dueDate! + 'T00:00:00');
            const overdue = d < today && !task.completed;
            return (
              <div
                key={task.id}
                onClick={() => openTask(task)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all card-shimmer"
                style={{
                  background: 'var(--bg-input)',
                  border: `1px solid ${overdue ? 'rgba(239,68,68,0.25)' : 'var(--border-color)'}`,
                  borderLeft: `3px solid ${task.color}`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${task.completed ? 'line-through opacity-40' : ''}`}
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {task.title}
                  </p>
                  <p className="text-[10px] mt-0.5 font-medium" style={{ color: overdue ? '#ef4444' : 'var(--text-muted)' }}>
                    {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {overdue && ' · Overdue'}
                  </p>
                </div>
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                  style={{ background: STATUS_COLORS[task.status] }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
