'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#060912] text-slate-100">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p className="text-sm text-slate-400 max-w-md text-center">
        The application encountered an unexpected state. This is often caused by a temporary date hydration mismatch.
      </p>
      <button
        onClick={() => {
          localStorage.removeItem('vitti-view'); // clear potentially corrupted state
          reset();
        }}
        className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
      >
        Recover Session
      </button>
    </div>
  );
}
