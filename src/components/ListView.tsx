import React from 'react';
import { useApp } from '../store';
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, SortField } from '../types';
import { ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, Circle, CalendarDays, MoreHorizontal, Trash2, Edit } from 'lucide-react';

export default function ListView() {
  const {
    filteredTasks, categories, tags,
    setEditingTask, setShowTaskModal, updateTask, deleteTask,
    sortField, sortDir, setSortField, setSortDir, settings,
  } = useApp();
  const compact = settings.density === 'compact';

  const openTask = (task: typeof filteredTasks[0]) => { setEditingTask(task); setShowTaskModal(true); };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleComplete = (e: React.MouseEvent, task: typeof filteredTasks[0]) => {
    e.stopPropagation();
    updateTask(task.id, { completed: !task.completed, status: task.completed ? 'todo' : 'done' });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this task?')) deleteTask(id);
  };

  const isOverdue = (date: string | null, completed: boolean) => {
    if (!date || completed) return false;
    return new Date(date + 'T00:00:00') < new Date(new Date().toDateString());
  };

  const formatDate = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const diff  = Math.ceil((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff < 0)  return `${Math.abs(diff)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={10} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />;
  };

  const thStyle: React.CSSProperties = {
    color: 'var(--text-muted)',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  return (
    <div className="h-full flex flex-col">
      {/* Desktop Table View */}
      <div className="h-full flex flex-col glass rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0 hide-mobile"
          style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}
        >
          <div className="w-8 flex-shrink-0" />
          <button
            onClick={() => handleSort('title')}
            className="flex-[3] min-w-0 flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            style={{ ...thStyle, color: sortField === 'title' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            Task <SortIcon field="title" />
          </button>
          <button
            onClick={() => handleSort('status')}
            className="w-28 flex-shrink-0 flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            style={{ ...thStyle, color: sortField === 'status' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            Status <SortIcon field="status" />
          </button>
          <button
            onClick={() => handleSort('priority')}
            className="w-24 flex-shrink-0 flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            style={{ ...thStyle, color: sortField === 'priority' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            Priority <SortIcon field="priority" />
          </button>
          <button
            onClick={() => handleSort('dueDate')}
            className="w-28 flex-shrink-0 flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            style={{ ...thStyle, color: sortField === 'dueDate' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            Due <SortIcon field="dueDate" />
          </button>
          <div className="w-28 flex-shrink-0" style={thStyle}>Category</div>
          <div className="flex-1 min-w-0" style={thStyle}>Tags</div>
          <div className="w-16 flex-shrink-0" style={thStyle}>Actions</div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {filteredTasks.map((task, i) => {
            const cat      = categories.find(c => c.id === task.categoryId);
            const taskTags = tags.filter(t => task.tagIds.includes(t.id));
            const overdue  = isOverdue(task.dueDate, task.completed);
            const subDone  = task.subtasks.filter(s => s.completed).length;
            const subTotal = task.subtasks.length;

            return (
              <div key={task.id}>
                {/* Desktop Row */}
                <div
                  className="hide-mobile flex items-center gap-3 px-4 cursor-pointer transition-all card-shimmer anim-fade-up"
                  style={{
                    animationDelay: `${i * 20}ms`,
                    padding: compact ? '8px 16px' : '12px 16px',
                    borderLeft: `3px solid ${task.color}`,
                    borderBottom: '1px solid var(--border-color)',
                    background: task.completed ? 'rgba(0,0,0,0.01)' : undefined,
                  }}
                  onClick={() => openTask(task)}
                >
                  {/* Checkbox */}
                  <button
                    className="w-8 flex-shrink-0 flex items-center justify-center transition-all hover:scale-110"
                    onClick={e => toggleComplete(e, task)}
                  >
                    {task.completed
                      ? <CheckCircle2 size={17} style={{ color: '#22c55e' }} />
                      : <Circle size={17} style={{ color: 'var(--border-glow)' }} />
                    }
                  </button>

                  {/* Title + subtasks */}
                  <div className="flex-[3] min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${task.completed ? 'line-through opacity-40' : ''}`}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {task.title}
                    </p>
                    {!compact && subTotal > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                          <div className="h-full rounded-full transition-all"
                               style={{ width: `${(subDone / subTotal) * 100}%`, background: task.color }} />
                        </div>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {subDone}/{subTotal}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="w-28 flex-shrink-0">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold"
                      style={{ background: STATUS_COLORS[task.status] + '18', color: STATUS_COLORS[task.status] }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[task.status] }} />
                      {STATUS_LABELS[task.status]}
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="w-24 flex-shrink-0">
                    <span className={`badge-${task.priority} px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider`}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="w-28 flex-shrink-0">
                    {task.dueDate ? (
                      <span className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: overdue ? '#ef4444' : 'var(--text-secondary)' }}>
                        <CalendarDays size={11} />
                        {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="w-28 flex-shrink-0">
                    {cat && (
                      <span className="text-xs font-medium" style={{ color: cat.color }}>
                        {cat.icon} {cat.name}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex-1 min-w-0 flex flex-wrap gap-1">
                    {taskTags.slice(0, 2).map(tag => (
                      <span key={tag.id} className="px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                            style={{ background: tag.color + '20', color: tag.color }}>
                        {tag.name}
                      </span>
                    ))}
                    {taskTags.length > 2 && (
                      <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>+{taskTags.length - 2}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-16 flex-shrink-0 flex items-center gap-1">
                    <button
                      onClick={e => { e.stopPropagation(); openTask(task); }}
                      className="p-1.5 rounded-lg transition-all hover:opacity-70"
                      style={{ color: 'var(--accent)' }}
                      title="Edit"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={e => handleDelete(e, task.id)}
                      className="p-1.5 rounded-lg transition-all hover:opacity-70"
                      style={{ color: '#ef4444' }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Mobile Card Row */}
                <div
                  className="show-desktop-only sm:hidden flex items-center gap-3 px-4 py-3 cursor-pointer anim-fade-up"
                  style={{
                    animationDelay: `${i * 20}ms`,
                    borderLeft: `3px solid ${task.color}`,
                    borderBottom: '1px solid var(--border-color)',
                  }}
                  onClick={() => openTask(task)}
                >
                  <button
                    className="flex-shrink-0"
                    onClick={e => toggleComplete(e, task)}
                    style={{ color: task.completed ? '#22c55e' : 'var(--border-glow)' }}
                  >
                    {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${task.completed ? 'line-through opacity-40' : ''}`}
                       style={{ color: 'var(--text-primary)' }}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge-${task.priority} px-1.5 py-0.5 rounded text-[8px] font-black uppercase`}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px]" style={{ color: overdue ? '#ef4444' : 'var(--text-muted)' }}>
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <MoreHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="empty-state h-full min-h-48">
              <div className="empty-icon">
                <ArrowUpDown size={22} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="text-sm font-mono font-bold" style={{ color: 'var(--text-muted)' }}>No tasks found</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} shown
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Sorted by {sortField} · {sortDir.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
