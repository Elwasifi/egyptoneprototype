'use client';
import * as React from 'react';
import Link from 'next/link';
import { SourceBadge, LoadingState, ErrorState } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

type Citation = { label: string; sourceStatus: string; owner?: string };
type Turn = { role: 'user' | 'assistant'; content: string; agentLabel?: string; citations?: Citation[]; denied?: boolean };

const PROMPTS = [
  'Five days in Egypt with history and the Red Sea',
  'Tell me about Abu Simbel',
  'Find a French-speaking guide in Luxor',
];

/**
 * Homepage concierge preview, wired to the real `POST /api/ai/concierge`
 * route. The answer, the routed agent label and its citations all come from
 * the platform — nothing on this strip is scripted copy.
 */
export function HomeConciergeStrip({ locale }: { locale: Locale }) {
  const [asked, setAsked] = React.useState<string | null>(null);
  const [turn, setTurn] = React.useState<Turn | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(false);

  async function ask(q: string) {
    setAsked(q); setBusy(true); setError(false); setTurn(null);
    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: q, locale }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTurn(data.turn as Turn);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="surface-gold p-5">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-700 text-[13px] text-[#0a1017]">✦</span>
        <div>
          <h3 className="text-[16px] font-semibold text-ink-hi">Ask the Egypt One concierge</h3>
          <p className="text-[12px] text-ink-low">One assistant, routed to the right specialist.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p} onClick={() => ask(p)} disabled={busy}
            className={`rounded-lg border px-3.5 py-2.5 text-start text-[12.5px] transition-colors disabled:opacity-60 ${asked === p ? 'border-gold-600/45 bg-gold-600/12 text-gold-200' : 'border-white/10 text-ink-mid hover:bg-white/6 hover:text-ink-hi'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-4" aria-live="polite">
        {busy && <LoadingState rows={2} />}
        {error && !busy && <ErrorState title="The concierge is unavailable" body="Please try again in a moment." />}
        {turn && !busy && (
          <div className="rounded-[14px] border border-white/8 bg-base/40 p-4">
            {turn.agentLabel && <div className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-gold-600">{turn.agentLabel}</div>}
            <p className="whitespace-pre-line text-[12.5px] leading-relaxed text-ink-mid">{turn.content}</p>
            {!!turn.citations?.length && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {turn.citations.slice(0, 4).map((c, i) => (
                  <SourceBadge key={i} status={c.sourceStatus as never} owner={c.owner} size="sm" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Link href={L(locale, '/ai')} className="mt-4 inline-flex rounded-lg bg-gold-500/90 px-4 py-2 text-[12.5px] font-semibold text-[#0a1017] hover:bg-gold-400">
        Open the full concierge →
      </Link>
    </div>
  );
}
