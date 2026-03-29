'use client';

import { Announcement } from '@/types';
import { formatTime, isBullish, tagClass, TAG_BG } from '@/lib/utils';

interface Props {
  ann: Announcement;
}

export default function AnnouncementCard({ ann }: Props) {
  const bullish = isBullish(ann);
  const sensitive = ann.market_sensitive;

  // Determine the card's border/accent style
  const accentStyle = bullish
    ? { borderLeft: '3px solid #10b981', boxShadow: '-4px 0 20px rgba(16,185,129,0.1)' }
    : {};

  return (
    <div
      className="group relative flex flex-col gap-3.5 p-5 rounded-[18px] cursor-default select-none transition-all duration-200 hover:-translate-y-1"
      style={{
        background: bullish
          ? 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(10,13,28,0.95) 50%)'
          : 'rgba(10,13,28,0.9)',
        border: bullish
          ? '1px solid rgba(16,185,129,0.25)'
          : 'none',
        boxShadow: bullish 
          ? '0 4px 24px rgba(0,0,0,0.35), 0 0 15px rgba(16,185,129,0.05)'
          : '0 4px 24px rgba(0,0,0,0.35)',
        ...accentStyle,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = bullish
          ? '-4px 0 20px rgba(16,185,129,0.12), 0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(16,185,129,0.18)'
          : '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.15)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
      }}
    >

      {/* ── Meta row: ticker, badges, time ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Ticker */}
        <span className="font-mono text-[0.8rem] font-black tracking-[0.06em] px-2.5 py-1 rounded-lg text-white"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {ann.ticker}
        </span>

        {/* Bullish badge */}
        {bullish && (
          <span className="flex items-center gap-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Bullish
          </span>
        )}

        {/* Market sensitive badge */}
        {sensitive && (
          <span className="flex items-center gap-1.5 font-mono text-[0.58rem] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.28)', color: '#fb7185' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
            </span>
            Sensitive
          </span>
        )}

        {/* Time */}
        <div className="flex items-center gap-1 ml-auto font-mono text-[0.62rem]" style={{ color: 'rgba(100,116,139,0.8)' }}>
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 flex-shrink-0">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {formatTime(ann.time)}
        </div>
      </div>

      {/* ── Company name ── */}
      <div className="text-[0.65rem] font-black uppercase tracking-[0.18em] truncate -mt-1 transition-colors duration-150"
        style={{ color: 'rgba(100,116,139,0.65)' }}>
        {ann.company}
      </div>

      {/* ── Headline ── */}
      <a
        href={ann.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="block"
      >
        <h3 className="text-[0.93rem] font-semibold text-slate-100 leading-[1.6] line-clamp-2 tracking-[-0.01em]
          group-hover:text-indigo-400 transition-colors duration-150">
          {ann.headline}
        </h3>
        <span className="inline-flex items-center gap-1 mt-1.5 text-[0.65rem] font-medium transition-colors duration-150"
          style={{ color: 'rgba(99,102,241,0.6)' }}>
          View on ASX
          <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
            <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </a>

      {/* ── AI Summary ── */}
      {ann.summary && ann.summary.length > 0 && (
        <div className="rounded-xl p-3.5 mt-0.5" style={{
          background: 'rgba(255,255,255,0.028)',
          border: '1px solid rgba(255,255,255,0.055)',
        }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            {/* AI sparkle icon */}
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 flex-shrink-0" style={{ color: '#818cf8' }}>
              <path d="M8 1l1.2 4.8L14 8l-4.8 1.2L8 15l-1.2-4.8L2 8l4.8-1.2z" fill="currentColor" opacity="0.9"/>
            </svg>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'rgba(129,140,248,0.7)' }}>AI Summary</span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {ann.summary.slice(0, 3).map((point, i) => (
              <li key={i} className="relative pl-3.5 text-[0.8rem] leading-[1.65] line-clamp-2"
                style={{ color: 'rgba(203,213,225,0.82)' }}>
                <span className="absolute left-0 top-[8px] w-1 h-1 rounded-full"
                  style={{ background: 'rgba(129,140,248,0.5)' }} />
                {point.replace(/^[\s\-\*\•\d\.]+\s*/, '')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Tags ── */}
      {ann.tags && ann.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3.5 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {ann.tags.map(tag => {
            const cls = tagClass(tag);
            return (
              <span key={tag} className={`font-mono text-[0.58rem] font-bold uppercase tracking-[0.1em]
                px-2 py-0.5 rounded-md border ${TAG_BG[cls] ?? TAG_BG['']}`}>
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
