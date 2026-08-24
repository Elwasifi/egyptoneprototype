import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { mailto } from '@/lib/site';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import { marketplacePageBySlug, marketplacePages } from '@/lib/marketplace';

export function generateStaticParams() {
  return marketplacePages.map((p) => ({ collection: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  const page = marketplacePageBySlug[collection as keyof typeof marketplacePageBySlug];
  if (!page) return { title: 'Collection not found' };
  return { title: `${page.title} — Made in Egypt`, description: page.intro };
}

export default async function MarketplaceCollectionPage({
  params,
}: {
  params: Promise<{ locale: string; collection: string }>;
}) {
  const { locale, collection } = await params;
  const page = marketplacePageBySlug[collection as keyof typeof marketplacePageBySlug];
  if (!page) notFound();
  const others = marketplacePages.filter((p) => p.slug !== page.slug);

  return (
    <div>
      <div className="relative">
        <img src={page.hero} alt={page.heroAlt} className="h-[46vh] min-h-[320px] w-full object-cover lg:h-[58vh]" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/75 to-void/30" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto w-full max-w-[1360px] px-5 pb-8 lg:px-6 lg:pb-14">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-500">{page.eyebrow}</p>
            <h1 className="text-[30px] font-semibold leading-tight sm:text-[38px] lg:text-[52px]">{page.title}</h1>
            <p className="mt-2 text-[14px] text-gold-300/90 lg:text-[15px]">{page.tagline}</p>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-ink-mid lg:text-[15px]">{page.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={mailto(page.buySubject)}
                className="rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-5 py-2.5 text-[13px] font-semibold text-[#0a1017] hover:from-gold-300 hover:to-gold-500"
              >
                Enquire & order
              </a>
              <a
                href="#experiences"
                className="rounded-lg border border-white/12 px-5 py-2.5 text-[13px] font-semibold text-ink-hi hover:bg-white/6"
              >
                Book an experience
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1360px] px-4 lg:px-6">
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {page.stats.map((s) => (
            <div key={s.label} className="surface p-5">
              <div className="text-[20px] font-semibold text-gold-300">{s.value}</div>
              <div className="mt-1 text-[12px] text-ink-faint">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Why it matters</div>
            <h2 className="mt-1.5 text-[22px] font-semibold sm:text-[26px]">What makes it worth the trip</h2>
            <p className="mt-1.5 max-w-2xl text-[13.5px] text-ink-low">
              Verified makers, transparent pricing and experiences you can book as a visitor.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {page.highlights.map((h) => (
              <article key={h.title} className="surface p-5">
                <h3 className="text-[13.5px] font-semibold text-ink-hi">{h.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-faint">{h.note}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {page.gallery.map((g) => (
            <figure key={g.caption} className="surface relative overflow-hidden p-0">
              <img src={g.image} alt={g.alt} loading="lazy" className="h-72 w-full object-cover lg:h-96" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[16px] font-semibold text-ink-hi">{g.caption}</p>
                <p className="mt-1 text-[12px] text-ink-mid">{g.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div id="experiences" className="mt-10 scroll-mt-24">
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">For visitors</div>
            <h2 className="mt-1.5 text-[22px] font-semibold sm:text-[26px]">Experiences you can book</h2>
            <p className="mt-1.5 max-w-2xl text-[13.5px] text-ink-low">
              Curated routes that put the making, tasting and buying in one day.
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {page.experiences.map((e) => (
              <article key={e.title} className="surface p-5">
                <h3 className="text-[13.5px] font-semibold text-ink-hi">{e.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-faint">{e.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 surface-gold flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">✦ AI Concierge</p>
              <h2 className="mt-2 text-[20px] font-semibold sm:text-[22px]">Add this to your itinerary</h2>
              <p className="mt-2 max-w-2xl text-[13px] text-ink-low">
                Tell the concierge your travel dates and it will slot the makers, markets and tastings into your trip.
              </p>
            </div>
            <a
              href={mailto(page.buySubject)}
              className="shrink-0 rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-5 py-2.5 text-[13px] font-semibold text-[#0a1017] hover:from-gold-300 hover:to-gold-500"
            >
              Enquire & order
            </a>
          </div>
        </div>

        <div className="mt-14 pb-14">
          <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Marketplace & crafts</div>
          <h2 className="text-[22px] font-semibold sm:text-[26px]">More from Made in Egypt</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={L(locale as Locale, `/marketplace/${o.slug}`)}
                className="surface group relative overflow-hidden p-0"
              >
                <img src={o.hero} alt={o.heroAlt} loading="lazy" className="h-40 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4">
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-ink-hi">{o.title}</span>
                    <span className="block truncate text-[11px] text-ink-mid">{o.tagline}</span>
                  </span>
                  <span className="shrink-0 text-gold-300">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
