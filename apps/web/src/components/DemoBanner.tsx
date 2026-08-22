'use client';
import * as React from 'react';

/**
 * Standing notice that this is a demonstration build. Dismissible per session
 * so it never blocks the experience, but never suppressed permanently.
 */
export function DemoBanner({ message }: { message: string }) {
  const [hidden, setHidden] = React.useState(false);
  if (hidden) return null;
  return (
    <div className="border-b border-gold-600/25 bg-gold-600/10 px-4 py-2 text-center text-[11.5px] text-gold-200">
      <span className="me-2 font-semibold uppercase tracking-wider">Demonstration</span>
      {message}
      <button onClick={() => setHidden(true)} aria-label="Dismiss notice" className="ms-3 rounded px-1.5 text-gold-400 hover:text-gold-200">✕</button>
    </div>
  );
}
