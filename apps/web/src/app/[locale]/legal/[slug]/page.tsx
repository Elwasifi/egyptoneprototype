import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import { LEGAL_DRAFT_NOTICE, getLegalDocument, legalDocuments } from '@/lib/legal';

export function generateStaticParams() {
  return legalDocuments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getLegalDocument(slug);
  if (!d) return { title: 'Document not found' };
  return { title: `${d.title} — Legal Center`, description: d.summary };
}

export default async function LegalDocumentPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const d = getLegalDocument(slug);
  if (!d) notFound();
  const related = legalDocuments.filter((x) => x.category === d.category && x.slug !== d.slug).slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-10 lg:px-6">
      <Link href={L(locale as Locale, '/legal')} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/80 hover:text-gold-300">
        ← Legal Center
      </Link>

      <h1 className="mt-5 max-w-3xl text-[28px] font-semibold leading-tight text-ink-hi lg:text-[34px]">{d.title}</h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-low">{d.summary}</p>

      <div className="mt-6 surface-gold p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-300">{LEGAL_DRAFT_NOTICE}</p>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Version', d.version],
          ['Effective date', d.effectiveDate],
          ['Last updated', d.updatedDate],
          ['Document owner', d.owner],
          ['Approval status', d.status],
          ['Applicable languages', d.languages.map((l) => l.toUpperCase()).join(', ')],
          ['Category', d.category],
          ['Counsel review', d.counselReviewRequired ? 'Required' : 'Not required'],
        ].map(([k, v]) => (
          <div key={k} className="surface p-4">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">{k}</dt>
            <dd className="mt-1 text-[13px] text-ink-hi">{v}</dd>
          </div>
        ))}
      </dl>

      <article className="mt-10">
        {d.sections.map((s, i) => (
          <section key={s.heading} className="mt-8 first:mt-0">
            <h2 className="text-[18px] font-semibold text-ink-hi">
              <span className="mr-2 text-gold-400">{i + 1}.</span>
              {s.heading}
            </h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 text-[13.5px] leading-relaxed text-ink-low">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>

      {d.externalReview?.length ? (
        <div className="mt-10 surface p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/80">
            Requires separate contractual or regulatory review
          </h2>
          <ul className="mt-3 space-y-2">
            {d.externalReview.map((x) => (
              <li key={x} className="text-[13px] text-ink-low">
                · {x}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-10">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/80">Change history</h2>
        <ul className="mt-3 space-y-2">
          {d.changeHistory.map((c) => (
            <li key={c.version + c.date} className="surface p-4 text-[13px] text-ink-low">
              <span className="text-ink-hi">v{c.version}</span> · {c.date} — {c.note}
            </li>
          ))}
        </ul>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/80">Related documents</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={L(locale as Locale, `/legal/${r.slug}`)}
                className="surface p-4 text-[13px] text-ink-low transition-colors hover:border-gold-600/35 hover:text-ink-hi"
              >
                {r.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
