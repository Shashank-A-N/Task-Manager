import React, { useState } from 'react';
import {
  X, Plus, Trash2, Palette, Moon, Sun, Sparkles, Monitor,
  Edit2, Check, User, Download, Upload, RotateCcw,
} from 'lucide-react';
import { useApp } from '../store';
import { ThemeMode, Density } from '../types';

const ACCENT_COLORS = [
  '#06b6d4','#3b82f6','#6366f1','#8b5cf6',
  '#a855f7','#ec4899','#ef4444','#f97316',
  '#eab308','#22c55e','#10b981','#14b8a6',
];

const THEMES: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string; preview: string }[] = [
  { id: 'dark',      label: 'Dark',      icon: <Moon size={16} />,     desc: 'Deep dark space',   preview: '#06060e' },
  { id: 'light',     label: 'Light',     icon: <Sun size={16} />,      desc: 'Clean & minimal',   preview: '#f1f4f9' },
  { id: 'midnight',  label: 'Midnight',  icon: <Sparkles size={16} />, desc: 'Deep blue night',   preview: '#010b1e' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: <Monitor size={16} />,  desc: 'Neon & electric',   preview: '#080808' },
];

const EMOJIS = ['👤','💼','💪','📚','💰','🎨','🏠','🎮','✈️','🎵','🔧','📱','🍕','⭐','🔬','🌍','🚀','💡','🎯','📌'];

export default function SettingsPanel() {
  const {
    showSettings, setShowSettings, settings, updateSettings,
    categories, addCategory, updateCategory, deleteCategory,
    tags, addTag, updateTag, deleteTag,
  } = useApp();

  const [newCatName,  setNewCatName]  = useState('');
  const [newCatColor, setNewCatColor] = useState('#06b6d4');
  const [newCatIcon,  setNewCatIcon]  = useState('📌');
  const [newTagName,  setNewTagName]  = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [editCatId,   setEditCatId]   = useState<string | null>(null);
  const [editTagId,   setEditTagId]   = useState<string | null>(null);
  const [editValue,   setEditValue]   = useState('');
  const [activeTab,   setActiveTab]   = useState<'appearance'|'categories'|'tags'|'data'>('appearance');

  if (!showSettings) return null;

  const inp: React.CSSProperties = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 13,
  };

  const handleAddCat = () => {
    if (!newCatName.trim()) return;
    addCategory({ name: newCatName.trim(), color: newCatColor, icon: newCatIcon });
    setNewCatName('');
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    addTag({ name: newTagName.trim(), color: newTagColor });
    setNewTagName('');
  };

  const handleResetData = () => {
    if (confirm('Reset ALL data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExport = () => {
    const data = {
      tasks:      localStorage.getItem('ntx-tasks'),
      categories: localStorage.getItem('ntx-cats'),
      tags:       localStorage.getItem('ntx-tags'),
      settings:   localStorage.getItem('ntx-settings'),
      exported:   new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `nextask-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.tasks)      localStorage.setItem('ntx-tasks',    data.tasks);
          if (data.categories) localStorage.setItem('ntx-cats',     data.categories);
          if (data.tags)       localStorage.setItem('ntx-tags',     data.tags);
          if (data.settings)   localStorage.setItem('ntx-settings', data.settings);
          window.location.reload();
        } catch { alert('Invalid backup file'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const tabs = [
    { id: 'appearance' as const, label: 'Appearance', icon: <Palette size={14} /> },
    { id: 'categories' as const, label: 'Categories', icon: <span>📁</span> },
    { id: 'tags'       as const, label: 'Tags',        icon: <span>🏷️</span> },
    { id: 'data'       as const, label: 'Data',        icon: <span>💾</span> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setShowSettings(false)}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} />
      <div
        className="relative h-full flex flex-col anim-slide-r"
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Accent top */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, var(--accent), #818cf8, #c084fc)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12)', color: 'var(--accent)' }}>
              <Palette size={16} />
            </div>
            <div>
              <h2 className="text-base font-black font-mono gradient-text">Settings</h2>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Customize your workspace</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 rounded-xl transition-all btn-ghost"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 px-4 pb-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all"
              style={{
                background: activeTab === t.id
                  ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12)'
                  : 'transparent',
                color: activeTab === t.id ? 'var(--accent)' : 'var(--text-muted)',
                border: activeTab === t.id
                  ? '1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25)'
                  : '1px solid transparent',
              }}
            >
              {t.icon}
              <span className="hide-mobile">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* ── APPEARANCE ── */}
          {activeTab === 'appearance' && (
            <>
              {/* User Name */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <User size={13} style={{ color: 'var(--accent)' }} />
                  <h3 className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Your Name
                  </h3>
                </div>
                <input
                  value={settings.userName}
                  onChange={e => updateSettings({ userName: e.target.value })}
                  placeholder="Enter your name..."
                  style={{ ...inp, width: '100%' }}
                />
              </section>

              {/* Theme */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Theme
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => updateSettings({ theme: t.id })}
                      className="flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all"
                      style={{
                        background: settings.theme === t.id
                          ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1)'
                          : 'var(--bg-card)',
                        border: `1px solid ${settings.theme === t.id
                          ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.35)'
                          : 'var(--border-color)'}`,
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: t.preview, border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <span style={{ color: settings.theme === t.id ? 'var(--accent)' : '#94a3b8' }}>
                          {t.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: settings.theme === t.id ? 'var(--accent)' : 'var(--text-primary)' }}>
                          {t.label}
                        </p>
                        <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Accent Color */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Accent Color
                </h3>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => updateSettings({ accentColor: c })}
                      className="w-8 h-8 rounded-full transition-all hover:scale-110"
                      style={{
                        background: c,
                        boxShadow: settings.accentColor === c
                          ? `0 0 0 2px var(--bg-secondary), 0 0 0 4px ${c}, 0 0 16px ${c}60`
                          : 'none',
                        transform: settings.accentColor === c ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                  {/* Custom picker */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden"
                       style={{ border: `2px solid ${settings.accentColor}` }}>
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={e => updateSettings({ accentColor: e.target.value })}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    />
                    <div className="w-full h-full" style={{ background: settings.accentColor }} />
                  </div>
                </div>
                <p className="text-[10px] mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                  Current: {settings.accentColor}
                </p>
              </section>

              {/* Density */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Display Density
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['compact', 'comfortable'] as Density[]).map(d => (
                    <button
                      key={d}
                      onClick={() => updateSettings({ density: d })}
                      className="py-2.5 rounded-xl text-xs font-bold transition-all capitalize"
                      style={{
                        background: settings.density === d
                          ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1)'
                          : 'var(--bg-card)',
                        border: `1px solid ${settings.density === d
                          ? 'rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.35)'
                          : 'var(--border-color)'}`,
                        color: settings.density === d ? 'var(--accent)' : 'var(--text-secondary)',
                      }}
                    >
                      {d === 'compact' ? '📦 Compact' : '🌟 Comfortable'}
                    </button>
                  ))}
                </div>
              </section>

              {/* Toggles */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Preferences
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Show completed tasks', key: 'showCompletedTasks' as const, val: settings.showCompletedTasks, desc: 'Display tasks with done status' },
                    { label: 'Enable animations',    key: 'enableAnimations'    as const, val: settings.enableAnimations,    desc: 'Smooth transitions & effects' },
                  ].map(opt => (
                    <div
                      key={opt.key}
                      className="flex items-center justify-between p-3 rounded-2xl cursor-pointer"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                      onClick={() => updateSettings({ [opt.key]: !opt.val })}
                    >
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{opt.label}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                      </div>
                      <div
                        className="toggle flex-shrink-0"
                        style={{ background: opt.val ? 'var(--accent)' : 'var(--border-glow)' }}
                      >
                        <div className="toggle-thumb" style={{ left: opt.val ? 22 : 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── CATEGORIES ── */}
          {activeTab === 'categories' && (
            <section>
              <div className="space-y-1.5 mb-4">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2.5 p-3 rounded-2xl"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                  >
                    <span style={{ fontSize: 16 }}>{cat.icon}</span>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    {editCatId === cat.id ? (
                      <>
                        <input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          style={{ ...inp, flex: 1, fontSize: 12, padding: '4px 8px' }}
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') { updateCategory(cat.id, { name: editValue }); setEditCatId(null); }
                          }}
                        />
                        <button
                          onClick={() => { updateCategory(cat.id, { name: editValue }); setEditCatId(null); }}
                          style={{ color: '#22c55e' }}
                        >
                          <Check size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {cat.name}
                        </span>
                        <input
                          type="color"
                          value={cat.color}
                          onChange={e => updateCategory(cat.id, { color: e.target.value })}
                          className="w-5 h-5 rounded-full cursor-pointer border-0 p-0"
                        />
                        <button
                          onClick={() => { setEditCatId(cat.id); setEditValue(cat.name); }}
                          className="p-1 transition-all hover:opacity-70"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1 transition-all hover:opacity-70"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Category */}
              <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Add Category
                </h4>
                <div className="flex gap-2">
                  <select
                    value={newCatIcon}
                    onChange={e => setNewCatIcon(e.target.value)}
                    style={{ ...inp, width: 56, padding: '8px 4px', textAlign: 'center' }}
                  >
                    {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <input
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Category name..."
                    onKeyDown={e => e.key === 'Enter' && handleAddCat()}
                    style={{ ...inp, flex: 1 }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden" style={{ border: `2px solid ${newCatColor}` }}>
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={e => setNewCatColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-full h-full" style={{ background: newCatColor }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{newCatColor}</span>
                  <button
                    onClick={handleAddCat}
                    disabled={!newCatName.trim()}
                    className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40"
                    style={{ background: 'var(--accent)' }}
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ── TAGS ── */}
          {activeTab === 'tags' && (
            <section>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full group"
                    style={{ background: tag.color + '18', border: `1px solid ${tag.color}40` }}
                  >
                    {editTagId === tag.id ? (
                      <>
                        <input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="w-20 text-[11px] bg-transparent border-0 outline-none p-0"
                          style={{ color: tag.color }}
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') { updateTag(tag.id, { name: editValue }); setEditTagId(null); }
                          }}
                        />
                        <button
                          onClick={() => { updateTag(tag.id, { name: editValue }); setEditTagId(null); }}
                          style={{ color: tag.color }}
                        >
                          <Check size={10} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold" style={{ color: tag.color }}>{tag.name}</span>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative w-3 h-3 rounded-full overflow-hidden">
                            <input
                              type="color"
                              value={tag.color}
                              onChange={e => updateTag(tag.id, { color: e.target.value })}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="w-full h-full rounded-full" style={{ background: tag.color }} />
                          </div>
                          <button
                            onClick={() => { setEditTagId(tag.id); setEditValue(tag.name); }}
                            style={{ color: tag.color }}
                          >
                            <Edit2 size={9} />
                          </button>
                          <button onClick={() => deleteTag(tag.id)} style={{ color: '#ef4444' }}>
                            <X size={9} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {tags.length === 0 && (
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No tags yet. Add your first one!</p>
                )}
              </div>

              {/* Add Tag */}
              <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h4 className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Add Tag
                </h4>
                <div className="flex items-center gap-3">
                  <input
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    placeholder="Tag name..."
                    onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                    style={{ ...inp, flex: 1 }}
                  />
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: `2px solid ${newTagColor}` }}>
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={e => setNewTagColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-full h-full" style={{ background: newTagColor }} />
                  </div>
                  <button
                    onClick={handleAddTag}
                    disabled={!newTagName.trim()}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40 flex-shrink-0"
                    style={{ background: 'var(--accent)' }}
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ── DATA ── */}
          {activeTab === 'data' && (
            <section className="space-y-4">
              <div className="glass rounded-2xl p-4">
                <h4 className="text-xs font-black mb-1" style={{ color: 'var(--text-primary)' }}>Backup & Restore</h4>
                <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
                  Export your data as JSON to back it up, or import a previous backup.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all btn-ghost"
                  >
                    <Download size={15} style={{ color: 'var(--accent)' }} />
                    <span>Export Backup (.json)</span>
                  </button>
                  <button
                    onClick={handleImport}
                    className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all btn-ghost"
                  >
                    <Upload size={15} style={{ color: '#22c55e' }} />
                    <span>Import Backup (.json)</span>
                  </button>
                </div>
              </div>

              <div
                className="rounded-2xl p-4"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <h4 className="text-xs font-black mb-1" style={{ color: '#ef4444' }}>Danger Zone</h4>
                <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                  This will permanently delete all your tasks, categories, tags, and settings.
                </p>
                <button
                  onClick={handleResetData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: '#ef4444', color: '#fff' }}
                >
                  <RotateCcw size={14} />
                  Reset All Data
                </button>
              </div>

              {/* App Info */}
              <div className="glass rounded-2xl p-4 text-center">
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-white font-black"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #818cf8)' }}
                >
                  N
                </div>
                <p className="text-xs font-black font-mono gradient-text">NexTask</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Advanced Task Manager v2.0</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>All data stored locally in your browser</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
