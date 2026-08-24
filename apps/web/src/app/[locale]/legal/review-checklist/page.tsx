import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHeader } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import { LEGAL_DRAFT_NOTICE, legalDocuments } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Legal review checklist',
  description:
    'Pre-launch checklist identifying which Egypt One policies require confirmation by Egyptian counsel and which third-party integrations require separate contractual or regulatory review.',
  robots: { index: false },
};

export default async function ReviewChecklistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const external = legalDocuments.filter((d) => (d.externalReview?.length ?? 0) > 0);

  return (
    <Page wide>
      <PageHeader
        eyebrow="Pre-launch"
        title="Legal review checklist"
        lead="Every document below must be confirmed by qualified Egyptian legal counsel before production launch."
      />

      <div className="surface-gold p-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {LEGAL_DRAFT_NOTICE}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-raised text-[11px] uppercase tracking-[0.16em] text-gold-500/80">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Approval status</th>
              <th className="px-4 py-3">Counsel review</th>
            </tr>
          </thead>
          <tbody>
            {legalDocuments.map((d) => (
              <tr key={d.slug} className="border-t border-white/8">
                <td className="px-4 py-3 text-ink-faint">{String(d.index).padStart(2, '0')}</td>
                <td className="px-4 py-3">
                  <Link href={L(locale as Locale, `/legal/${d.slug}`)} className="text-ink-hi hover:text-gold-300">
                    {d.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-faint">v{d.version}</td>
                <td className="px-4 py-3 text-ink-faint">{d.status}</td>
                <td className="px-4 py-3 text-gold-300">{d.counselReviewRequired ? 'Required' : 'Not required'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-[19px] font-semibold text-ink-hi">Third-party integrations requiring separate review</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {external.map((d) => (
          <div key={d.slug} className="surface p-5">
            <Link href={L(locale as Locale, `/legal/${d.slug}`)} className="text-[15px] font-semibold text-ink-hi hover:text-gold-300">
              {d.title}
            </Link>
            <ul className="mt-3 space-y-1.5">
              {(d.externalReview ?? []).map((x) => (
                <li key={x} className="text-[12px] text-ink-faint">
                  · {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Page>
  );
}
