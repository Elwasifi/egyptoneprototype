import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Shopping",
  description: "From Khan el-Khalili and the Akhmim looms to modern malls and the governorate craft collectives — where to buy, and what is actually made where.",
};

export default async function ShoppingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Commerce"}
        title={"Shopping"}
        lead={"From Khan el-Khalili and the Akhmim looms to modern malls and the governorate craft collectives — where to buy, and what is actually made where."}
        seed={"shopping"}
        subject={"market"}
        stats={[
      { label: 'Craft retailers', value: String(db.providers.byType('RETAILER').length) },
      { label: 'Catalogue entries', value: String(db.products.all().length) },
      { label: 'Governorate collections', value: '27' },
      { label: 'Live checkout', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"Where to shop"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Wear Egypt","body":"Clothing, traditional dress and jewellery by governorate.","href":"/wear-egypt","cta":"Open collections"},{"title":"Made in Egypt","body":"The wider marketplace of producers and retailers.","href":"/marketplace","cta":"Open marketplace"},{"title":"Craft by region","body":"Every governorate’s crafts, indexed to its page.","href":"/governorates","cta":"Browse regions"},{"title":"Markets and events","body":"Craft fairs and seasonal markets.","href":"/events","cta":"What is on"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
            c.href ? (
              <Link key={c.title} href={L(locale as Locale, c.href)} className="surface lift p-5">
                <h3 className="text-[14.5px] font-semibold text-ink-hi">{c.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-low">{c.body}</p>
                <span className="mt-3 inline-flex text-[12px] font-medium text-gold-300">{c.cta} &rarr;</span>
              </Link>
            ) : (
              <div key={c.title} className="surface p-5">
                <h3 className="text-[14.5px] font-semibold text-ink-hi">{c.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-low">{c.body}</p>
              </div>
            )
          ))}
        </div>
      </section>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Crafts by governorate</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.governorates.all().filter((g) => g.crafts.length).slice(0, 12).map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift p-4">
            <div className="text-[13px] font-semibold text-ink-hi">{g.name}</div>
            <div className="mt-2"><ChipList items={g.crafts} /></div>
          </Link>
        ))}
      </div>
      </section>

        <Boundary points={["Checkout requires a marketplace adapter and a licensed payment provider. Neither is connected.","Export restrictions apply to antiquities and certain materials — that is a matter for customs and the competent authority.","Artisan attribution in the demo catalogue is illustrative."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/wear-egypt","label":"Wear Egypt","body":"The collections."},{"href":"/marketplace","label":"Marketplace","body":"Producers and retailers."},{"href":"/governorates","label":"Governorates","body":"Craft by region."},{"href":"/events","label":"Events","body":"Craft fairs."}]}
        />
      </div>
    </Page>
  );
}
