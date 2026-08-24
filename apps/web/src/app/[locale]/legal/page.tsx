import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import {
  LEGAL_DRAFT_NOTICE,
  governmentIntegrationStatuses,
  legalCategories,
  legalDocuments,
  partnerOnboardingGates,
} from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Legal & Compliance Center',
  description:
    "Egypt One's legal architecture: terms, privacy, data protection, security, AI transparency, partner and government integration policies, with version control and consent management.",
};

export default async function LegalCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <Page wide>
      <PageHeader
        eyebrow="Legal & Compliance"
        title="Egypt One Legal Center"
        lead="Every policy governing the platform, each with its own version, owner, effective date and change history."
      />

      <div className="surface-gold p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">Legal review status</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-low">{LEGAL_DRAFT_NOTICE}</p>
        <p className="mt-2 text-[12px] text-ink-faint">
          These drafts do not guarantee compliance with Egyptian or international law. A full legal review checklist
          is published below.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Policy documents', value: String(legalDocuments.length) },
          { label: 'Consent types recorded separately', value: '11' },
          { label: 'Enhanced-control data categories', value: '7' },
          { label: 'Approval status', value: 'DRAFT' },
        ].map((s) => (
          <div key={s.label} className="surface p-5">
            <p className="text-[22px] font-semibold text-ink-hi">{s.value}</p>
            <p className="mt-1 text-[12px] text-ink-faint">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="rounded-xl border border-gold-600/40 bg-gold-600/10 px-5 py-3 text-[13px] text-gold-300 transition-colors hover:bg-gold-600/18"
          href={L(locale as Locale, '/legal/consent')}
        >
          Open the Consent Centre
        </Link>
        <Link
          className="rounded-xl border border-white/12 bg-white/4 px-5 py-3 text-[13px] text-ink-hi transition-colors hover:border-gold-600/35"
          href={L(locale as Locale, '/legal/review-checklist')}
        >
          Legal review checklist
        </Link>
      </div>

      {legalCategories.map((category) => {
        const docs = legalDocuments.filter((d) => d.category === category);
        if (!docs.length) return null;
        return (
          <div key={category} className="mt-12">
            <h2 className="text-[19px] font-semibold text-ink-hi">{category}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {docs.map((d) => (
                <Link
                  key={d.slug}
                  href={L(locale as Locale, `/legal/${d.slug}`)}
                  className="surface group p-5 transition-colors hover:border-gold-600/35"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold-500/80">
                    Document {String(d.index).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 text-[15px] font-semibold leading-snug text-ink-hi group-hover:text-gold-300">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-ink-faint">{d.summary}</p>
                  <p className="mt-3 text-[11px] text-ink-faint/80">
                    v{d.version} · Effective {d.effectiveDate} · {d.status}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-12">
        <h2 className="text-[19px] font-semibold text-ink-hi">Government & official integration status</h2>
        <p className="mt-2 max-w-3xl text-[13.5px] text-ink-low">
          Egypt One is an independent platform and does not represent the Egyptian Government. Every integration
          carries an explicit status; LIVE is enabled only after documented authorisation.
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-raised text-[11px] uppercase tracking-[0.16em] text-gold-500/80">
              <tr>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {governmentIntegrationStatuses.map((g) => (
                <tr key={g.entity} className="border-t border-white/8">
                  <td className="px-4 py-3 text-ink-hi">{g.entity}</td>
                  <td className="px-4 py-3 text-ink-faint">{g.scope}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-gold-600/35 px-3 py-1 text-[11px] text-gold-300">
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-[19px] font-semibold text-ink-hi">Partner legal onboarding gates</h2>
        <p className="mt-2 max-w-3xl text-[13.5px] text-ink-low">
          A partner cannot be marked ACTIVE until every gate is cleared. Claims such as "Official" or "Verified by
          Egypt One" are only displayed where retained evidence supports that exact claim.
        </p>
        <ol className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {partnerOnboardingGates.map((gate, i) => (
            <li key={gate} className="surface p-4 text-[13px] text-ink-low">
              <span className="mr-2 text-gold-400">{String(i + 1).padStart(2, '0')}</span>
              {gate}
            </li>
          ))}
        </ol>
      </div>
    </Page>
  );
}
