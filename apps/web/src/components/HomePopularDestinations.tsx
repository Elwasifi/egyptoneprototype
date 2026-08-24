import Link from 'next/link';
import { SmartImage, SourceBadge } from '@egypt-one/ui';

type Heritage = {
  slug: string; name: string; classification: string;
  sourceStatus: 'LIVE' | 'VERIFIED_DATA' | 'PARTNER_DATA' | 'DEMO' | 'SIMULATED' | 'PLANNED_INTEGRATION';
};

/**
 * Repo2's "Popular destinations" cards show a fabricated star rating and
 * review count with no backing data anywhere in this project. Repo1 already
 * has an explicit product decision against that (see the /reviews page:
 * "Structured feedback rather than a star rating" — deliberately no rating
 * numbers anywhere on the site). So this teaser reuses the same idea —
 * a scannable grid of top destinations — but built from db.heritage's real
 * records and real classification tags instead, with no invented rating.
 */
export function HomePopularDestinations({ items, l }: { items: Heritage[]; l: (p: string) => string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((h) => (
        <Link key={h.slug} href={l(`/heritage/${h.slug}`)} className="surface lift group overflow-hidden p-0">
          <SmartImage
            seed={h.slug}
            subject={h.classification.includes('Islamic') ? 'mosque' : h.classification.includes('Coptic') ? 'church' : 'temple'}
            alt={h.name}
            ratio="4/3"
            className="rounded-none"
          />
          <div className="p-3">
            <p className="truncate text-[13px] font-semibold text-ink-hi group-hover:text-gold-200">{h.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-ink-faint">{h.classification}</p>
            <div className="mt-2"><SourceBadge status={h.sourceStatus} size="sm" /></div>
          </div>
        </Link>
      ))}
    </div>
  );
}
