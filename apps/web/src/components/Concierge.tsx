'use client';
import * as React from 'react';
import Link from 'next/link';
import { SourceBadge } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

export type ActionCard = { kind: string; title: string; body?: string; href?: string; cta?: string; rows?: { label: string; value: string }[] };
export type Citation = { label: string; sourceStatus: string; owner?: string };
export type Turn = { role: 'user' | 'assistant'; content: string; agent?: string; agentLabel?: string; cards?: ActionCard[]; citations?: Citation[]; denied?: boolean };

const SUGGESTIONS = [
  'Plan 10 days in Egypt for a family with two children',
  'Which governorates suit a boutique hotel investment?',
  'Tell me about the Temple of Hathor at Dendera',
  'Find a French-speaking guide in Luxor',
  'What do I need to know about entry requirements?',
  'Show me hidden heritage sites near Sohag',
];

/**
 * The single conversational surface the user sees. It never exposes which
 * specialised agent handled a request — the orchestrator's routing is shown
 * only as a small trace line, and every answer carries source labels.
 */
export function ConciergePanel({
  locale, messages, variant = 'panel', onClose,
}: { locale: Locale; messages: Record<string, string>; variant?: 'panel' | 'page'; onClose?: () => void }) {
  const t = (k: string) => messages[k] ?? k;
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [turns, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput('');
    setError(null);
    setTurns((prev) => [...prev, { role: 'user', content: q }]);
    setBusy(true);
    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: q, locale, history: turns.slice(-6) }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      setTurns((prev) => [...prev, data.turn as Turn]);
    } catch {
      setError(t('state.error.body'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={variant === 'page' ? 'surface flex h-[72vh] flex-col p-0' : 'flex h-full flex-col'}>
      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-700 text-[13px] text-[#0a1017]">✦</span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-ink-hi">{t('concierge.title')}</div>
          <div className="truncate text-[11px] text-ink-faint">{t('concierge.subtitle')}</div>
        </div>
        {onClose && <button onClick={onClose} aria-label={t('nav.close')} className="rounded px-2 py-1 text-ink-faint hover:text-ink-hi">✕</button>}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {turns.length === 0 && (
          <div>
            <p className="mb-4 text-[13px] leading-relaxed text-ink-low">
              Ask about anything in Egypt — trips, heritage, guides, transport, health, research or investment. One assistant
              coordinates the specialists behind the scenes.
            </p>
            <div className="grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-lg border border-white/9 bg-white/3 px-3 py-2.5 text-start text-[12.5px] text-ink-mid transition-colors hover:border-gold-600/35 hover:text-ink-hi">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {turns.map((turn, i) => (
            <div key={i} className={turn.role === 'user' ? 'flex justify-end' : ''}>
              {turn.role === 'user' ? (
                <div className="max-w-[85%] rounded-2xl rounded-ee-sm bg-gold-600/16 px-3.5 py-2.5 text-[13px] text-ink-hi">{turn.content}</div>
              ) : (
                <div className="max-w-full">
                  {turn.agentLabel && (
                    <div className="mb-1.5 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
                      Routed to {turn.agentLabel}
                    </div>
                  )}
                  <div className={`rounded-2xl rounded-es-sm border px-3.5 py-3 text-[13px] leading-relaxed ${turn.denied ? 'border-danger/35 bg-danger/8 text-ink-mid' : 'border-white/9 bg-white/4 text-ink-mid'}`}>
                    {turn.content.split('\n').map((line, j) => <p key={j} className={j ? 'mt-2' : ''}>{line}</p>)}
                  </div>

                  {turn.cards && turn.cards.length > 0 && (
                    <div className="mt-2.5 grid gap-2">
                      {turn.cards.map((c, j) => (
                        <div key={j} className="surface p-3.5">
                          <div className="text-[12.5px] font-semibold text-ink-hi">{c.title}</div>
                          {c.body && <p className="mt-1 text-[12px] text-ink-low">{c.body}</p>}
                          {c.rows && (
                            <ul className="mt-2 grid gap-1">
                              {c.rows.map((r, k) => (
                                <li key={k} className="flex justify-between gap-3 text-[11.5px]">
                                  <span className="text-ink-faint">{r.label}</span>
                                  <span className="text-end text-ink-mid">{r.value}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {c.href && (
                            <Link href={L(locale, c.href)} className="mt-2.5 inline-flex rounded-lg border border-gold-600/40 px-2.5 py-1.5 text-[11.5px] font-medium text-gold-300 hover:bg-gold-600/12">
                              {c.cta ?? 'Open'} →
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {turn.citations && turn.citations.length > 0 && (
                    <div className="mt-2.5">
                      <div className="mb-1.5 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">{t('concierge.sources')}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {turn.citations.map((c, j) => (
                          <span key={j} className="inline-flex items-center gap-1.5 rounded-full border border-white/9 bg-white/3 px-2 py-1 text-[10.5px] text-ink-low">
                            {c.label}
                            <SourceBadge status={c.sourceStatus as any} size="sm" owner={c.owner} />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {busy && (
            <div className="flex items-center gap-2 text-[12px] text-ink-faint" aria-live="polite">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
              {t('concierge.thinking')}…
            </div>
          )}
          {error && <div className="rounded-lg border border-danger/35 bg-danger/8 px-3 py-2 text-[12px] text-danger">{error}</div>}
          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="border-t border-white/8 p-3"
      >
        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="concierge-input">{t('concierge.placeholder')}</label>
          <textarea
            id="concierge-input" rows={1} value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={t('concierge.placeholder')}
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-lg border border-white/10 bg-white/4 px-3 py-2.5 text-[13px] text-ink-hi outline-none placeholder:text-ink-faint focus:border-gold-600/50"
          />
          <button type="submit" disabled={busy || !input.trim()} className="h-[42px] shrink-0 rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-4 text-[13px] font-semibold text-[#0a1017] disabled:opacity-40">
            {t('concierge.send')}
          </button>
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-ink-faint">{t('concierge.disclaimer')}</p>
      </form>
    </div>
  );
}

/** Floating launcher: right-side panel on desktop, full screen on mobile. */
export function ConciergeLauncher({ locale, messages }: { locale: Locale; messages: Record<string, string> }) {
  const [open, setOpen] = React.useState(false);
  const t = (k: string) => messages[k] ?? k;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t('concierge.open')}
        className="fixed bottom-20 end-4 z-40 flex h-12 items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-700 px-4 text-[13px] font-semibold text-[#0a1017] shadow-lg transition-transform hover:scale-[1.03] md:bottom-6"
      >
        ✦ <span className="hidden sm:inline">{t('nav.concierge')}</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={t('concierge.title')}>
          <div className="absolute inset-0 bg-void/70" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 border-s border-white/10 bg-panel sm:inset-y-0 sm:end-0 sm:start-auto sm:w-[440px]">
            <ConciergePanel locale={locale} messages={messages} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
