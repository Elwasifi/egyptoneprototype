'use client';
import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

const BENEFITS = [
  'Live status for every booking',
  'Egypt One Pass points and partner benefits',
  '24/7 emergency assistance during your trip',
  'Rate past journeys and unlock member pricing',
];

export function AuthForm({ locale }: { locale: Locale }) {
  const [mode, setMode] = React.useState<'signup' | 'signin'>('signup');
  const [notice, setNotice] = React.useState(false);

  const comingSoon = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    setNotice(true);
  };

  return (
    <div className="grid min-h-[70vh] gap-8 lg:grid-cols-[1.05fr_1fr]">
      <section className="surface-gold relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between">
        <Link href={L(locale, '/')} className="flex items-center gap-3">
          <Logo variant="compact" size={32} />
        </Link>
        <div className="max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-500/80">One account, all of Egypt</p>
          <h1 className="mt-4 text-[32px] font-semibold leading-tight text-ink-hi">
            Your trips, rewards and live support in one place
          </h1>
          <ul className="mt-8 grid gap-3 text-[13.5px] text-ink-low">
            {BENEFITS.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-gold-400">◆</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[12px] text-ink-faint">Preview — account system not yet connected.</p>
      </section>

      <section className="flex items-center justify-center px-1 py-6">
        <div className="w-full max-w-md">
          <div className="mb-7 grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/4 p-1">
            {(['signup', 'signin'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  mode === m
                    ? 'rounded-full bg-gold-500 px-4 py-2 text-[13px] font-medium text-[#0a1017]'
                    : 'rounded-full px-4 py-2 text-[13px] font-medium text-ink-faint hover:text-ink-hi'
                }
              >
                {m === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          <h2 className="text-[22px] font-semibold text-ink-hi">
            {mode === 'signup' ? 'Create your Egypt One account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-[13px] text-ink-low">Continue with a social account or use your email and WhatsApp number.</p>

          <div className="mt-6 grid gap-2.5">
            <button type="button" onClick={comingSoon} className="flex h-12 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/4 text-[13.5px] font-medium text-ink-hi hover:border-gold-600/35">
              Continue with Google
            </button>
            <button type="button" onClick={comingSoon} className="flex h-12 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/4 text-[13.5px] font-medium text-ink-hi hover:border-gold-600/35">
              Continue with Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={comingSoon} className="grid gap-3">
            {mode === 'signup' && (
              <input required placeholder="Full name" className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-[13.5px] text-ink-hi placeholder:text-ink-faint focus:border-gold-600/35" />
            )}
            <input required type="email" placeholder="Email address" className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-[13.5px] text-ink-hi placeholder:text-ink-faint focus:border-gold-600/35" />
            {mode === 'signup' && (
              <input required type="tel" dir="ltr" placeholder="+20 1x xxx xxxx" className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-[13.5px] text-ink-hi placeholder:text-ink-faint focus:border-gold-600/35" />
            )}
            <input required type="password" minLength={6} placeholder="Password" className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-[13.5px] text-ink-hi placeholder:text-ink-faint focus:border-gold-600/35" />

            <button type="submit" className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 text-[13.5px] font-semibold text-[#0a1017] hover:from-gold-300 hover:to-gold-500">
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          {notice && (
            <p className="mt-4 rounded-xl border border-gold-600/35 bg-gold-600/10 px-4 py-3 text-[12px] text-gold-200" role="status">
              Account sign-in isn't live yet — this is a preview of the form only.
            </p>
          )}

          <p className="mt-5 text-center text-[11.5px] leading-relaxed text-ink-faint">
            By continuing you agree to the Egypt One{' '}
            <Link href={L(locale, '/legal/terms')} className="text-gold-300 hover:underline">terms</Link> and{' '}
            <Link href={L(locale, '/legal/privacy')} className="text-gold-300 hover:underline">privacy policy</Link>.
          </p>
          <p className="mt-4 text-center text-[13px]">
            <Link href={L(locale, '/')} className="text-gold-300 hover:underline">
              Back to the national gateway
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
