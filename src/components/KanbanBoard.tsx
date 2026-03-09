import React, { useState } from 'react';
import { useApp } from '../store';
import { Status, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS } from '../types';
import { CalendarDays, CheckCircle2, Plus, GripVertical } from 'lucide-react';

const STATUSES: Status[] = ['todo', 'in-progress', 'review', 'done'];

const COL_ICONS: Record<Status, string> = {
  'todo': '📋',
  'in-progress': '⚡',
  'review': '🔍',
  'done': '✅',
};

export default function KanbanBoard() {
  const {
    filteredTasks, moveTask, setEditingTask, setShowTaskModal,
    categories, tags, settings, setEditingTask: openEdit,
  } = useApp();
  const [dragOver, setDragOver]   = useState<string | null>(null);
  const [dragging, setDragging]   = useState<string | null>(null);
  const compact = settings.density === 'compact';

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDragging(taskId);
  };
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(status);
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) moveTask(taskId, status);
    setDragOver(null);
  };

  const openTask = (task: typeof filteredTasks[0]) => {
    openEdit(task);
    setShowTaskModal(true);
  };

  const handleNewInCol = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const isOverdue = (date: string | null) => {
    if (!date) return false;
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

  return (
    <div className="kanban-scroll">
      {STATUSES.map(status => {
        const colTasks = filteredTasks.filter(t => t.status === status);
        const isTarget = dragOver === status;

        return (
          <div
            key={status}
            className={`kanban-col ${isTarget ? 'drag-over' : ''}`}
            style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${isTarget ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.35)' : 'var(--border-color)'}`,
            }}
            onDragOver={e => handleDragOver(e, status)}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
            onDrop={e => handleDrop(e, status)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0">
              <span className="text-base leading-none">{COL_ICONS[status]}</span>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: STATUS_COLORS[status], boxShadow: `0 0 6px ${STATUS_COLORS[status]}60` }}
              />
              <h3 className="text-sm font-bold font-mono flex-1 truncate"
                  style={{ color: 'var(--text-primary)' }}>
                {STATUS_LABELS[status]}
              </h3>
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: STATUS_COLORS[status] + '18', color: STATUS_COLORS[status] }}
              >
                {colTasks.length}
              </span>
              <button
                onClick={() => handleNewInCol(status)}
                className="p-1 rounded-lg transition-all hover:opacity-70 flex-shrink-0"
                style={{ color: 'var(--text-muted)' }}
                title="Add task"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Column progress bar */}
            <div className="px-4 pb-2 flex-shrink-0">
              <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: filteredTasks.length > 0 ? `${(colTasks.length / filteredTasks.length) * 100}%` : '0',
                    background: STATUS_COLORS[status],
                  }}
                />
              </div>
            </div>

            {/* Cards */}
            <div className="kanban-cards">
              {colTasks.map((task, i) => {
                const cat      = categories.find(c => c.id === task.categoryId);
                const taskTags = tags.filter(t => task.tagIds.includes(t.id));
                const subDone  = task.subtasks.filter(s => s.completed).length;
                const subTotal = task.subtasks.length;
                const overdue  = isOverdue(task.dueDate) && !task.completed;
                const isDragged = dragging === task.id;

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={e => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => openTask(task)}
                    className="glass card-shimmer rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] anim-fade-up"
                    style={{
                      animationDelay: `${i * 35}ms`,
                      borderLeft: `3px solid ${task.color}`,
                      padding: compact ? '10px 12px' : '14px 14px',
                      opacity: isDragged ? 0.5 : 1,
                      transform: isDragged ? 'rotate(2deg)' : undefined,
                    }}
                  >
                    {/* Top row */}
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className={`badge-${task.priority} px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex-shrink-0`}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      <span className="flex-1" />
                      {cat && (
                        <span className="text-[10px] leading-none flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                          {cat.icon}
                        </span>
                      )}
                      <GripVertical size={11} className="flex-shrink-0 opacity-30" style={{ color: 'var(--text-muted)' }} />
                    </div>

                    {/* Title */}
                    <h4
                      className={`font-bold leading-snug mb-1 ${compact ? 'text-xs' : 'text-sm'} ${task.completed ? 'line-through opacity-40' : ''}`}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {task.title}
                    </h4>

                    {/* Description */}
                    {!compact && task.description && (
                      <p className="text-[11px] leading-relaxed mb-2.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {task.description}
                      </p>
                    )}

                    {/* Tags */}
                    {taskTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {taskTags.slice(0, 3).map(tag => (
                          <span
                            key={tag.id}
                            className="px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                            style={{ background: tag.color + '22', color: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                        {taskTags.length > 3 && (
                          <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                            +{taskTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Subtask bar */}
                    {subTotal > 0 && (
                      <div className="mb-2">
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${(subDone / subTotal) * 100}%`, background: task.color }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Bottom meta */}
                    <div className="flex items-center gap-3 mt-1">
                      {task.dueDate && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-medium"
                          style={{ color: overdue ? '#ef4444' : 'var(--text-muted)' }}
                        >
                          <CalendarDays size={9} />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                      {subTotal > 0 && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          <CheckCircle2 size={9} />
                          {subDone}/{subTotal}
                        </span>
                      )}
                      {cat && (
                        <span className="ml-auto text-[10px] truncate" style={{ color: cat.color }}>
                          {cat.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="empty-state py-8">
                  <div className="empty-icon">
                    <span className="text-xl">{COL_ICONS[status]}</span>
                  </div>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Drop tasks here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
