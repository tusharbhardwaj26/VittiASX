'use client';

import { Announcement } from '@/types';
import { formatTime, isBullish, tagClass, TAG_BG } from '@/lib/utils';

interface Props {
  ann: Announcement;
}

export default function AnnouncementRow({ ann }: Props) {
  const bullish = isBullish(ann);

  return (
    <div className={[
      'group flex items-center gap-5 px-6 py-3.5 rounded-xl',
      'bg-white dark:bg-[#0d1022] border border-slate-200 dark:border-transparent',
      'cursor-default select-none transition-colors duration-300',
      'dark:[background-image:linear-gradient(#0d1022,#0d1022)_padding-box,linear-gradient(160deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)_border-box]',
      'dark:hover:[background-image:linear-gradient(#111527,#111527)_padding-box,linear-gradient(160deg,rgba(99,102,241,0.5)_0%,rgba(167,139,250,0.4)_45%,rgba(6,182,212,0.25)_100%)_border-box]',
      'shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]',
      'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.5),auto_24px_auto_rgba(0,0,0,0.4)]',
      'hover:border-indigo-300 dark:hover:border-transparent',
      // Market sensitive left border
      ann.market_sensitive ? 'border-l-[4px] !border-l-rose-500 pl-[20px]' : ''
    ].filter(Boolean).join(' ')}>

      {/* Ticker & Sensitivity Combo */}
      <div className="flex flex-col items-center gap-1.5 w-[80px] flex-shrink-0">
        <span className="font-mono text-[0.74rem] font-bold tracking-[0.08em] px-2.5 py-1 rounded-lg
          bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 whitespace-nowrap text-center w-full">
          {ann.ticker}
        </span>
        {ann.market_sensitive && !bullish && (
          <span className="flex items-center gap-1 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-rose-600 dark:text-rose-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-500 animate-pulse-dot" />
            Sensitive
          </span>
        )}
        {bullish && (
          <span className="font-mono text-[0.55rem] font-black uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400">
            ▲ Bullish
          </span>
        )}
      </div>

      {/* Company & Time */}
      <div className="w-[160px] flex-shrink-0 flex flex-col justify-center border-r border-slate-200 dark:border-white/5 pr-4 h-full">
        <div className="text-[0.84rem] font-semibold text-slate-800 dark:text-slate-200 truncate" title={ann.company}>
          {ann.company}
        </div>
        <div className="font-mono text-[0.68rem] text-slate-500 mt-1 flex items-center gap-1.5">
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {formatTime(ann.time)}
        </div>
      </div>

      {/* Headline & Badges */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
        <a
          href={ann.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 block py-1"
        >
          <span className="text-[0.94rem] font-medium text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug
            group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors tracking-[-0.01em]">
            {ann.headline}
          </span>
        </a>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {ann.tags.slice(0, 3).map(tag => {
            const cls = tagClass(tag);
            return (
              <span key={tag} className={`hidden md:inline font-mono text-[0.6rem] font-bold uppercase tracking-[0.08em]
                px-2 py-0.5 rounded-full border ${TAG_BG[cls] ?? TAG_BG['']}`}>
                {tag}
              </span>
            );
          })}
        </div>
        
        {/* Link Icon */}
        <a 
          href={ann.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-white/[0.03] text-slate-400 dark:text-slate-500
            hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300 transition-colors flex-shrink-0 border border-slate-200 dark:border-transparent"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
             <path d="M4.5 11.5L11.5 4.5M11.5 4.5H6.5M11.5 4.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
