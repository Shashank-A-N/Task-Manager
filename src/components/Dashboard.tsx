import { useApp } from '../store';
import {
  STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS,
  Status, Priority,
} from '../types';
import {
  TrendingUp, CheckCircle2, Clock, AlertTriangle, Target,
  CalendarDays, BarChart3, Zap, Award, Flame,
} from 'lucide-react';

export default function Dashboard() {
  const { tasks, categories, setEditingTask, setShowTaskModal, settings } = useApp();

  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const rate      = total > 0 ? Math.round((completed / total) * 100) : 0;
  const today     = new Date(); today.setHours(0, 0, 0, 0);

  const overdue = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate + 'T00:00:00') < today;
  });

  const upcoming = tasks
    .filter(t => t.dueDate && !t.completed && new Date(t.dueDate + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 6);

  const byStatus   = (['todo', 'in-progress', 'review', 'done'] as Status[]).map(s => ({
    status: s, label: STATUS_LABELS[s], color: STATUS_COLORS[s],
    count: tasks.filter(t => t.status === s).length,
  }));

  const byPriority = (['critical', 'high', 'medium', 'low'] as Priority[]).map(p => ({
    priority: p, label: PRIORITY_LABELS[p], color: PRIORITY_COLORS[p],
    count: tasks.filter(t => t.priority === p).length,
  }));

  const byCategory = categories.map(c => ({
    ...c,
    count: tasks.filter(t => t.categoryId === c.id).length,
    done:  tasks.filter(t => t.categoryId === c.id && t.completed).length,
  })).filter(c => c.count > 0);

  const totalSubs = tasks.reduce((s, t) => s + t.subtasks.length, 0);
  const doneSubs  = tasks.reduce((s, t) => s + t.subtasks.filter(st => st.completed).length, 0);
  const subRate   = totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : 0;

  const openTask = (task: typeof tasks[0]) => { setEditingTask(task); setShowTaskModal(true); };

  const formatDate = (date: string) => {
    const d    = new Date(date + 'T00:00:00');
    const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff < 0)  return `${Math.abs(diff)}d overdue`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // SVG ring
  const radius      = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash  = circumference - (rate / 100) * circumference;

  if (total === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-black font-mono gradient-text mb-2">No Data Yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Create some tasks to see your analytics here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-4 pr-0.5">
      {/* Welcome bar */}
      {settings.userName && (
        <div
          className="glass rounded-2xl px-5 py-3 flex items-center gap-3 anim-fade-up"
          style={{ borderLeft: '3px solid var(--accent)' }}
        >
          <Flame size={18} style={{ color: 'var(--accent)' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Welcome back, <span className="gradient-text">{settings.userName}</span>!
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {rate}% completion · {overdue.length > 0 ? `${overdue.length} overdue` : 'All on track!'}
            </p>
          </div>
          <Award size={16} className="ml-auto" style={{ color: rate >= 80 ? '#eab308' : 'var(--text-muted)' }} />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            icon: <Target size={18} />,
            label: 'Total Tasks',
            val: total,
            sub: `${completed} completed`,
            color: 'var(--accent)',
            delay: 0,
          },
          {
            icon: <CheckCircle2 size={18} />,
            label: 'Completion',
            val: `${rate}%`,
            sub: `${completed}/${total} done`,
            color: '#22c55e',
            delay: 60,
          },
          {
            icon: <Clock size={18} />,
            label: 'In Progress',
            val: tasks.filter(t => t.status === 'in-progress').length,
            sub: 'active tasks',
            color: '#3b82f6',
            delay: 120,
          },
          {
            icon: <AlertTriangle size={18} />,
            label: 'Overdue',
            val: overdue.length,
            sub: 'need attention',
            color: overdue.length > 0 ? '#ef4444' : '#22c55e',
            delay: 180,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-2xl p-4 card-shimmer anim-fade-up"
            style={{ animationDelay: `${stat.delay}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl" style={{ background: stat.color + '15', color: stat.color }}>
                {stat.icon}
              </div>
              <Zap size={11} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            </div>
            <p className="text-2xl font-black font-mono" style={{ color: stat.color }}>{stat.val}</p>
            <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ring */}
        <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center card-shimmer anim-fade-up">
          <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
            Overall Progress
          </p>
          <div className="relative w-32 h-32">
            <svg width="128" height="128" viewBox="0 0 128 128">
              {/* Track */}
              <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="10" />
              {/* Progress */}
              <circle
                cx="64" cy="64" r={radius}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                className="progress-ring"
                style={{
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
                  filter: 'drop-shadow(0 0 8px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.5))',
                }}
              />
              {/* Inner ring */}
              <circle cx="64" cy="64" r="38" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono" style={{ color: 'var(--accent)' }}>{rate}%</span>
              <span className="text-[9px] font-semibold" style={{ color: 'var(--text-muted)' }}>complete</span>
            </div>
          </div>
          <div className="mt-4 w-full space-y-1">
            <div className="flex justify-between text-[10px]">
              <span style={{ color: 'var(--text-muted)' }}>Tasks</span>
              <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>{completed}/{total}</span>
            </div>
            {totalSubs > 0 && (
              <div className="flex justify-between text-[10px]">
                <span style={{ color: 'var(--text-muted)' }}>Subtasks</span>
                <span className="font-mono font-bold" style={{ color: '#8b5cf6' }}>{doneSubs}/{totalSubs} ({subRate}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* By Status */}
        <div className="glass rounded-2xl p-5 card-shimmer anim-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={13} style={{ color: 'var(--accent)' }} />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>By Status</p>
          </div>
          <div className="space-y-3">
            {byStatus.map(s => (
              <div key={s.status}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span className="text-xs font-mono font-black" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width:  total > 0 ? `${(s.count / total) * 100}%` : '0',
                      background: s.color,
                      boxShadow: `0 0 8px ${s.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Priority */}
        <div className="glass rounded-2xl p-5 card-shimmer anim-fade-up" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={13} style={{ color: 'var(--accent)' }} />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>By Priority</p>
          </div>
          <div className="space-y-3">
            {byPriority.map(p => (
              <div key={p.priority}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
                  <span className="text-xs font-mono font-black" style={{ color: p.color }}>{p.count}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width:  total > 0 ? `${(p.count / total) * 100}%` : '0',
                      background: p.color,
                      boxShadow: `0 0 8px ${p.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        {byCategory.length > 0 && (
          <div className="glass rounded-2xl p-5 card-shimmer anim-fade-up">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
              Category Breakdown
            </p>
            <div className="space-y-3">
              {byCategory.map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-base leading-none">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>
                        {c.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold ml-2 flex-shrink-0"
                            style={{ color: c.color }}>
                        {c.done}/{c.count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: c.count > 0 ? `${(c.done / c.count) * 100}%` : '0',
                          background: c.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming & Overdue */}
        <div className="glass rounded-2xl p-5 card-shimmer anim-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={13} style={{ color: 'var(--accent)' }} />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Upcoming Deadlines
            </p>
          </div>
          <div className="space-y-2">
            {overdue.slice(0, 3).map(task => (
              <div
                key={task.id}
                onClick={() => openTask(task)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <AlertTriangle size={11} style={{ color: '#ef4444', flexShrink: 0 }} />
                <span className="text-xs font-semibold flex-1 truncate" style={{ color: '#ef4444' }}>
                  {task.title}
                </span>
                <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#ef4444' }}>
                  {formatDate(task.dueDate!)}
                </span>
              </div>
            ))}
            {upcoming.map(task => (
              <div
                key={task.id}
                onClick={() => openTask(task)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all glass"
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: task.color }} />
                <span className="text-xs font-semibold flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
                  {task.title}
                </span>
                <span className="text-[10px] font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(task.dueDate!)}
                </span>
              </div>
            ))}
            {overdue.length === 0 && upcoming.length === 0 && (
              <div className="empty-state py-8">
                <div className="empty-icon">
                  <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
                </div>
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>All caught up! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacer for mobile nav */}
      <div className="h-2 lg:h-0" />
    </div>
  );
}
