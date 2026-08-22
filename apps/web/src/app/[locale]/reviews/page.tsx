import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Reviews and visitor experience",
  description: "Structured feedback rather than a star rating: where the visitor came from, who they travelled with, what worked, what did not, and what they would change. That structure is what m",
};

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Visitor voice"}
        title={"Reviews and visitor experience"}
        lead={"Structured feedback rather than a star rating: where the visitor came from, who they travelled with, what worked, what did not, and what they would change. That structure is what makes the data useful to a governorate as well as to the next traveller."}
        seed={"reviews"}
        subject={"city"}
        stats={[
      { label: 'Feedback records', value: String(db.stories.all().length) },
      { label: 'Countries represented', value: String(new Set(db.stories.all().map((s: { country: string }) => s.country)).size) },
      { label: 'Moderated before publication', value: 'All' },
      { label: 'Incentivised reviews', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <InfoCard title={"What a review captures"}>
        <FactList rows={[["Visitor country","To understand which markets experience what"],["Group type","Solo, couple, family, group or business"],["Destinations visited","Linked to the actual registry records"],["Rating","Overall satisfaction"],["Positives and negatives","Free text, structured separately so neither drowns the other"],["Improvement suggestions","The field governorates and providers actually act on"],["Media","Optional video, subject to moderation and consent"]]} />
      </InfoCard>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Recent feedback</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.stories.all().slice(0, 9).map((s: { id: string; name: string; summary: string; country: string; groupType: string; rating: number; positives: string[]; negatives: string[]; suggestions: string[]; moderationState: string }) => (
          <div key={s.id} className="surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-ink-faint">{s.country} · {s.groupType}</span>
              <span className="text-[12px] text-gold-300">{'★'.repeat(s.rating)}</span>
            </div>
            <h3 className="mt-2 text-[13.5px] font-semibold text-ink-hi">{s.name}</h3>
            <p className="mt-1.5 text-[11.5px] text-ink-low">Liked: {s.positives.join(', ')}</p>
            <p className="mt-1 text-[11.5px] text-ink-low">Would change: {s.negatives.join(', ')}</p>
            <p className="mt-1 text-[11.5px] text-turquoise">Suggestion: {s.suggestions.join(', ')}</p>
            <div className="mt-3 flex items-center gap-2">
              <Badge tone={s.moderationState === 'PUBLISHED' ? 'ok' : 'warn'}>{s.moderationState === 'PUBLISHED' ? 'Published' : 'In review'}</Badge>
              <SourceBadge status="DEMO" size="sm" />
            </div>
          </div>
        ))}
      </div>
      </section>

        <Boundary points={["Reviews in this prototype are demonstration records, not real submissions.","Egypt One does not pay for, incentivise or solicit positive reviews, and would not publish one that had been.","Providers cannot remove a review; they can respond to it and can report one they believe is fraudulent.","Aggregated sentiment reaches the government dashboards only as aggregates, never as identifiable individuals."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/traveler-stories","label":"Traveller stories","body":"Long-form and video."},{"href":"/government/analytics","label":"Government analytics","body":"Where aggregates go."},{"href":"/support","label":"Support","body":"Report a problem."},{"href":"/provider/analytics","label":"Provider analytics","body":"What providers see."}]}
        />
      </div>
    </Page>
  );
}
