'use client';
import * as React from 'react';
import Link from 'next/link';
import { Badge, SourceBadge, Input, Select, Progress } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

const INTERESTS = [
  'History', 'Ancient Egypt', 'Religious Heritage', 'Beach', 'Nile', 'Food', 'Luxury',
  'Adventure', 'Shopping', 'Medical', 'Wellness', 'Business', 'MICE', 'Research',
  'Rural Egypt', 'Family', 'Photography', 'Diving', 'Yachts',
];
const STYLES = ['Budget', 'Comfort', 'Premium', 'Luxury'];
const PARTIES = ['Solo', 'Couple', 'Family', 'Group', 'Business'];
const LANGS = ['English', 'Arabic', 'French', 'German', 'Russian', 'Chinese', 'Japanese', 'Spanish', 'Italian', 'Greek', 'Hindi'];
const ACCESS = ['Step-free access', 'Wheelchair user', 'Limited walking', 'Visual impairment', 'Hearing impairment', 'Assistance animal'];

type Day = { day: number; governorate: string; title: string; items: { kind: string; title: string; time?: string; note?: string; sourceStatus: string }[] };

const STEPS = ['Who is travelling', 'When and how long', 'Budget and style', 'Interests', 'Access and languages'];

/**
 * The multi-step trip brief. Everything collected here is personal data and is
 * sent to the platform's own planner — never to a third party, and never used
 * for marketing without a separate consent.
 */
export function TripBuilder({ locale }: { locale: Locale }) {
  const [step, setStep] = React.useState(0);
  const [nationality, setNationality] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [party, setParty] = React.useState('Couple');
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [startDate, setStartDate] = React.useState('');
  const [days, setDays] = React.useState(8);
  const [budget, setBudget] = React.useState(2500);
  const [style, setStyle] = React.useState('Comfort');
  const [interests, setInterests] = React.useState<string[]>(['Ancient Egypt', 'Nile']);
  const [languages, setLanguages] = React.useState<string[]>(['English']);
  const [access, setAccess] = React.useState<string[]>([]);
  const [plan, setPlan] = React.useState<Day[] | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  async function build() {
    setBusy(true); setError(null);
    try {
      const res = await fetch('/api/trip/build', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ days, interests, budgetUsd: budget, partyType: party, adults, children, accessibility: access, languages, nationality, origin, startDate }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPlan(data.plan);
      setStep(STEPS.length);
    } catch {
      setError('The planner could not be reached. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (plan) {
    return (
      <div className="grid gap-5">
        <div className="surface flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h2 className="text-[17px] font-semibold text-ink-hi">Your {plan.length}-day draft itinerary</h2>
            <p className="mt-1 text-[12.5px] text-ink-low">
              {[...new Set(plan.map((d) => d.governorate))].join(' → ')} · {party.toLowerCase()} · {style.toLowerCase()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setPlan(null); setStep(0); }} className="rounded-lg border border-white/12 px-4 py-2 text-[12.5px] text-ink-hi hover:bg-white/6">
              Start over
            </button>
            <Link href={L(locale, '/my-itinerary')} className="rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-2 text-[12.5px] font-semibold text-[#0a1017]">
              Save to my itinerary
            </Link>
          </div>
        </div>

        <div className="rounded-[16px] border border-warn/30 bg-warn/6 px-4 py-3 text-[12.5px] text-ink-mid">
          Nothing here is booked, held or priced. Availability and confirmation require a connected provider adapter, and none is live in this prototype.
        </div>

        <div className="grid gap-3">
          {plan.map((d) => (
            <div key={d.day} className="surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-gold-200">Day {d.day} · {d.title}</h3>
                <Badge tone="neutral">{d.governorate}</Badge>
              </div>
              <ul className="mt-3 grid gap-2">
                {d.items.map((i, k) => (
                  <li key={k} className="grid grid-cols-[70px_90px_1fr_auto] items-center gap-3 border-b border-white/6 pb-2 text-[12.5px] last:border-0 last:pb-0">
                    <span className="tabular-nums text-ink-faint">{i.time ?? '—'}</span>
                    <span className="text-[11px] uppercase tracking-wider text-gold-600">{i.kind}</span>
                    <span className="min-w-0 truncate text-ink-mid">{i.title}{i.note ? <span className="text-ink-faint"> · {i.note}</span> : null}</span>
                    <span className="flex items-center gap-2">
                      <Badge tone="neutral">Draft</Badge>
                      <SourceBadge status={i.sourceStatus as never} size="sm" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="surface p-5 sm:p-6">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-[12px]">
          <span className="text-gold-300">Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
          <span className="text-ink-faint">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} label="Trip builder progress" />
      </div>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tb-nat" className="mb-1.5 block text-[12.5px] text-ink-low">Nationality</label>
            <Input id="tb-nat" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Used only for entry-requirement guidance" />
          </div>
          <div>
            <label htmlFor="tb-origin" className="mb-1.5 block text-[12.5px] text-ink-low">Travelling from</label>
            <Input id="tb-origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Country or city" />
          </div>
          <div>
            <label htmlFor="tb-party" className="mb-1.5 block text-[12.5px] text-ink-low">Who is travelling</label>
            <Select id="tb-party" value={party} onChange={(e) => setParty(e.target.value)}>
              {PARTIES.map((p) => <option key={p}>{p}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tb-adults" className="mb-1.5 block text-[12.5px] text-ink-low">Adults</label>
              <Input id="tb-adults" type="number" min={1} max={30} value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="tb-children" className="mb-1.5 block text-[12.5px] text-ink-low">Children</label>
              <Input id="tb-children" type="number" min={0} max={20} value={children} onChange={(e) => setChildren(Number(e.target.value))} />
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tb-start" className="mb-1.5 block text-[12.5px] text-ink-low">Start date</label>
            <Input id="tb-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="tb-days" className="mb-1.5 block text-[12.5px] text-ink-low">Length of stay: {days} days</label>
            <input
              id="tb-days" type="range" min={2} max={21} value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-3 w-full accent-[#D8A84E]"
            />
            <p className="mt-1.5 text-[11.5px] text-ink-faint">Most first visits that include both Cairo and Upper Egypt need at least seven days.</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tb-budget" className="mb-1.5 block text-[12.5px] text-ink-low">Budget per person: USD {budget.toLocaleString()}</label>
            <input
              id="tb-budget" type="range" min={400} max={20000} step={100} value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-3 w-full accent-[#D8A84E]"
            />
            <p className="mt-1.5 text-[11.5px] text-ink-faint">Used to weight the plan. No price on this platform is a live rate.</p>
          </div>
          <div>
            <label htmlFor="tb-style" className="mb-1.5 block text-[12.5px] text-ink-low">Travel style</label>
            <Select id="tb-style" value={style} onChange={(e) => setStyle(e.target.value)}>
              {STYLES.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
        </div>
      )}

      {step === 3 && (
        <fieldset>
          <legend className="mb-3 text-[12.5px] text-ink-low">What are you here for? Pick as many as apply.</legend>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i} type="button" onClick={() => toggle(interests, setInterests, i)}
                aria-pressed={interests.includes(i)}
                className={`rounded-full border px-3.5 py-2 text-[12.5px] transition-colors ${
                  interests.includes(i) ? 'border-gold-500 bg-gold-600/18 text-gold-200' : 'border-white/10 text-ink-mid hover:border-gold-600/40'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <div className="grid gap-5">
          <fieldset>
            <legend className="mb-3 text-[12.5px] text-ink-low">Languages you would like your guide to speak</legend>
            <div className="flex flex-wrap gap-2">
              {LANGS.map((i) => (
                <button
                  key={i} type="button" onClick={() => toggle(languages, setLanguages, i)}
                  aria-pressed={languages.includes(i)}
                  className={`rounded-full border px-3.5 py-2 text-[12.5px] transition-colors ${
                    languages.includes(i) ? 'border-gold-500 bg-gold-600/18 text-gold-200' : 'border-white/10 text-ink-mid hover:border-gold-600/40'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-3 text-[12.5px] text-ink-low">Accessibility needs</legend>
            <div className="flex flex-wrap gap-2">
              {ACCESS.map((i) => (
                <button
                  key={i} type="button" onClick={() => toggle(access, setAccess, i)}
                  aria-pressed={access.includes(i)}
                  className={`rounded-full border px-3.5 py-2 text-[12.5px] transition-colors ${
                    access.includes(i) ? 'border-turquoise bg-turquoise/15 text-turquoise' : 'border-white/10 text-ink-mid hover:border-turquoise/40'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[11.5px] text-ink-faint">
              Accessibility at many Egyptian heritage sites has not been formally surveyed. The plan weights towards providers who record accessibility support, and says so where information is missing rather than assuming.
            </p>
          </fieldset>
        </div>
      )}

      {error && <p className="mt-4 rounded-lg border border-danger/35 bg-danger/8 px-3 py-2 text-[12.5px] text-danger">{error}</p>}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
          className="rounded-lg border border-white/12 px-4 py-2.5 text-[13px] text-ink-hi disabled:opacity-40 hover:bg-white/6"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-6 py-2.5 text-[13px] font-semibold text-[#0a1017]">
            Continue
          </button>
        ) : (
          <button onClick={build} disabled={busy} className="rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-6 py-2.5 text-[13px] font-semibold text-[#0a1017] disabled:opacity-50">
            {busy ? 'Building…' : 'Build my itinerary'}
          </button>
        )}
      </div>
    </div>
  );
}
