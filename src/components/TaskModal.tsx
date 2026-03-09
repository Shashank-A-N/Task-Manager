import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../store';
import { Status, Priority, SubTask, STATUS_LABELS, PRIORITY_LABELS } from '../types';

const gid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const ACCENT_COLORS = [
  '#06b6d4','#3b82f6','#8b5cf6','#ec4899',
  '#ef4444','#f97316','#eab308','#22c55e',
  '#10b981','#6366f1','#14b8a6','#f43f5e',
];

interface FormData {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  categoryId: string;
  tagIds: string[];
  dueDate: string;
  color: string;
  subtasks: SubTask[];
}

export default function TaskModal() {
  const {
    showTaskModal, setShowTaskModal, editingTask, setEditingTask,
    addTask, updateTask, deleteTask, categories, tags,
  } = useApp();

  const blank: FormData = {
    title: '', description: '', status: 'todo', priority: 'medium',
    categoryId: categories[0]?.id || '', tagIds: [], dueDate: '', color: '#06b6d4',
    subtasks: [],
  };

  const [form, setForm]       = useState<FormData>(blank);
  const [newSub, setNewSub]   = useState('');
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title:       editingTask.title,
        description: editingTask.description,
        status:      editingTask.status,
        priority:    editingTask.priority,
        categoryId:  editingTask.categoryId,
        tagIds:      [...editingTask.tagIds],
        dueDate:     editingTask.dueDate || '',
        color:       editingTask.color,
        subtasks:    editingTask.subtasks.map(s => ({ ...s })),
      });
    } else {
      setForm({ ...blank, categoryId: categories[0]?.id || '' });
    }
    setConfirmDel(false);
    setNewSub('');
  }, [editingTask, showTaskModal]); // eslint-disable-line

  if (!showTaskModal) return null;

  const close = () => { setShowTaskModal(false); setEditingTask(null); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const data = {
      title:       form.title.trim(),
      description: form.description.trim(),
      status:      form.status,
      priority:    form.priority,
      categoryId:  form.categoryId,
      tagIds:      form.tagIds,
      dueDate:     form.dueDate || null,
      color:       form.color,
      subtasks:    form.subtasks,
      completed:   form.status === 'done',
    };
    if (editingTask) updateTask(editingTask.id, data);
    else addTask(data);
    close();
  };

  const handleDelete = () => {
    if (confirmDel && editingTask) { deleteTask(editingTask.id); close(); }
    else setConfirmDel(true);
  };

  const addSubtask = () => {
    if (!newSub.trim()) return;
    setForm(p => ({ ...p, subtasks: [...p.subtasks, { id: gid(), title: newSub.trim(), completed: false }] }));
    setNewSub('');
  };

  const toggleTag = (id: string) => {
    setForm(p => ({
      ...p,
      tagIds: p.tagIds.includes(id) ? p.tagIds.filter(t => t !== id) : [...p.tagIds, id],
    }));
  };

  const inp: React.CSSProperties = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 14,
    width: '100%',
  };

  const label = (text: string, sub?: string) => (
    <label className="text-[11px] font-bold uppercase tracking-widest block mb-2"
           style={{ color: 'var(--text-muted)' }}>
      {text}{sub && <span className="ml-1 normal-case tracking-normal font-normal">{sub}</span>}
    </label>
  );

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-bg" />
      <div className="modal-box anim-scale" onClick={e => e.stopPropagation()}>

        {/* Accent top bar */}
        <div className="h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, var(--accent), #818cf8, #c084fc)` }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-black font-mono gradient-text">
              {editingTask ? '✏️ Edit Task' : '✨ New Task'}
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {editingTask ? 'Update task details' : 'Add a task to your workspace'}
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-xl transition-all hover:opacity-70"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="neon-line mx-6" />

        {/* Form Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            {label('Title', '*')}
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="What needs to be done?"
              style={inp}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            {label('Description')}
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Add details, notes, or context..."
              rows={3}
              style={{ ...inp, resize: 'vertical' as const, minHeight: 80 }}
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              {label('Status')}
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as Status }))}
                style={inp}
              >
                {(Object.keys(STATUS_LABELS) as Status[]).map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              {label('Priority')}
              <select
                value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))}
                style={inp}
              >
                {(Object.keys(PRIORITY_LABELS) as Priority[]).map(p => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              {label('Category')}
              <select
                value={form.categoryId}
                onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                style={inp}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              {label('Due Date')}
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                style={inp}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            {label('Tags')}
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const on = form.tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: on ? tag.color : 'var(--bg-input)',
                      color:      on ? '#fff' : 'var(--text-secondary)',
                      border:     `1px solid ${on ? tag.color : 'var(--border-color)'}`,
                      transform:  on ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {on && '✓ '}{tag.name}
                  </button>
                );
              })}
              {tags.length === 0 && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No tags — add them in Settings</p>
              )}
            </div>
          </div>

          {/* Card Color */}
          <div>
            {label('Card Accent Color')}
            <div className="flex flex-wrap items-center gap-2.5">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(p => ({ ...p, color: c }))}
                  className="w-7 h-7 rounded-full transition-all hover:scale-110"
                  style={{
                    background: c,
                    boxShadow: form.color === c
                      ? `0 0 0 2px var(--bg-secondary), 0 0 0 4px ${c}, 0 0 12px ${c}60`
                      : 'none',
                    transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
              {/* Custom */}
              <div className="relative w-7 h-7 rounded-full overflow-hidden" style={{ border: `2px solid ${form.color}` }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div className="w-full h-full rounded-full" style={{ background: form.color }} />
              </div>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            {label('Subtasks', `(${form.subtasks.filter(s => s.completed).length}/${form.subtasks.length} done)`)}
            <div className="space-y-1.5 mb-3">
              {form.subtasks.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
                >
                  <button
                    onClick={() => setForm(p => ({
                      ...p,
                      subtasks: p.subtasks.map(s => s.id === sub.id ? { ...s, completed: !s.completed } : s),
                    }))}
                    style={{ color: sub.completed ? '#22c55e' : 'var(--text-muted)', flexShrink: 0 }}
                  >
                    {sub.completed ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                  <span
                    className={`flex-1 text-sm ${sub.completed ? 'line-through' : ''}`}
                    style={{ color: sub.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}
                  >
                    {sub.title}
                  </span>
                  <button
                    onClick={() => setForm(p => ({ ...p, subtasks: p.subtasks.filter(s => s.id !== sub.id) }))}
                    className="p-0.5 transition-all hover:opacity-70 flex-shrink-0"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {form.subtasks.length === 0 && (
                <p className="text-xs py-1 px-1" style={{ color: 'var(--text-muted)' }}>No subtasks yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={newSub}
                onChange={e => setNewSub(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSubtask()}
                placeholder="Add a subtask and press Enter..."
                style={{ ...inp, flex: 1 }}
              />
              <button
                onClick={addSubtask}
                className="px-3.5 rounded-xl text-white flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="neon-line mx-6" />
        <div className="px-6 py-4 flex items-center gap-3">
          {editingTask && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background:  confirmDel ? '#ef4444' : 'rgba(239,68,68,0.08)',
                color:       confirmDel ? '#fff'    : '#ef4444',
                border:      '1px solid rgba(239,68,68,0.3)',
              }}
            >
              {confirmDel ? '⚠ Confirm Delete' : 'Delete'}
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={close}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white transition-all btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
