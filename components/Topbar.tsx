'use client';

import { ViewMode } from '@/types';
import { useState } from 'react';

interface Props {
  dateLabel: string;
  viewMode: ViewMode;
  search: string;
  theme: 'dark' | 'light';
  onViewChange: (v: ViewMode) => void;
  onSearchChange: (s: string) => void;
  onThemeToggle: () => void;
  onMenuToggle: () => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

export default function Topbar({
  dateLabel, viewMode, search, theme,
  onViewChange, onSearchChange, onThemeToggle, onMenuToggle, onRefresh,
  lastUpdated,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 h-[60px] transition-colors duration-300"
      style={{
        background: 'rgba(4,6,15,0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 0 rgba(99,102,241,0.08), 0 8px 32px rgba(0,0,0,0.35)',
      }}>

      {/* Gradient glow line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.35) 30%, rgba(139,92,246,0.25) 60%, transparent 100%)' }} />

      {/* ── Left Area ── */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.8)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
            <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-[0.95rem] font-bold text-white tracking-tight whitespace-nowrap">
            ASX Intelligence
          </h1>

          <div className="hidden sm:flex items-center gap-2">
            {/* Separator dot */}
            <span className="w-1 h-1 rounded-full bg-slate-700" />

            {/* Live badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="font-mono text-[0.58rem] font-black uppercase tracking-[0.14em] text-emerald-400">
                Live
              </span>
            </div>

            {/* Date pill */}
            {dateLabel && (
              <span className="font-mono text-[0.72rem] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: 'rgba(165,180,252,0.9)' }}>
                {dateLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Area ── */}
      <div className="flex items-center gap-2.5 flex-shrink-0">

        {/* Last Updated + Refresh */}
        <div className="flex items-center gap-1">
          {lastUpdated && (
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.14em]" style={{ color: 'rgba(100,116,139,0.8)' }}>
                Updated
              </span>
              <span className="font-mono text-[0.7rem] font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
                {lastUpdated.toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          )}
          <button
            onClick={onRefresh}
            title="Refresh"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 hover:text-indigo-400"
            style={{ color: 'rgba(100,116,139,0.7)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-5 hidden sm:block" style={{ background: 'rgba(255,255,255,0.07)' }} />

        {/* Search */}
        <div className="relative flex items-center">
          <svg className={`absolute left-3.5 w-3.5 h-3.5 pointer-events-none transition-colors duration-150
            ${focused ? 'text-indigo-400' : 'text-slate-600'}`}
            viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search tickers, companies..."
            className="text-slate-200 text-[0.82rem] font-medium pl-9 pr-4 py-2 outline-none rounded-full placeholder:text-slate-600"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: focused ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
              boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
              width: focused ? '240px' : '200px',
              transition: 'width 0.2s ease, border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          />
          {search && (
            <button onClick={() => onSearchChange('')}
              className="absolute right-3 text-slate-500 hover:text-white transition-colors">
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                <path d="M4 12L12 4M4 4l8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg p-0.5 gap-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {(['grid', 'list'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              title={`${v === 'grid' ? 'Grid' : 'List'} View`}
              className="w-8 h-7 flex items-center justify-center rounded-md transition-all duration-150"
              style={viewMode === v ? {
                background: 'rgba(99,102,241,0.2)',
                color: 'rgba(165,180,252,1)',
                border: '1px solid rgba(99,102,241,0.3)',
              } : {
                color: 'rgba(100,116,139,0.8)',
                border: '1px solid transparent',
              }}
            >
              {v === 'grid' ? (
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          title="Toggle Theme"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 hover:text-indigo-400"
          style={{ color: 'rgba(100,116,139,0.7)' }}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
