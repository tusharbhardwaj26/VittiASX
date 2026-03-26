'use client';

import { Announcement } from '@/types';
import { formatTime, isBullish, tagClass, TAG_BG } from '@/lib/utils';
import { useRef } from 'react';

interface Props {
  ann: Announcement;
}

export default function AnnouncementCard({ ann }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const bullish = isBullish(ann);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={[
        'card-spotlight group relative flex flex-col gap-4',
        'rounded-2xl p-5 border border-slate-200 dark:border-transparent',
        'bg-white dark:bg-[#0d1022] transition-colors duration-300 animate-fade-in-up',
        'cursor-default select-none',
        // Gradient border effect for dark mode (disabled in light mode)
        'dark:[background-image:linear-gradient(#0d1022,#0d1022)_padding-box,linear-gradient(160deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)_border-box]',
        'dark:hover:[background-image:linear-gradient(#111527,#111527)_padding-box,linear-gradient(160deg,rgba(99,102,241,0.6)_0%,rgba(167,139,250,0.5)_45%,rgba(6,182,212,0.35)_100%)_border-box]',
        'shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4)]',
        'hover:shadow-lg hover:border-indigo-300 dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.6),0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,102,241,0)]',
        'hover:-translate-y-1',
        // Market sensitive left bar
        ann.market_sensitive
          ? 'shadow-[inset_3px_0_0_rgba(244,63,94,0.8)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4),inset_3px_0_0_rgba(244,63,94,0.8)]'
          : '',
      ].filter(Boolean).join(' ')}
    >


      {/* Meta Row: Badges, Time, Type */}
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.05em] px-2 py-0.5 rounded-md
          bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-500/30 whitespace-nowrap">
          {ann.ticker}
        </span>
        
        {bullish && (
          <span className="font-mono text-[0.6rem] font-black tracking-[0.05em] px-2 py-0.5 rounded-md
            bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-500/30 whitespace-nowrap
            dark:animate-pulse-bullish shadow-sm">
            ▲ BULLISH
          </span>
        )}

        {ann.market_sensitive && (
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] font-bold tracking-[0.05em] px-2 py-0.5 rounded-md
            bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/30 whitespace-nowrap uppercase">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
            </span>
            SENSITIVE
          </span>
        )}

        <div className="flex items-center gap-1.5 ml-auto font-mono text-[0.65rem] text-slate-500 dark:text-slate-500">
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0 opacity-70">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {formatTime(ann.time)}
        </div>
      </div>

      {/* Company Name */}
      <div className="text-[0.78rem] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate -mt-1 group-hover:text-slate-300 transition-colors">
        {ann.company}
      </div>

      {/* Headline */}
      <a
        href={ann.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="block"
      >
        <h3 className="text-[0.96rem] font-semibold text-slate-900 dark:text-slate-100 leading-[1.55] line-clamp-2
          tracking-[-0.015em] group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors duration-200">
          {ann.headline}
        </h3>
        <span className="inline-flex items-center gap-1 mt-1 text-[0.7rem] text-slate-500 dark:text-slate-600
          group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          View on ASX
          <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
            <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </a>

      {/* AI Summary */}
      {ann.summary && ann.summary.length > 0 && (
        <div className="flex flex-col gap-2 bg-slate-50 dark:bg-white/[0.025] rounded-xl p-3.5 border border-slate-100 dark:border-white/[0.04] transition-colors">
          <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-600 mb-0.5">
            AI Summary
          </div>
          <ul className="flex flex-col gap-2">
            {ann.summary.slice(0, 3).map((point, i) => (
              <li key={i} className="relative pl-4 text-[0.82rem] text-slate-600 dark:text-slate-300/90 leading-[1.6] line-clamp-2">
                <span className="absolute left-0 top-[9px] w-1.5 h-1.5 rounded-full bg-indigo-500/40 dark:bg-indigo-500/60 flex-shrink-0" />
                {point.replace(/^[\s\-\*\•\d\.]+\s*/, '')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer: tags */}
      {ann.tags && ann.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 mt-auto border-t border-slate-100 dark:border-white/[0.04] transition-colors">
          {ann.tags.map(tag => {
            const cls = tagClass(tag);
            return (
              <span key={tag} className={`font-mono text-[0.6rem] font-bold uppercase tracking-[0.08em]
                px-2 py-0.5 rounded-full border ${TAG_BG[cls] ?? TAG_BG['']}`}>
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
