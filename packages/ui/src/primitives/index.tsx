'use client';
import * as React from 'react';
import clsx from 'clsx';

/* ------------------------------------------------------------------ Button */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'gold' | 'outline' | 'ghost' | 'quiet' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button';
};
const BTN_BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors ' +
  'disabled:opacity-45 disabled:pointer-events-none select-none';
const BTN_VARIANT: Record<string, string> = {
  gold: 'bg-gradient-to-b from-gold-400 to-gold-600 text-[#0a1017] hover:from-gold-300 hover:to-gold-500',
  outline: 'border border-gold-600/45 text-gold-300 hover:bg-gold-600/12 hover:border-gold-500',
  ghost: 'text-ink-mid hover:text-ink-hi hover:bg-white/6',
  quiet: 'bg-white/6 text-ink-hi hover:bg-white/10 border border-white/8',
  danger: 'bg-danger/15 text-danger border border-danger/40 hover:bg-danger/22',
};
const BTN_SIZE: Record<string, string> = {
  sm: 'h-8 px-3 text-[12.5px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};
export function Button({ variant = 'gold', size = 'md', className, ...rest }: ButtonProps) {
  return <button className={clsx(BTN_BASE, BTN_VARIANT[variant], BTN_SIZE[size], className)} {...rest} />;
}

/* --------------------------------------------------------------- Card etc. */
export function Card({ className, children, gold = false, ...rest }: React.HTMLAttributes<HTMLDivElement> & { gold?: boolean }) {
  return (
    <div className={clsx(gold ? 'surface-gold' : 'surface', 'p-5', className)} {...rest}>
      {children}
    </div>
  );
}

export function Badge({
  tone = 'neutral', children, className,
}: { tone?: 'neutral' | 'gold' | 'ok' | 'warn' | 'danger' | 'info' | 'nile'; children: React.ReactNode; className?: string }) {
  const tones: Record<string, string> = {
    neutral: 'bg-white/7 text-ink-low border-white/10',
    gold: 'bg-gold-600/14 text-gold-300 border-gold-600/35',
    ok: 'bg-ok/12 text-ok border-ok/35',
    warn: 'bg-warn/12 text-warn border-warn/35',
    danger: 'bg-danger/12 text-danger border-danger/35',
    info: 'bg-info/12 text-info border-info/35',
    nile: 'bg-nile/15 text-turquoise border-nile/35',
  };
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-medium leading-none', tones[tone], className)}>
      {children}
    </span>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={clsx(
        'h-11 w-full rounded-lg border border-white/10 bg-white/4 px-3.5 text-sm text-ink-hi',
        'placeholder:text-ink-faint focus:border-gold-600/55 focus:bg-white/6 outline-none transition-colors',
        className,
      )}
      {...rest}
    />
  );
}

export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        'h-11 w-full rounded-lg border border-white/10 bg-panel px-3 text-sm text-ink-hi',
        'focus:border-gold-600/55 outline-none transition-colors',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx('w-full rounded-lg border border-white/10 bg-white/4 p-3 text-sm text-ink-hi placeholder:text-ink-faint focus:border-gold-600/55 outline-none', className)}
      {...rest}
    />
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx('relative h-6 w-11 rounded-full border transition-colors', checked ? 'bg-gold-600/70 border-gold-500' : 'bg-white/8 border-white/12')}
    >
      <span className={clsx('absolute top-[3px] h-4 w-4 rounded-full bg-ink-hi transition-all', checked ? 'left-[25px]' : 'left-[3px]')} />
    </button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-lg bg-white/6', className)} aria-hidden="true" />;
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300 transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string }[]; active: string; onChange: (k: string) => void }) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto no-scrollbar rounded-lg border border-white/8 bg-white/3 p-1">
      {tabs.map((t) => (
        <button
          key={t.key} role="tab" aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={clsx('whitespace-nowrap rounded-md px-3.5 py-2 text-[13px] font-medium transition-colors',
            active === t.key ? 'bg-gold-600/18 text-gold-200' : 'text-ink-low hover:text-ink-hi')}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Stat({ label, value, sub, tone = 'gold' }: { label: string; value: React.ReactNode; sub?: string; tone?: 'gold' | 'nile' | 'ok' | 'neutral' }) {
  const colour = { gold: 'text-gold-300', nile: 'text-turquoise', ok: 'text-ok', neutral: 'text-ink-hi' }[tone];
  return (
    <div className="surface p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">{label}</div>
      <div className={clsx('mt-1.5 text-2xl font-semibold tabular-nums', colour)}>{value}</div>
      {sub && <div className="mt-1 text-[11.5px] text-ink-low">{sub}</div>}
    </div>
  );
}
