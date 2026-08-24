'use client';
import * as React from 'react';
import Link from 'next/link';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import { consentTypes, getLegalDocument } from '@/lib/legal';

export function ConsentCentre({ locale }: { locale: Locale }) {
  const [notice, setNotice] = React.useState<string | null>(null);

  return (
    <>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {consentTypes.map((c) => {
          const policy = getLegalDocument(c.policySlug);
          return (
            <div key={c.key} className="surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink-hi">{c.label}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-faint">{c.description}</p>
                </div>
                <span
                  className={
                    c.required
                      ? 'shrink-0 rounded-full border border-white/12 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-ink-faint'
                      : 'shrink-0 rounded-full border border-gold-600/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-gold-300'
                  }
                >
                  {c.required ? 'Required' : 'Optional'}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-ink-faint/80">
                {policy && (
                  <Link href={L(locale, `/legal/${policy.slug}`)} className="text-gold-300 hover:underline">
                    {policy.title} · v{policy.version}
                  </Link>
                )}
                {c.sensitive && <span>Enhanced controls apply</span>}
              </div>

              <div className="mt-4">
                {c.required ? (
                  <p className="text-[12px] text-ink-faint/80">
                    Necessary for the service to operate — cannot be withdrawn while you use the platform.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setNotice("Preview — consent recording isn't connected to a backend yet.")}
                    className="rounded-xl border border-gold-600/35 bg-gold-600/10 px-4 py-2 text-[12px] text-gold-300 transition-colors hover:bg-gold-600/18"
                  >
                    Give consent
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {notice && (
        <div className="mt-6 surface-gold p-4 text-[12.5px] text-gold-200" role="status">
          {notice}
        </div>
      )}

      <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-ink-faint/80">
        Each record stores the user, policy, policy version, consent type, status, grant timestamp, withdrawal
        timestamp and audit metadata. Withdrawal does not affect processing carried out lawfully before it.
      </p>
    </>
  );
}
