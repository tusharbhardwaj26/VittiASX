'use client';

import { Announcement } from '@/types';
import { formatTime, isBullish, tagClass, TAG_BG } from '@/lib/utils';

interface Props {
  ann: Announcement;
}

export default function AnnouncementRow({ ann }: Props) {
  const bullish = isBullish(ann);
  const sensitive = ann.market_sensitive;

  return (
    <div
      className="group flex items-center gap-4 px-5 py-3 rounded-[14px] cursor-default select-none transition-all duration-150"
      style={{
        background: bullish
          ? 'rgba(16,185,129,0.08)'
          : 'rgba(255,255,255,0.025)',
        border: bullish
          ? '1px solid rgba(16,185,129,0.18)'
          : 'none',
        borderLeft: bullish
          ? '3px solid #10b981'
          : '3px solid transparent',
      }}
    >

      {/* ── Ticker + Signals ── */}
      <div className="flex flex-col items-center gap-1.5 w-[76px] flex-shrink-0">
        <span className="font-mono text-[0.78rem] font-black tracking-[0.05em] px-2 py-1 rounded-lg text-white w-full text-center"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {ann.ticker}
        </span>

        {bullish && (
          <span className="flex items-center gap-0.5 font-mono text-[0.52rem] font-bold uppercase tracking-[0.06em]"
            style={{ color: '#34d399' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Bullish
          </span>
        )}

        {sensitive && (
          <span className="flex items-center gap-1 font-mono text-[0.52rem] font-bold uppercase tracking-[0.05em]"
            style={{ color: '#fb7185' }}>
            <span className="relative flex h-1 w-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1 w-1 bg-rose-500" />
            </span>
            Sensitive
          </span>
        )}
      </div>

      {/* ── Company + Time ── */}
      <div className="w-[148px] flex-shrink-0 flex flex-col justify-center pr-4" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[0.82rem] font-semibold text-slate-200 truncate" title={ann.company}>
          {ann.company}
        </div>
        <div className="font-mono text-[0.65rem] mt-0.5 flex items-center gap-1" style={{ color: 'rgba(100,116,139,0.7)' }}>
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 flex-shrink-0">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {formatTime(ann.time)}
        </div>
      </div>

      {/* ── Headline + Tags + Link ── */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
        <a
          href={ann.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 block"
        >
          <span className="text-[0.875rem] font-medium text-slate-300 line-clamp-1 leading-snug tracking-[-0.01em]
            group-hover:text-indigo-400 transition-colors duration-150">
            {ann.headline}
          </span>
        </a>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {ann.tags.slice(0, 2).map(tag => {
            const cls = tagClass(tag);
            return (
              <span key={tag} className={`hidden md:inline font-mono text-[0.57rem] font-bold uppercase tracking-[0.1em]
                px-2 py-0.5 rounded-md border ${TAG_BG[cls] ?? TAG_BG['']}`}>
                {tag}
              </span>
            );
          })}
        </div>

        {/* External link button */}
        <a
          href={ann.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150"
          style={{ color: 'rgba(100,116,139,0.6)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(165,180,252,0.9)';
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(99,102,241,0.1)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(99,102,241,0.25)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(100,116,139,0.6)';
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
          }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
            <path d="M4.5 11.5L11.5 4.5M11.5 4.5H6.5M11.5 4.5V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
