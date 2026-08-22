import * as React from 'react';
import clsx from 'clsx';
import { SOURCE_STATUS_LABEL, type SourceStatus, type DataClass, HERITAGE_ACCESS_LABEL, type HeritageAccess } from '@egypt-one/types';

/* -------------------------------------------------------------- provenance */
const TONE: Record<SourceStatus, string> = {
  LIVE: 'bg-ok/12 text-ok border-ok/35',
  VERIFIED_DATA: 'bg-turquoise/12 text-turquoise border-turquoise/35',
  PARTNER_DATA: 'bg-nile/15 text-info border-nile/40',
  DEMO: 'bg-gold-600/12 text-gold-300 border-gold-600/32',
  SIMULATED: 'bg-royal/18 text-[#b6a8e0] border-royal/40',
  PLANNED_INTEGRATION: 'bg-white/6 text-ink-low border-white/12',
};

/**
 * Provenance badge. Rendered on every content, supply and analytics record so a
 * reader can always tell an official answer from a demonstration one.
 */
export function SourceBadge({ status, owner, size = 'md', className }: { status: SourceStatus; owner?: string; size?: 'sm' | 'md'; className?: string }) {
  const label = SOURCE_STATUS_LABEL[status] ?? status;
  return (
    <span
      title={owner ? `${label} — source: ${owner}` : label}
      className={clsx('inline-flex items-center gap-1.5 rounded-full border font-medium leading-none',
        size === 'sm' ? 'px-2 py-[3px] text-[10px]' : 'px-2.5 py-1 text-[11px]', TONE[status], className)}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

export function DataClassBadge({ dataClass }: { dataClass: DataClass }) {
  const tone: Record<DataClass, string> = {
    PUBLIC: 'bg-white/6 text-ink-low border-white/12',
    PARTNER: 'bg-nile/12 text-info border-nile/32',
    PERSONAL: 'bg-warn/10 text-warn border-warn/30',
    SENSITIVE: 'bg-danger/12 text-danger border-danger/35',
    RESTRICTED_GOVERNMENT: 'bg-royal/18 text-[#b6a8e0] border-royal/45',
  };
  return (
    <span className={clsx('inline-flex rounded border px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wider', tone[dataClass])}>
      {dataClass.replace(/_/g, ' ')}
    </span>
  );
}

export function AccessBadge({ access }: { access: HeritageAccess }) {
  const tone: Record<HeritageAccess, string> = {
    OPEN: 'bg-ok/12 text-ok border-ok/35',
    LIMITED_ACCESS: 'bg-warn/12 text-warn border-warn/32',
    PERMIT_REQUIRED: 'bg-royal/16 text-[#b6a8e0] border-royal/40',
    CLOSED: 'bg-danger/12 text-danger border-danger/35',
    UNDER_RESTORATION: 'bg-nile/14 text-info border-nile/35',
    PROPOSED_FOR_RESTORATION: 'bg-gold-600/12 text-gold-300 border-gold-600/32',
    DEMO_UNVERIFIED: 'bg-white/6 text-ink-low border-white/12',
  };
  return (
    <span className={clsx('inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium', tone[access])}>
      {HERITAGE_ACCESS_LABEL[access]}
    </span>
  );
}

/* ------------------------------------------------------------- page states */
function StateShell({ icon, title, body, action, tone = 'neutral' }: { icon: string; title: string; body: string; action?: React.ReactNode; tone?: 'neutral' | 'warn' | 'danger' | 'info' }) {
  const ring = { neutral: 'border-white/10', warn: 'border-warn/35', danger: 'border-danger/35', info: 'border-nile/35' }[tone];
  return (
    <div className={clsx('surface flex flex-col items-center justify-center gap-3 border-dashed px-6 py-14 text-center', ring)} role="status">
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <h3 className="text-base font-semibold text-ink-hi">{title}</h3>
      <p className="max-w-md text-sm text-ink-low">{body}</p>
      {action}
    </div>
  );
}

export const EmptyState = (p: { title?: string; body?: string; action?: React.ReactNode }) => (
  <StateShell icon="◇" title={p.title ?? 'Nothing here yet'} body={p.body ?? 'This module has no records for the current filters.'} action={p.action} />
);

export const ErrorState = (p: { title?: string; body?: string; action?: React.ReactNode }) => (
  <StateShell tone="danger" icon="⚠" title={p.title ?? 'Something went wrong'} body={p.body ?? 'We could not load this section. Please try again.'} action={p.action} />
);

export const OfflineState = () => (
  <StateShell tone="warn" icon="⇄" title="Connection unavailable" body="You appear to be offline. Cached content is shown where available." />
);

export const PermissionDenied = ({ dataClass, role }: { dataClass?: DataClass; role?: string }) => (
  <StateShell
    tone="danger" icon="⛔" title="Permission required"
    body={`Your role${role ? ` (${role})` : ''} does not grant access to this${dataClass ? ` ${dataClass.replace(/_/g, ' ').toLowerCase()}` : ''} data. The attempt has been recorded in the audit log.`}
  />
);

export const IntegrationUnavailable = ({ name, state = 'PLANNED' }: { name: string; state?: string }) => (
  <StateShell
    tone="info" icon="⧗" title="Integration not available"
    body={`${name} is a ${state.toLowerCase()} integration. No live data is being shown, and nothing here should be treated as an official answer.`}
  />
);

export const LoadingState = ({ rows = 3 }: { rows?: number }) => (
  <div className="grid gap-3" aria-busy="true" aria-live="polite">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="surface h-24 animate-pulse" />
    ))}
  </div>
);

/* ------------------------------------------------------------------ charts */
/** Horizontal bar strip. Deliberately dependency-free and theme-consistent. */
export function BarStrip({ rows, unit = '', max }: { rows: { label: string; value: number; href?: string }[]; unit?: string; max?: number }) {
  const top = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="grid gap-2.5">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(90px,150px)_1fr_auto] items-center gap-3 text-[12.5px]">
          <span className="truncate text-ink-mid">{r.label}</span>
          <span className="h-2 overflow-hidden rounded-full bg-white/7">
            <span className="block h-full rounded-full bg-gradient-to-r from-gold-700 to-gold-300" style={{ width: `${(r.value / top) * 100}%` }} />
          </span>
          <span className="tabular-nums text-ink-low">{r.value.toLocaleString()}{unit}</span>
        </li>
      ))}
    </ul>
  );
}

/** Donut built from a single conic gradient — no chart library, no runtime cost. */
export function Donut({ slices, size = 132 }: { slices: { label: string; value: number; colour: string }[]; size?: number }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  const stops = slices.map((s) => {
    const from = (acc / total) * 360;
    acc += s.value;
    const to = (acc / total) * 360;
    return `${s.colour} ${from}deg ${to}deg`;
  }).join(', ');
  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0 rounded-full" style={{ width: size, height: size, background: `conic-gradient(${stops})` }} role="img" aria-label={slices.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(', ')}>
        <div className="absolute inset-[22%] rounded-full bg-base" />
      </div>
      <ul className="grid gap-1.5 text-[12px]">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.colour }} aria-hidden="true" />
            <span className="text-ink-mid">{s.label}</span>
            <span className="tabular-nums text-ink-faint">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Sparkline / area trend, SVG only. */
export function Trend({ points, height = 56, colour = '#D8A84E' }: { points: number[]; height?: number; colour?: string }) {
  if (!points.length) return null;
  const w = 240, max = Math.max(...points), min = Math.min(...points), span = max - min || 1;
  const d = points.map((p, i) => `${(i / (points.length - 1)) * w},${height - ((p - min) / span) * (height - 8) - 4}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none" role="img" aria-label="Trend">
      <polyline points={`0,${height} ${d} ${w},${height}`} fill={colour} opacity="0.10" />
      <polyline points={d} fill="none" stroke={colour} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function DataTable({ columns, rows, caption }: { columns: string[]; rows: (React.ReactNode)[][]; caption?: string }) {
  return (
    <div className="surface overflow-x-auto p-0">
      <table className="w-full min-w-[600px] text-left text-[13px]">
        {caption && <caption className="px-4 pt-4 text-left text-[12px] text-ink-faint">{caption}</caption>}
        <thead>
          <tr className="border-b border-white/8">
            {columns.map((c) => <th key={c} scope="col" className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3">
              {r.map((cell, j) => <td key={j} className="px-4 py-3 align-middle text-ink-mid">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
