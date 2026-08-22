#!/usr/bin/env node
/**
 * Emits the editorial and feature landing routes.
 *
 * Each entry supplies real content — sections, steps, facts and boundaries —
 * rather than a placeholder, and composes them from the shared Module kit.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'web', 'src', 'app', '[locale]');
const pascal = (s) => s.split(/[-/]/).map((x) => x[0].toUpperCase() + x.slice(1)).join('');

/**
 * section kinds:
 *  { kind:'prose', title, paras:[] }
 *  { kind:'steps', title, steps:[{title,body,note?}] }
 *  { kind:'facts', title, rows:[[k,v]] }
 *  { kind:'chips', title, items:[], tone? }
 *  { kind:'cards', title, sub?, cards:[{title,body,href?,cta?}] }
 *  { kind:'code',  title, expr }      // raw JSX expression, has `db` in scope
 */
const PAGES = [
  {
    route: 'about',
    title: 'About Egypt One',
    eyebrow: 'The platform',
    subject: 'modern',
    lead: 'Egypt One is a national digital platform that connects tourism, heritage, investment, services, health, research, commerce and events into one journey. It is a coordinator and a technology layer — not a replacement for government systems.',
    stats: `[
      { label: 'Governorates', value: '27' },
      { label: 'Country gateways', value: String(db.countries.count()) },
      { label: 'Route templates', value: '74' },
      { label: 'Specialised AI agents', value: '16' },
    ]`,
    sections: [
      { kind: 'prose', title: 'What the platform does', paras: [
        'Travellers, investors, researchers and businesses each arrive with a different question, and each of them currently has to assemble the answer from a dozen disconnected places. Egypt One puts one identity, one experience and one assistant across all of it: discover a place, understand its history, find a verified guide, book the transport, plan the medical or academic side of the trip, and — if the visit turns into an interest in building something — carry that through to the right authority.',
        'The platform sits between people and the systems that already exist. Providers keep their own inventory. Authorities keep their own registries, decisions and data. Egypt One coordinates the experience across them and keeps a record of where every piece of information came from.',
      ]},
      { kind: 'steps', title: 'The integration principle', steps: [
        { title: 'Authoritative system', body: 'A ministry, authority, university, hospital or company remains the system of record for its own data. Egypt One never takes direct database access.' },
        { title: 'Secure, approved exchange', body: 'Data moves through an agreed API using OAuth2/OIDC or mTLS, scoped to what the service actually needs, and rate-limited.' },
        { title: 'Integration layer', body: 'Adapters normalise what comes back and attach provenance: who owns it, when it was verified, and what class of data it is.' },
        { title: 'AI and service orchestration', body: 'Skills and agents compose across those adapters. No skill talks to a vendor directly.' },
        { title: 'User experience', body: 'The answer reaches the person with its source label intact — so an official answer and a demonstration one never look the same.', note: 'If the chain breaks at any point, the platform says so instead of filling the gap.' },
      ]},
      { kind: 'cards', title: 'What Egypt One is not', cards: [
        { title: 'Not a government system', body: 'It does not issue visas, licences, permits or approvals, and does not make sovereign decisions.' },
        { title: 'Not a payment processor', body: 'Money moves through a licensed payment service provider. The platform never holds funds.' },
        { title: 'Not a licensing authority', body: 'Platform verification is a check on submitted documents. Licensing belongs to the competent authority.' },
        { title: 'Not an investment adviser', body: 'It surfaces labelled indicators and names the competent entity. It does not advise, and it never guarantees a return.' },
        { title: 'Not a medical service', body: 'It does not diagnose, treat or interpret results, and health data carries the highest protection class.' },
        { title: 'Not a data broker', body: 'Sensitive data is never used for marketing or affiliate purposes, and every sensitive access is audited.' },
      ]},
      { kind: 'facts', title: 'Current status', rows: [
        ['Build stage', 'Working prototype — web only, fully responsive'],
        ['Data', 'Demonstration content across every module unless a badge says otherwise'],
        ['Government integrations', 'None connected. All are declared as planned.'],
        ['Commercial partnerships', 'None. Adapter classes exist; no agreement with any named company.'],
        ['Payments', 'Sandbox PSP adapter only. No live settlement.'],
        ['Golden Licence', 'Not held. An internal readiness tracker exists in the admin console.'],
      ]},
    ],
    boundary: [
      'Everything visible in this prototype is demonstration or synthetic data unless a source badge says otherwise.',
      'Egypt One does not claim any official status, endorsement or mandate.',
      'Figures in the business material behind this platform are illustrative management assumptions, not forecasts.',
    ],
    related: [['/discover', 'Discover Egypt', 'Start exploring.'], ['/admin/integrations', 'Integration registry', 'What is connected.'], ['/support', 'Support', 'Get help.'], ['/media', 'Media centre', 'Press material.']],
  },
  {
    route: 'discover',
    title: 'Discover Egypt',
    eyebrow: 'Start here',
    subject: 'pyramids',
    lead: 'One index into everything the platform holds: 27 governorates, eleven eras, the heritage registry, museums, the Nile and the sea, rural Egypt, the new cities and the country gateways that connect the world to all of it.',
    stats: `[
      { label: 'Destinations', value: String(db.destinations.all().length) },
      { label: 'Heritage records', value: String(db.heritage.all().length) },
      { label: 'Museums', value: String(db.museums.all().length) },
      { label: 'Events', value: String(db.events.all().length) },
    ]`,
    sections: [
      { kind: 'cards', title: 'By place', sub: 'Geography is the spine — every other module indexes against it.', cards: [
        { title: '27 governorates', body: 'Every region, from the Delta to the deep desert.', href: '/governorates', cta: 'Browse regions' },
        { title: 'Interactive map', body: 'All 27 on one canvas, filterable by layer.', href: '/map', cta: 'Open map' },
        { title: 'Rural Egypt', body: 'Villages, farms, crafts and the parts most itineraries miss.', href: '/rural-egypt', cta: 'Discover' },
        { title: 'New cities', body: 'The New Administrative Capital, New Alamein and the wider programme.', href: '/new-cities', cta: 'Explore' },
      ]},
      { kind: 'cards', title: 'By time', sub: 'Eleven eras of one continuous civilisation.', cards: [
        { title: 'Egypt through time', body: 'The timeline, era by era, with the monuments and museums attached to each.', href: '/egypt-through-time', cta: 'Open timeline' },
        { title: 'Rulers of Egypt', body: 'From unification to the modern republic.', href: '/rulers-of-egypt', cta: 'Ruler index' },
        { title: 'Heritage registry', body: 'Sites with honest access classifications.', href: '/heritage', cta: 'Open registry' },
        { title: 'Ancient Egypt Academy', body: 'Guided learning, hieroglyphs and mythology.', href: '/ancient-egypt-academy', cta: 'Start learning' },
      ]},
      { kind: 'cards', title: 'By water', sub: 'The river and two seas shape most of Egypt’s tourism.', cards: [
        { title: 'The Nile', body: 'Cruises, feluccas and river towns.', href: '/nile', cta: 'Explore the Nile' },
        { title: 'Red Sea & Mediterranean', body: 'Reefs, beaches and coastal towns.', href: '/sea', cta: 'Explore the coast' },
        { title: 'Nile cruises', body: 'Luxor to Aswan and Lake Nasser.', href: '/cruises', cta: 'See cruising' },
        { title: 'Yachts & marinas', body: 'Charter, berths and sea excursions.', href: '/yachts', cta: 'Open marinas' },
      ]},
      { kind: 'code', title: 'A place from every region', expr: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...new Map(db.governorates.all().map((g) => [g.region, g])).values()].map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift overflow-hidden p-0">
            <SmartImage seed={g.slug} subject={g.hasCoast ? 'sea' : g.hasNile ? 'nile' : 'desert'} alt={g.name} ratio="16/10" />
            <div className="p-3.5">
              <div className="text-[13.5px] font-semibold text-ink-hi">{g.name}</div>
              <div className="mt-1 text-[11px] text-ink-faint">{g.region}</div>
            </div>
          </Link>
        ))}
      </div>` },
    ],
    boundary: [
      'Destination content is editorial. Access to any heritage site follows that site’s own classification.',
      'Nothing in this index is bookable in the prototype.',
    ],
    related: [['/trip-builder', 'Trip builder', 'Turn this into a route.'], ['/egypt-195', 'Egypt 195', 'Arriving from your country.'], ['/events', 'Events', 'What is on.'], ['/search', 'Search', 'Find anything.']],
  },
  {
    route: 'egypt-through-time',
    title: 'Egypt through time',
    eyebrow: 'Timeline',
    subject: 'temple',
    lead: 'Eleven eras, from the Neolithic Nile cultures that became the first unified state to the Egypt being built now. Each era carries its rulers, its monuments, the museums that hold its objects and the registry entries that survive from it.',
    stats: `[
      { label: 'Eras', value: String(db.eras.all().length) },
      { label: 'Ruler profiles', value: String(db.rulers.all().length) },
      { label: 'Registry entries', value: String(db.heritage.all().length) },
      { label: 'Museums', value: String(db.museums.all().length) },
    ]`,
    sections: [
      { kind: 'code', title: 'The eras', expr: `<div className="grid gap-4">
        {db.eras.all().map((e) => {
          const sites = db.heritage.byEra(e.key);
          const rulers = db.rulers.byEra(e.key);
          return (
            <section key={e.key} id={e.key.toLowerCase()} className="surface p-5 scroll-mt-24">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="block h-1 w-14 rounded-full" style={{ background: e.colour }} aria-hidden="true" />
                  <h3 className="mt-3 text-[18px] font-semibold text-ink-hi">{e.name}</h3>
                  <p className="mt-1 text-[12px] text-gold-500">{(e as unknown as { from_: string }).from_} – {e.to}</p>
                </div>
                <div className="flex gap-2">
                  <Badge tone="neutral">{sites.length} sites</Badge>
                  <Badge tone="neutral">{rulers.length} rulers</Badge>
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-ink-mid">{e.summary}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Monuments</div>
                  <ChipList items={e.monuments} tone="gold" />
                </div>
                <div>
                  <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Museums</div>
                  <ChipList items={e.museums} />
                </div>
                <div>
                  <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Rulers</div>
                  {rulers.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {rulers.map((r) => (
                        <Link key={r.slug} href={L(locale as Locale, '/rulers-of-egypt/' + r.slug)} className="rounded-full border border-white/10 px-2.5 py-1 text-[11.5px] text-ink-mid hover:border-gold-600/40 hover:text-gold-300">{r.name}</Link>
                      ))}
                    </div>
                  ) : <p className="text-[12px] text-ink-faint">No profile recorded yet.</p>}
                </div>
              </div>
              {sites.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-[12.5px] text-gold-300">Registry entries from this era ({sites.length})</summary>
                  <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                    {sites.map((s) => (
                      <li key={s.slug}>
                        <Link href={L(locale as Locale, '/heritage/' + s.slug)} className="text-[12px] text-ink-low hover:text-gold-300">{s.name}</Link>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          );
        })}
      </div>` },
    ],
    boundary: [
      'Dates for early periods follow a conventional chronology. Egyptologists disagree about many of them.',
      'Era boundaries are a scholarly convention, not sharp historical events.',
      'This timeline is an editorial overview and should not be cited as an academic source.',
    ],
    related: [['/rulers-of-egypt', 'Rulers of Egypt', 'Who ruled when.'], ['/heritage', 'Heritage registry', 'What survives.'], ['/museums', 'Museums', 'Where objects are.'], ['/ancient-egypt-academy', 'Academy', 'Learn the periods.']],
  },
  {
    route: 'ancient-egypt-academy',
    title: 'Ancient Egypt Academy',
    eyebrow: 'Learn',
    subject: 'temple',
    lead: 'Guided learning about Ancient Egyptian civilisation: the rulers, the writing system, the monuments, the mythology and the archaeology — built for curious travellers first and academic pathways second.',
    stats: `[
      { label: 'Learning tracks', value: '6' },
      { label: 'Eras covered', value: String(db.eras.all().length) },
      { label: 'Linked sites', value: String(db.heritage.all().length) },
      { label: 'Certification offered', value: 'None' },
    ]`,
    sections: [
      { kind: 'cards', title: 'Learning tracks', sub: 'Each track links out to the registry, the museums and the timeline rather than duplicating them.', cards: [
        { title: 'Civilisation foundations', body: 'The Nile, the calendar, state formation and why Egypt cohered for three thousand years.', href: '/egypt-through-time', cta: 'Start with the timeline' },
        { title: 'Rulers and dynasties', body: 'From Narmer to Cleopatra VII, and what each reign is actually known for.', href: '/rulers-of-egypt', cta: 'Ruler index' },
        { title: 'Hieroglyphs and language', body: 'The writing system, its decipherment, and the shape of the Egyptian language across its stages.', href: '/research', cta: 'Language programmes' },
        { title: 'Monuments and building', body: 'Pyramid, mastaba, rock-cut tomb and temple — how and why the forms changed.', href: '/heritage', cta: 'Heritage registry' },
        { title: 'Mythology and religion', body: 'The major cults, funerary belief and how religion shaped the built landscape.', href: '/museums', cta: 'See the objects' },
        { title: 'Archaeology today', body: 'How sites are excavated, conserved and published — and who decides.', href: '/restoration', cta: 'Restoration pipeline' },
      ]},
      { kind: 'steps', title: 'How a guided journey works', steps: [
        { title: 'Pick a track', body: 'Each track is a sequence of short lessons anchored to real records in the platform.' },
        { title: 'Learn against the registry', body: 'Every lesson links to the heritage entries, museums and rulers it discusses, so you can always check the underlying record.' },
        { title: 'Test yourself', body: 'Short quizzes reinforce the sequence. Results stay on your account and are never shared.' },
        { title: 'Take it to the ground', body: 'Turn a completed track into an itinerary that visits what you have just studied.', note: 'The trip builder picks up the sites a track referenced.' },
      ]},
      { kind: 'chips', title: 'Concepts covered', tone: 'gold', items: ['Predynastic Naqada', 'State formation', 'Old Kingdom pyramid complexes', 'Middle Kingdom administration', 'New Kingdom empire', 'Amarna period', 'Third Intermediate Period', 'Ptolemaic syncretism', 'Roman Egypt', 'Coptic monasticism', 'Islamic architecture of Cairo', 'Hieroglyphic, hieratic, demotic, Coptic', 'Mummification', 'Funerary literature', 'Temple economy', 'Nilometry and the calendar'] },
    ],
    boundary: [
      'The Academy is an educational overview. It is not accredited and issues no certificate or qualification.',
      'Where scholarship is divided, the material says so rather than picking a side and presenting it as settled.',
      'For formal study, the research portal lists university programmes.',
    ],
    related: [['/research', 'Research portal', 'Formal programmes.'], ['/universities', 'Universities', 'Where to study.'], ['/heritage', 'Heritage registry', 'The sites themselves.'], ['/museums', 'Museums', 'The collections.']],
  },
  {
    route: 'nile',
    title: 'The Nile',
    eyebrow: 'Water',
    subject: 'nile',
    lead: 'The river that made the country: cruising between Luxor and Aswan, feluccas at sunset, river transport, island villages and the towns whose entire shape follows the water.',
    stats: `[
      { label: 'Nile governorates', value: String(db.governorates.all().filter((g) => g.hasNile).length) },
      { label: 'Riverside heritage', value: String(db.heritage.all().filter((h) => (db.governorates.bySlug(h.governorateSlug)?.hasNile) ?? false).length) },
      { label: 'Cruise routes', value: '3' },
      { label: 'Live booking adapters', value: '0' },
    ]`,
    sections: [
      { kind: 'cards', title: 'On the water', cards: [
        { title: 'Nile cruises', body: 'Luxor–Aswan, Aswan–Abu Simbel by Lake Nasser, and longer Cairo routes.', href: '/cruises', cta: 'See cruising' },
        { title: 'Feluccas', body: 'Traditional sail on short river crossings and sunset runs.', href: '/activities', cta: 'Find experiences' },
        { title: 'River transport', body: 'Crossings, island access and short-hop river services.', href: '/transport', cta: 'Transport module' },
        { title: 'Riverside stays', body: 'Hotels and residences on the corniche.', href: '/hotels', cta: 'Find a stay' },
      ]},
      { kind: 'code', title: 'Governorates on the Nile', expr: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {db.governorates.all().filter((g) => g.hasNile).map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift p-4">
            <div className="text-[13.5px] font-semibold text-ink-hi">{g.name}</div>
            <div className="mt-1 text-[11.5px] text-ink-faint">{g.region}</div>
            <div className="mt-2 text-[11.5px] text-ink-low">{g.highlights[0]}</div>
          </Link>
        ))}
      </div>` },
      { kind: 'prose', title: 'Why the river still organises everything', paras: [
        'Almost the entire population of Egypt lives within a few kilometres of the Nile or its delta. That single fact explains the distribution of heritage sites, the location of every ancient capital, the pattern of modern agriculture and the reason a river cruise still functions as a practical way to move between the great southern temple sites.',
        'On this platform the river is a filter as much as a destination: governorates, heritage entries, providers and investment opportunities can all be viewed through whether they sit on the water.',
      ]},
    ],
    boundary: [
      'Cruise itineraries, vessel standards and departure dates come from operators. None is connected in this prototype.',
      'Water safety, licensing and vessel inspection are matters for the competent authority.',
    ],
    related: [['/cruises', 'Nile cruises', 'The vessels and routes.'], ['/sea', 'Red Sea & Mediterranean', 'The coasts.'], ['/governorates/luxor', 'Luxor', 'The southern temple city.'], ['/governorates/aswan', 'Aswan', 'The first cataract.']],
  },
  {
    route: 'sea',
    title: 'Red Sea and Mediterranean',
    eyebrow: 'Water',
    subject: 'sea',
    lead: 'Two very different coasts: the Red Sea with some of the most intact coral reef systems in the world, and a Mediterranean shoreline that carries Alexandria, El Alamein and the western beaches.',
    stats: `[
      { label: 'Coastal governorates', value: String(db.governorates.all().filter((g) => g.hasCoast).length) },
      { label: 'Marine providers', value: String(db.providers.byType('YACHT').length) },
      { label: 'Coastal stays', value: String(db.providers.byType('HOTEL').filter((h) => db.governorates.bySlug(h.governorateSlug)?.hasCoast).length) },
      { label: 'Live dive bookings', value: '0' },
    ]`,
    sections: [
      { kind: 'cards', title: 'What the coasts offer', cards: [
        { title: 'Diving and snorkelling', body: 'Reef systems off Hurghada, Marsa Alam, Sharm El Sheikh and Dahab.', href: '/activities', cta: 'Find operators' },
        { title: 'Yachts and marinas', body: 'Charter, berthing and sea excursions.', href: '/yachts', cta: 'Open marinas' },
        { title: 'Coastal stays', body: 'Resorts, boutique properties and residences.', href: '/hotels', cta: 'Find a stay' },
        { title: 'Protected areas', body: 'Ras Mohammed, Wadi El Gemal and the Giftun islands.', href: '/heritage', cta: 'Registry' },
      ]},
      { kind: 'code', title: 'Coastal governorates', expr: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {db.governorates.all().filter((g) => g.hasCoast).map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift p-4">
            <div className="text-[13.5px] font-semibold text-ink-hi">{g.name}</div>
            <div className="mt-1 text-[11.5px] text-ink-faint">{g.region}</div>
            <div className="mt-2 text-[11.5px] text-ink-low">{g.highlights.slice(0, 2).join(' · ')}</div>
          </Link>
        ))}
      </div>` },
      { kind: 'prose', title: 'Reefs are the asset', paras: [
        'Red Sea tourism rests almost entirely on reef health. That makes carrying capacity, mooring practice, wastewater treatment and dive-operator standards commercial questions as much as environmental ones — which is why the investment module treats marine development and conservation as the same conversation rather than opposing ones.',
      ]},
    ],
    boundary: [
      'Dive operator certification and vessel licensing are matters for the competent authority, not this platform.',
      'Protected-area access rules are set by the managing authority and can change at short notice.',
      'Reef and weather conditions are not published here.',
    ],
    related: [['/yachts', 'Yachts & marinas', 'On the water.'], ['/nile', 'The Nile', 'The other water.'], ['/governorates/red-sea', 'Red Sea', 'The governorate.'], ['/governorates/south-sinai', 'South Sinai', 'Sharm and Dahab.']],
  },
  {
    route: 'cruises',
    title: 'Nile cruises',
    eyebrow: 'Water',
    subject: 'nile',
    lead: 'The classic way to move between the southern temple sites: a floating base that repositions overnight so the mornings are spent at Karnak, Edfu, Kom Ombo and Philae rather than in transit.',
    stats: `[
      { label: 'Principal routes', value: '3' },
      { label: 'Temple stops on the classic route', value: '6' },
      { label: 'Operators listed', value: String(db.providers.byType('TOUR_OPERATOR').length) },
      { label: 'Live availability', value: 'None' },
    ]`,
    sections: [
      { kind: 'steps', title: 'The routes', steps: [
        { title: 'Luxor → Aswan (3–4 nights)', body: 'The classic southbound run: Karnak and the West Bank, Esna, Edfu, Kom Ombo, then Aswan and Philae.' },
        { title: 'Aswan → Luxor (4–5 nights)', body: 'The same corridor northbound, usually with more time at Aswan before departure.' },
        { title: 'Lake Nasser (3–4 nights)', body: 'Aswan to Abu Simbel across the reservoir, taking in the relocated Nubian temples.', note: 'A different vessel class and a different booking pattern from the main river.' },
      ]},
      { kind: 'cards', title: 'What a cruise connects', cards: [
        { title: 'Karnak and Luxor Temple', body: 'The largest religious complex of the ancient world.', href: '/heritage/karnak-temple-complex', cta: 'Registry entry' },
        { title: 'Valley of the Kings', body: 'The New Kingdom royal necropolis on the West Bank.', href: '/heritage/valley-of-the-kings', cta: 'Registry entry' },
        { title: 'Temple of Horus at Edfu', body: 'The most completely preserved Ptolemaic temple.', href: '/heritage/temple-of-horus-at-edfu', cta: 'Registry entry' },
        { title: 'Philae Temple of Isis', body: 'Relocated stone by stone during the Nubian rescue campaign.', href: '/heritage/philae-temple-of-isis', cta: 'Registry entry' },
      ]},
    ],
    boundary: [
      'Vessel standards, safety certification and river licensing are matters for the competent authority.',
      'Departure dates, cabin availability and pricing require a connected operator adapter. None is live.',
      'Temple access on any itinerary follows that site’s own classification.',
    ],
    related: [['/nile', 'The Nile', 'The wider river.'], ['/governorates/luxor', 'Luxor', 'Where most cruises start.'], ['/governorates/aswan', 'Aswan', 'Where they end.'], ['/trip-builder', 'Trip builder', 'Fit a cruise into a route.']],
  },
  {
    route: 'yachts',
    title: 'Yachts and marinas',
    eyebrow: 'Water',
    subject: 'sea',
    lead: 'Charter, berthing, sea excursions and fishing across the Red Sea, the Mediterranean and the Gulf of Suez — plus the marina development pipeline that sits behind them on the investment side.',
    stats: `[
      { label: 'Charter providers', value: String(db.providers.byType('YACHT').length) },
      { label: 'Coastal governorates', value: String(db.governorates.all().filter((g) => g.hasCoast).length) },
      { label: 'Marina opportunities', value: String(db.investment.all().filter((o) => /marina/i.test(o.sector)).length) },
      { label: 'Live charter adapters', value: '0' },
    ]`,
    sections: [
      { kind: 'code', title: 'Charter providers', expr: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.providers.byType('YACHT').map((p) => (
          <div key={p.slug} className="surface p-4">
            <div className="text-[13.5px] font-semibold text-ink-hi">{p.name}</div>
            <div className="mt-1 text-[11.5px] text-ink-faint">{p.governorateSlug.replace(/-/g, ' ')}</div>
            <div className="mt-2 text-[12px] text-ink-low">{p.priceFrom ? 'Indicative from ' + p.currency + ' ' + p.priceFrom : 'Rate on request'}</div>
            <div className="mt-3"><SourceBadge status={p.sourceStatus} size="sm" /></div>
          </div>
        ))}
      </div>` },
      { kind: 'prose', title: 'Marinas as infrastructure', paras: [
        'Berth capacity is one of the practical constraints on Egyptian marine tourism: a coastline can attract charter demand it cannot physically service. That is why marina development appears in the investment module as its own category rather than as a footnote under hospitality — the berth, the fuel, the customs point and the service yard are all separate pieces of a working marine economy.',
      ]},
    ],
    boundary: [
      'Vessel registration, crew certification and port clearance are matters for the competent authority.',
      'Charter rates and availability need a connected provider. None is live.',
      'Cruising permissions in protected waters are granted by the managing authority.',
    ],
    related: [['/sea', 'Red Sea & Mediterranean', 'The coasts.'], ['/investment-opportunities', 'Marina opportunities', 'The development side.'], ['/vip-transport', 'VIP transport', 'Getting to the berth.'], ['/activities', 'Sea excursions', 'Day experiences.']],
  },
  {
    route: 'flights',
    title: 'Flights',
    eyebrow: 'Getting here',
    subject: 'modern',
    lead: 'Egypt One does not sell flights. It holds an airline-distribution adapter contract so that, once an agreement exists, search and fares can appear inside a trip rather than in a separate tab.',
    stats: `[
      { label: 'Airline adapters', value: '1 contract' },
      { label: 'Live adapters', value: '0' },
      { label: 'Country gateways', value: String(db.countries.count()) },
      { label: 'Fares shown', value: 'None' },
    ]`,
    sections: [
      { kind: 'prose', title: 'Why this page is honest rather than useful yet', paras: [
        'A flight search that returns invented fares is worse than no flight search. Until an airline or distribution partner is connected, this module shows the adapter state and points you to the gateway page for your country, where the realistic routing options are described without pretending to be a schedule.',
      ]},
      { kind: 'cards', title: 'What you can do instead', cards: [
        { title: 'Your country gateway', body: 'Realistic routing and connectivity from where you are.', href: '/egypt-195', cta: 'Choose your country' },
        { title: 'Entry requirements', body: 'What to verify before booking anything.', href: '/visa', cta: 'Visa & entry' },
        { title: 'Build the ground itinerary', body: 'Plan what happens after you land.', href: '/trip-builder', cta: 'Trip builder' },
        { title: 'Airport transfers', body: 'Ground transport on arrival.', href: '/transport', cta: 'Transport' },
      ]},
      { kind: 'facts', title: 'Adapter state', rows: [
        ['Contract', 'FlightProviderAdapter'],
        ['State', 'PLANNED — no credentials, no agreement'],
        ['Data class', 'PARTNER'],
        ['Commission model', 'Affiliate, contractual — not applied to any government fee'],
        ['Fares shown while planned', 'None. The module refuses rather than estimating.'],
      ]},
    ],
    boundary: [
      'No airline is a partner of Egypt One. Adapter classes exist; agreements do not.',
      'Nothing here is a schedule, a fare or an availability.',
      'Ticketing and refunds would run through the airline and a licensed payment provider, never through this platform directly.',
    ],
    related: [['/egypt-195', 'Egypt 195', 'Routes from your country.'], ['/visa', 'Visa & entry', 'Before you fly.'], ['/transport', 'Transport', 'After you land.'], ['/partner/integrations', 'Integrations', 'Adapter registry.']],
  },
  {
    route: 'shopping',
    title: 'Shopping',
    eyebrow: 'Commerce',
    subject: 'market',
    lead: 'From Khan el-Khalili and the Akhmim looms to modern malls and the governorate craft collectives — where to buy, and what is actually made where.',
    stats: `[
      { label: 'Craft retailers', value: String(db.providers.byType('RETAILER').length) },
      { label: 'Catalogue entries', value: String(db.products.all().length) },
      { label: 'Governorate collections', value: '27' },
      { label: 'Live checkout', value: 'None' },
    ]`,
    sections: [
      { kind: 'cards', title: 'Where to shop', cards: [
        { title: 'Wear Egypt', body: 'Clothing, traditional dress and jewellery by governorate.', href: '/wear-egypt', cta: 'Open collections' },
        { title: 'Made in Egypt', body: 'The wider marketplace of producers and retailers.', href: '/marketplace', cta: 'Open marketplace' },
        { title: 'Craft by region', body: 'Every governorate’s crafts, indexed to its page.', href: '/governorates', cta: 'Browse regions' },
        { title: 'Markets and events', body: 'Craft fairs and seasonal markets.', href: '/events', cta: 'What is on' },
      ]},
      { kind: 'code', title: 'Crafts by governorate', expr: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.governorates.all().filter((g) => g.crafts.length).slice(0, 12).map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift p-4">
            <div className="text-[13px] font-semibold text-ink-hi">{g.name}</div>
            <div className="mt-2"><ChipList items={g.crafts} /></div>
          </Link>
        ))}
      </div>` },
    ],
    boundary: [
      'Checkout requires a marketplace adapter and a licensed payment provider. Neither is connected.',
      'Export restrictions apply to antiquities and certain materials — that is a matter for customs and the competent authority.',
      'Artisan attribution in the demo catalogue is illustrative.',
    ],
    related: [['/wear-egypt', 'Wear Egypt', 'The collections.'], ['/marketplace', 'Marketplace', 'Producers and retailers.'], ['/governorates', 'Governorates', 'Craft by region.'], ['/events', 'Events', 'Craft fairs.']],
  },
  {
    route: 'visa',
    title: 'Visa and entry',
    eyebrow: 'Before you travel',
    subject: 'modern',
    lead: 'Egypt One is a navigation layer for entry requirements. It does not issue, approve or confirm any entry permission, and it will not guess at a requirement it cannot verify.',
    stats: `[
      { label: 'Country gateways', value: String(db.countries.count()) },
      { label: 'Authority integrations connected', value: '0' },
      { label: 'Visas issued here', value: 'None' },
      { label: 'Decisions made here', value: 'None' },
    ]`,
    sections: [
      { kind: 'prose', title: 'How this works', paras: [
        'Entry requirements for Egypt depend on nationality, purpose of travel, route, duration and current policy — and they change. There is exactly one authoritative answer for any given traveller, and it comes from the competent Egyptian authority or an Egyptian diplomatic mission, not from a platform.',
        'What Egypt One can usefully do is route you to the right place, explain the shape of the process, hold your trip context so you know what you are applying for, and record what you have checked. When an official integration is connected, verified guidance will appear here with an official-source label. Until then, this page tells you where to go rather than what the answer is.',
      ]},
      { kind: 'steps', title: 'What to check before booking anything', steps: [
        { title: 'Confirm the requirement for your nationality', body: 'Check with the Egyptian mission accredited to your country or the competent authority. Do not rely on a third-party summary.' },
        { title: 'Check passport validity and blank pages', body: 'Validity requirements are set by the authority and are commonly stricter than travellers expect.' },
        { title: 'Match the visa type to your purpose', body: 'Tourism, business, study, research, medical treatment and work are different categories with different evidence requirements.' },
        { title: 'Allow for processing time', body: 'Build the lead time into your trip dates before committing to non-refundable bookings.' },
        { title: 'Carry supporting documents', body: 'Accommodation, return travel and funds evidence may be requested on arrival.', note: 'Egypt One can assemble your itinerary as supporting material, but the decision is never ours.' },
      ]},
      { kind: 'facts', title: 'Integration status', rows: [
        ['Visa and entry information service', 'PLANNED — not connected'],
        ['Ministry of Foreign Affairs mission directory', 'PLANNED — not connected'],
        ['Data class', 'RESTRICTED GOVERNMENT'],
        ['Write access', 'None. Read-only by design, even once connected.'],
        ['What is shown meanwhile', 'Navigation and process shape only, labelled as demonstration content.'],
      ]},
    ],
    boundary: [
      'Nothing on this page is an official answer about entry to Egypt.',
      'Egypt One cannot issue, expedite, guarantee or appeal any entry decision.',
      'Requirements change. Verify close to travel, not months ahead.',
      'Be cautious of any site that offers to "guarantee" a visa — this platform never will.',
    ],
    related: [['/egypt-195', 'Egypt 195', 'Guidance by country.'], ['/safety', 'Safety centre', 'Once you are here.'], ['/trip-builder', 'Trip builder', 'Plan around the lead time.'], ['/support', 'Support', 'Ask a question.']],
  },
  {
    route: 'safety',
    title: 'Safety centre',
    eyebrow: 'Support',
    subject: 'city',
    lead: 'Emergency navigation, embassy routing, lost document and lost person workflows — and a clear account of what the platform can and cannot do in an emergency.',
    stats: `[
      { label: 'Location modes', value: '3' },
      { label: 'Consent required', value: 'Always' },
      { label: 'Automatic authority contact', value: 'Never' },
      { label: 'Audited accesses', value: 'All' },
    ]`,
    sections: [
      { kind: 'prose', title: 'In an emergency', paras: [
        'If you are in immediate danger, contact local emergency services directly. Do not wait for an assistant, an app or a support ticket. Egypt One is not an emergency service and cannot dispatch help.',
        'What the platform can do is hold the context — where your trip says you are, which mission serves your nationality, which hospital is nearest, what your booking references are — so that when you reach a human, the conversation starts further along.',
      ]},
      { kind: 'steps', title: 'Lost passport', steps: [
        { title: 'Report it to the police', body: 'A police report is normally the first document your mission will ask for.' },
        { title: 'Contact your embassy or consulate', body: 'They issue emergency travel documents. Egypt One can help you identify the accredited mission but does not contact them for you.' },
        { title: 'Gather what you have', body: 'Photocopies, digital scans, booking references and your trip record all help.' },
        { title: 'Adjust your travel', body: 'Onward travel usually needs rescheduling. Your itinerary is here to work from.', note: 'Egypt One never holds or transmits your passport data without explicit consent.' },
      ]},
      { kind: 'facts', title: 'Location consent modes', rows: [
        ['OFF', 'The default. No location is read, stored or inferred.'],
        ['TRIP MODE', 'Coarse location while a trip is active, used only for itinerary context. Revocable at any time.'],
        ['EMERGENCY MODE', 'Precise location, opened by you, for a stated emergency purpose. Every read is audited and it expires.'],
        ['Marketing use', 'Never. Location is classified SENSITIVE and is excluded from marketing and affiliate use entirely.'],
      ]},
      { kind: 'cards', title: 'Other situations', cards: [
        { title: 'Lost family member', body: 'A structured workflow that escalates to a human operator rather than an automated response.', href: '/support', cta: 'Contact support' },
        { title: 'Medical emergency', body: 'Provider navigation. Egypt One does not diagnose or advise clinically.', href: '/medical-tourism', cta: 'Medical module' },
        { title: 'Embassy and consulate', body: 'Mission routing by nationality.', href: '/egypt-195', cta: 'Find your gateway' },
        { title: 'Report a problem', body: 'Provider issues, unsafe listings or suspected fraud.', href: '/support', cta: 'Report an issue' },
      ]},
    ],
    boundary: [
      'Egypt One is not an emergency service and cannot dispatch police, ambulance or rescue.',
      'The platform never contacts authorities on your behalf without your explicit instruction.',
      'Emergency numbers and official procedures must come from the competent authority. That integration is not connected.',
      'No claim is made about the confidentiality of any third-party helpline.',
    ],
    related: [['/account/consent', 'Consent centre', 'Control location sharing.'], ['/visa', 'Visa & entry', 'Documents.'], ['/medical-tourism', 'Medical', 'Health providers.'], ['/support', 'Support', 'Reach a human.']],
  },
  {
    route: 'support',
    title: 'Support centre',
    eyebrow: 'Help',
    subject: 'city',
    lead: 'Help with trips, bookings, accounts, providers and reporting problems — routed by an operations agent to a human, never resolved by an automated response where a person is needed.',
    stats: `[
      { label: 'Escalation to human', value: 'Always available' },
      { label: 'Case data class', value: 'PERSONAL' },
      { label: 'Auto-closed cases', value: 'None' },
      { label: 'Response target', value: 'Contractual' },
    ]`,
    sections: [
      { kind: 'cards', title: 'What can we help with', cards: [
        { title: 'Trips and itineraries', body: 'Planning, editing and understanding what is and is not booked.', href: '/account/trips', cta: 'My trips' },
        { title: 'Bookings', body: 'Status, changes and cancellations — subject to the provider’s own terms.', href: '/account/bookings', cta: 'My bookings' },
        { title: 'Account and privacy', body: 'Access, correction, consent and deletion of your data.', href: '/account/consent', cta: 'Consent centre' },
        { title: 'Providers and listings', body: 'Onboarding, verification and inventory questions.', href: '/provider', cta: 'Provider portal' },
        { title: 'Report an issue', body: 'Unsafe listings, suspected fraud, misrepresented verification or incorrect content.', href: '/support#report', cta: 'Report' },
        { title: 'Safety and emergency', body: 'Urgent situations route straight to the safety centre.', href: '/safety', cta: 'Safety centre' },
      ]},
      { kind: 'steps', title: 'How a case moves', steps: [
        { title: 'You raise it', body: 'Through the concierge, this page or a provider portal. A reference is created immediately.' },
        { title: 'Operations triage', body: 'The Operations Agent classifies and routes it. It cannot decide a verification, alter a financial record or touch health data.' },
        { title: 'A human owns it', body: 'Every case has a named owner. Automated responses never close a case on their own.' },
        { title: 'Resolution and record', body: 'The outcome is recorded against the case, and any sensitive access made in resolving it is in the audit log.' },
      ]},
      { kind: 'facts', title: 'Contact', rows: [
        ['Prototype status', 'This is a demonstration build; no live support desk is staffed.'],
        ['Emergency', 'Contact local emergency services directly. This platform is not an emergency service.'],
        ['Data protection requests', 'Handled through the consent centre and the platform’s data protection process.'],
        ['Report an issue', 'Anything that looks misrepresented — especially a verification claim — should be reported.'],
      ]},
    ],
    boundary: [
      'No live support desk operates in this prototype.',
      'Support agents can see customer records with a stated purpose, and those accesses are audited and minimised.',
      'Support cannot override a provider’s cancellation terms, a payment provider’s decision or an authority’s ruling.',
    ],
    related: [['/safety', 'Safety centre', 'Urgent situations.'], ['/account/consent', 'Consent centre', 'Your data.'], ['/about', 'About', 'What this platform is.'], ['/reviews', 'Reviews', 'Structured feedback.']],
  },
  {
    route: 'media',
    title: 'Media centre',
    eyebrow: 'Press',
    subject: 'city',
    lead: 'Material for journalists, partners and campaign teams — plus the moderation and approval workflow that every piece of published traveller content passes through.',
    stats: `[
      { label: 'Stories in the queue', value: String(db.stories.all().length) },
      { label: 'Published', value: String(db.stories.all().filter((s: { moderationState: string }) => s.moderationState === 'PUBLISHED').length) },
      { label: 'Auto-published', value: '0' },
      { label: 'Human approvals required', value: 'Every one' },
    ]`,
    sections: [
      { kind: 'steps', title: 'How content reaches publication', steps: [
        { title: 'Submission', body: 'A traveller, guide or coordinator uploads text or video through their account.' },
        { title: 'Moderation', body: 'Content is checked for safety, accuracy of claims and consent from anyone identifiable in it.' },
        { title: 'Marketing review', body: 'The Marketing Agent can classify, segment and queue content — it cannot publish. A human approves.' },
        { title: 'Editing and approval', body: 'Editorial changes are made with the contributor’s agreement.' },
        { title: 'Publication', body: 'Content appears on the platform. Distribution to any external channel is a separate, explicit decision.', note: 'No AI agent on this platform can publish to a social channel.' },
      ]},
      { kind: 'facts', title: 'Brand and identity', rows: [
        ['Name', 'Egypt One'],
        ['Tagline', 'One Egypt. One Journey. One Platform.'],
        ['Mark', 'Circular gold ring with ankh, pyramids and Sphinx profile'],
        ['Palette', 'Deep midnight navy with Egyptian gold; Nile blue, turquoise, bronze and sandstone as secondary accents'],
        ['Typography', 'Plus Jakarta Sans (Latin), IBM Plex Sans Arabic (Arabic), Cormorant Garamond (display)'],
        ['Prototype notice', 'Any screenshot of this build should be captioned as a demonstration prototype.'],
      ]},
      { kind: 'prose', title: 'A note for journalists', paras: [
        'This is a working prototype. Every figure, listing, provider, opportunity and statistic in it is demonstration or synthetic data unless a source badge says otherwise. No government integration is connected, no commercial partnership exists with any named company, and the platform holds no licence, mandate or official endorsement.',
      ]},
    ],
    boundary: [
      'Egypt One does not claim government endorsement, and no material from this platform should imply one.',
      'Traveller content is published only with consent and after human review.',
      'Demonstration data must not be reported as an Egyptian tourism statistic.',
    ],
    related: [['/traveler-stories', 'Traveller stories', 'The published queue.'], ['/about', 'About', 'What the platform is.'], ['/admin/support', 'Moderation', 'How review works.'], ['/reviews', 'Reviews', 'Structured feedback.']],
  },
  {
    route: 'reviews',
    title: 'Reviews and visitor experience',
    eyebrow: 'Visitor voice',
    subject: 'city',
    lead: 'Structured feedback rather than a star rating: where the visitor came from, who they travelled with, what worked, what did not, and what they would change. That structure is what makes the data useful to a governorate as well as to the next traveller.',
    stats: `[
      { label: 'Feedback records', value: String(db.stories.all().length) },
      { label: 'Countries represented', value: String(new Set(db.stories.all().map((s: { country: string }) => s.country)).size) },
      { label: 'Moderated before publication', value: 'All' },
      { label: 'Incentivised reviews', value: 'None' },
    ]`,
    sections: [
      { kind: 'facts', title: 'What a review captures', rows: [
        ['Visitor country', 'To understand which markets experience what'],
        ['Group type', 'Solo, couple, family, group or business'],
        ['Destinations visited', 'Linked to the actual registry records'],
        ['Rating', 'Overall satisfaction'],
        ['Positives and negatives', 'Free text, structured separately so neither drowns the other'],
        ['Improvement suggestions', 'The field governorates and providers actually act on'],
        ['Media', 'Optional video, subject to moderation and consent'],
      ]},
      { kind: 'code', title: 'Recent feedback', expr: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>` },
    ],
    boundary: [
      'Reviews in this prototype are demonstration records, not real submissions.',
      'Egypt One does not pay for, incentivise or solicit positive reviews, and would not publish one that had been.',
      'Providers cannot remove a review; they can respond to it and can report one they believe is fraudulent.',
      'Aggregated sentiment reaches the government dashboards only as aggregates, never as identifiable individuals.',
    ],
    related: [['/traveler-stories', 'Traveller stories', 'Long-form and video.'], ['/government/analytics', 'Government analytics', 'Where aggregates go.'], ['/support', 'Support', 'Report a problem.'], ['/provider/analytics', 'Provider analytics', 'What providers see.']],
  },
  {
    route: 'health',
    title: 'Health and wellness',
    eyebrow: 'Health',
    subject: 'city',
    lead: 'The entry point to medical tourism, wellness journeys and the research boundary around ancestry — with the platform’s strictest data protections applied throughout.',
    stats: `[
      { label: 'Providers listed', value: String(db.providers.byType('MEDICAL').length) },
      { label: 'Data class', value: 'SENSITIVE' },
      { label: 'Consent required', value: 'Explicit' },
      { label: 'Clinical advice given', value: 'None' },
    ]`,
    sections: [
      { kind: 'cards', title: 'Three different things', cards: [
        { title: 'Medical tourism', body: 'Clinical treatment: hospitals, specialists, dental, vision, cosmetic, fertility and rehabilitation.', href: '/medical-tourism', cta: 'Open medical tourism' },
        { title: 'Wellness', body: 'Non-clinical: thermal and natural destinations, spa, preventive health and recovery travel.', href: '/wellness', cta: 'Open wellness' },
        { title: 'Know your origin', body: 'An educational and research concept about ancestry, with hard boundaries on what it will never do.', href: '/know-your-origin', cta: 'Read the boundaries' },
      ]},
      { kind: 'facts', title: 'How health data is treated', rows: [
        ['Classification', 'SENSITIVE — the platform’s highest protection short of restricted government data'],
        ['Access rule', 'Explicit consent plus a stated purpose, checked on every read'],
        ['Audit', 'Every access is recorded, whether it is allowed or refused'],
        ['Marketing use', 'Never. Health data is excluded from marketing, segmentation and affiliate use entirely.'],
        ['Government access', 'None. Government roles do not receive individual health data.'],
        ['AI access', 'The Medical Agent cannot store or transmit health data and cannot diagnose.'],
      ]},
    ],
    boundary: [
      'Egypt One does not diagnose, treat, recommend treatment or interpret results.',
      'Provider accreditation shown is a demonstration record until the accredited-network integration is connected.',
      'Referral fees are disabled by default and would require legal review anywhere they are permitted at all.',
    ],
    related: [['/medical-tourism', 'Medical tourism', 'Clinical providers.'], ['/wellness', 'Wellness', 'Non-clinical journeys.'], ['/know-your-origin', 'Know your origin', 'Research boundaries.'], ['/account/consent', 'Consent centre', 'Control your data.']],
  },
  {
    route: 'wellness',
    title: 'Wellness',
    eyebrow: 'Health',
    subject: 'oasis',
    lead: 'Thermal springs, desert retreats, coastal recovery, spa and preventive health — the non-clinical side of health travel, kept deliberately separate from medical treatment.',
    stats: `[
      { label: 'Wellness governorates', value: '6' },
      { label: 'Coastal recovery destinations', value: String(db.governorates.all().filter((g) => g.hasCoast).length) },
      { label: 'Clinical claims made', value: 'None' },
      { label: 'Data class', value: 'PERSONAL' },
    ]`,
    sections: [
      { kind: 'cards', title: 'Where wellness travel happens', cards: [
        { title: 'Siwa Oasis', body: 'Salt lakes, springs and desert quiet in Matrouh governorate.', href: '/governorates/matrouh', cta: 'Matrouh' },
        { title: 'The Western Desert oases', body: 'Kharga, Dakhla and Farafra — hot springs and long horizons.', href: '/governorates/new-valley', cta: 'New Valley' },
        { title: 'South Sinai', body: 'Coastal recovery, mountain walking and desert retreat.', href: '/governorates/south-sinai', cta: 'South Sinai' },
        { title: 'Red Sea coast', body: 'Sea-based recovery and low-season retreat.', href: '/governorates/red-sea', cta: 'Red Sea' },
      ]},
      { kind: 'prose', title: 'Where the line sits', paras: [
        'Wellness travel and medical travel are different products with different risk profiles, and the platform keeps them apart deliberately. A spa, a thermal spring or a retreat is a hospitality product. A procedure is a clinical one, with a different consent model, a different data class and a different set of things the platform is not allowed to say.',
        'Nothing in this module makes a therapeutic claim. Where a destination has a traditional reputation for a particular benefit, that is described as a tradition rather than as an outcome.',
      ]},
    ],
    boundary: [
      'No therapeutic or curative claim is made for any destination, spring, treatment or retreat.',
      'Wellness is not a substitute for medical care. If you have a condition, speak to a clinician.',
      'Accessibility at desert and thermal sites varies widely and is often not surveyed.',
    ],
    related: [['/medical-tourism', 'Medical tourism', 'Clinical treatment.'], ['/rural-egypt', 'Rural Egypt', 'Slow travel.'], ['/governorates/matrouh', 'Siwa', 'The oasis.'], ['/health', 'Health overview', 'The whole module.']],
  },
  {
    route: 'know-your-origin',
    title: 'Know your origin',
    eyebrow: 'Research concept',
    subject: 'museum',
    lead: 'An educational and research concept about Egyptian ancestry and the science behind it. This module deliberately does nothing else: it does not test, diagnose, estimate ethnicity or hold genetic data.',
    stats: `[
      { label: 'Tests offered', value: 'None' },
      { label: 'Genetic data stored', value: 'None' },
      { label: 'Ancestry claims made', value: 'None' },
      { label: 'Status', value: 'Informational only' },
    ]`,
    sections: [
      { kind: 'prose', title: 'What this is', paras: [
        'Egypt sits at a crossroads of human movement, and questions about ancestry, population history and the genetics of ancient populations are genuinely interesting scientific ground. There is active research on ancient DNA from Egyptian contexts, on modern Egyptian population genetics, and on what can and cannot be inferred from either.',
        'This module exists to explain that landscape honestly, to point towards the institutions doing the work, and to be explicit about the boundary between an interesting research question and a consumer product. It is not a service, and in this prototype it is a set of informational workflows only.',
      ]},
      { kind: 'cards', title: 'What the platform will never do here', cards: [
        { title: 'Never diagnose ethnicity', body: 'Genetic ancestry inference is probabilistic, reference-panel dependent and routinely over-interpreted. This platform will not present it as identity.' },
        { title: 'Never claim ancestry without evidence', body: 'No result, and no assertion about anyone’s descent from any ancient population.' },
        { title: 'Never make a medical conclusion', body: 'Genetic data can carry health implications. Interpreting them is clinical work, not a platform feature.' },
        { title: 'Never expose genetic data', body: 'No genetic data is collected, stored, transmitted, shared or used for marketing. The consent scope exists precisely so that it stays switched off.' },
      ]},
      { kind: 'steps', title: 'What a real service would require first', steps: [
        { title: 'Explicit, specific, revocable consent', body: 'Separate from every other consent on the platform, with a plain explanation of what is inferred and what is not.' },
        { title: 'Authorised providers only', body: 'Accredited laboratories and named research institutions operating under Egyptian law.' },
        { title: 'Full legal review', body: 'Genetic data is regulated differently across jurisdictions, and travellers cross them by definition.' },
        { title: 'Strict data governance', body: 'Separate storage, hard access controls, an audit trail on every read, defined retention and real deletion.' },
        { title: 'Honest communication of uncertainty', body: 'Any result presented with its confidence intervals and its limits, not as a headline percentage.', note: 'Until every one of these is in place, this module stays informational.' },
      ]},
      { kind: 'cards', title: 'Where to look instead', cards: [
        { title: 'Research programmes', body: 'Bioarchaeology, archaeometry and population studies at Egyptian universities.', href: '/research', cta: 'Research portal' },
        { title: 'Museums and collections', body: 'Where the material record of these populations is held.', href: '/museums', cta: 'Museums' },
        { title: 'Heritage registry', body: 'The sites the evidence comes from.', href: '/heritage', cta: 'Registry' },
        { title: 'Your consent settings', body: 'The genetic-research consent scope, and why it is off.', href: '/account/consent', cta: 'Consent centre' },
      ]},
    ],
    boundary: [
      'This module offers no test, no result and no ancestry estimate.',
      'No genetic data is collected or stored by this platform.',
      'Popular ancestry percentages are model outputs, not facts about a person’s identity or descent.',
      'Any future service would require explicit consent, authorised providers, legal review and strict genetic-data governance.',
    ],
    related: [['/research', 'Research', 'The real science.'], ['/health', 'Health', 'The wider module.'], ['/account/consent', 'Consent centre', 'Scope controls.'], ['/about', 'About', 'Platform boundaries.']],
  },
  {
    route: 'invest',
    title: 'Invest in Egypt',
    eyebrow: 'Investor portal',
    subject: 'modern',
    lead: 'A working investor experience: filter opportunities by sector, governorate, stage and ticket size; compare regions on labelled indicators; and understand exactly who decides what — because it is never this platform.',
    stats: `[
      { label: 'Opportunities', value: String(db.investment.all().length) },
      { label: 'Sectors', value: String(db.investment.sectors().length) },
      { label: 'Governorates covered', value: '27' },
      { label: 'Returns guaranteed', value: 'None' },
    ]`,
    sections: [
      { kind: 'cards', title: 'Investment categories', sub: 'Each category is a full experience with its own opportunity pool.', cards: [
        { title: 'Tourism and hospitality', body: 'Hotels, resorts, boutique properties and destination development.', href: '/tourism-investment', cta: 'Open' },
        { title: 'Entertainment', body: 'Theme parks, water parks, marinas, arenas, sports and leisure districts.', href: '/entertainment-investment', cta: 'Open' },
        { title: 'Real estate', body: 'Residential, commercial, hospitality assets and land.', href: '/real-estate', cta: 'Open' },
        { title: 'New cities', body: 'The New Administrative Capital, New Alamein and the wider programme.', href: '/new-cities', cta: 'Open' },
        { title: 'Rural and agriculture', body: 'Rural development, agri-processing and land reclamation.', href: '/rural-egypt', cta: 'Open' },
        { title: 'Corporate and MICE', body: 'Conference infrastructure, business travel and incentive capacity.', href: '/corporate-mice', cta: 'Open' },
      ]},
      { kind: 'code', title: 'How the investment analysis works', expr: `<div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <h3 className="text-[14px] font-semibold text-ink-hi">Example: "USD 5 million, boutique hotel"</h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-low">
            The Investment Agent reads tourism demand indicators, existing hotel supply, governorate profiles, the opportunity
            registry, land requirements and seasonality, then returns recommended areas, candidate opportunities, demand
            signals, risks and next steps — each labelled with where it came from.
          </p>
          <ul className="mt-3 grid gap-1.5 text-[12px] text-ink-mid">
            <li>· Official data — from a connected authority. None connected yet.</li>
            <li>· Partner data — from a provider or partner system.</li>
            <li>· AI analysis — the agent's own reasoning, labelled as such.</li>
          </ul>
          <Link href={L(locale as Locale, '/ai')} className="mt-4 inline-flex rounded-lg border border-gold-600/40 px-3.5 py-2 text-[12.5px] font-medium text-gold-300 hover:bg-gold-600/12">Ask the Concierge →</Link>
        </div>
        <div className="surface p-5">
          <h3 className="text-[14px] font-semibold text-ink-hi">Top governorates by demo indicator</h3>
          <div className="mt-3">
            <BarStrip rows={db.governorates.all().slice().sort((a, b) => b.metrics.occupancyPct - a.metrics.occupancyPct).slice(0, 7).map((g) => ({ label: g.name, value: g.metrics.occupancyPct }))} unit="%" max={100} />
          </div>
          <p className="mt-3 text-[11.5px] text-ink-faint">Synthetic demonstration values. Not an official statistic and not a basis for a decision.</p>
        </div>
      </div>` },
      { kind: 'steps', title: 'From interest to application', steps: [
        { title: 'Explore the registry', body: 'Filter by sector, governorate, stage and ticket size. Every entry names its competent entity.' },
        { title: 'Compare locations', body: 'Use the labelled indicators, then commission your own study. This analysis is not one.' },
        { title: 'Request the official pack', body: 'Feasibility studies, land terms and incentive schedules come from the competent entity, not from here.' },
        { title: 'Establish the entity', body: 'The business setup navigator sequences the authorities, licences and documents.' },
        { title: 'Apply through the official channel', body: 'Egypt One routes you there. It does not submit, endorse or expedite an application.', note: 'The platform has no influence on any approval decision.' },
      ]},
    ],
    boundary: [
      'Egypt One does not allocate land, grant licences, approve projects or guarantee any return.',
      'It does not provide regulated financial or legal advice.',
      'Demand indicators are synthetic demonstration values, not official statistics.',
      'Investment lead handling is contractual, and government fees never carry a platform commission.',
    ],
    related: [['/investment-opportunities', 'Opportunity registry', 'Browse everything.'], ['/business-setup', 'Business setup', 'Establish the entity.'], ['/real-estate', 'Real estate', 'Property assets.'], ['/government/investment', 'Government view', 'The lead pipeline.']],
  },
  {
    route: 'tourism-investment',
    title: 'Tourism investment',
    eyebrow: 'Invest',
    subject: 'modern',
    lead: 'Hotels, resorts, boutique properties, destination development and the supply gaps that show up when demand is mapped against existing capacity across the 27 governorates.',
    stats: `[
      { label: 'Tourism opportunities', value: String(db.investment.all().filter((o) => /tourism|hotel|resort/i.test(o.sector)).length) },
      { label: 'Governorates', value: '27' },
      { label: 'Hotels recorded', value: String(db.providers.byType('HOTEL').length) },
      { label: 'Official statistics used', value: 'None yet' },
    ]`,
    sections: [
      { kind: 'code', title: 'Where supply is tightest (demo indicators)', expr: `<div className="surface p-5">
        <BarStrip rows={db.governorates.all().slice().sort((a, b) => b.metrics.occupancyPct - a.metrics.occupancyPct).slice(0, 10).map((g) => ({ label: g.name + ' (' + g.metrics.hotels + ' hotels)', value: g.metrics.occupancyPct }))} unit="%" max={100} />
        <p className="mt-3 text-[11.5px] text-ink-faint">High occupancy against low room count is the crude signal for a supply gap. These are synthetic values; a real decision needs official statistics and a commissioned study.</p>
      </div>` },
      { kind: 'cards', title: 'Sub-sectors', cards: [
        { title: 'Boutique and heritage hospitality', body: 'Small-format properties in Upper Egypt, the oases and historic quarters.' },
        { title: 'Resort development', body: 'Coastal capacity on the Red Sea, South Sinai and the Mediterranean.' },
        { title: 'Serviced and hotel apartments', body: 'Longer-stay formats for business, medical and academic travel.' },
        { title: 'Eco-lodges and desert camps', body: 'Low-density formats in protected and desert landscapes.' },
        { title: 'Nile vessels', body: 'Cruise and dahabiya capacity between Luxor and Aswan.' },
        { title: 'Destination management', body: 'Operators, transport and experience supply, not just beds.' },
      ]},
    ],
    boundary: [
      'Occupancy and visitor figures are synthetic demonstration values.',
      'Tourism development on or near a heritage site is subject to the competent authority’s rules, and this platform has no influence over them.',
      'Nothing here is an offer, an allocation or an approval.',
    ],
    related: [['/invest', 'Investor portal', 'The whole module.'], ['/investment-opportunities', 'Registry', 'Browse opportunities.'], ['/hotels', 'Hotels', 'Existing supply.'], ['/governorates', 'Governorates', 'Where demand is.']],
  },
  {
    route: 'entertainment-investment',
    title: 'Entertainment investment',
    eyebrow: 'Invest',
    subject: 'modern',
    lead: 'Theme parks, water parks, family entertainment centres, sports complexes, marinas, arenas, live entertainment, cultural venues, festivals, immersive experiences and leisure districts — treated as a major category rather than a footnote under tourism.',
    stats: `[
      { label: 'Entertainment opportunities', value: String(db.investment.all().filter((o) => /entertainment|theme|water|marina|sport|event/i.test(o.sector)).length) },
      { label: 'Governorates', value: '27' },
      { label: 'Event records', value: String(db.events.all().length) },
      { label: 'Guaranteed footfall', value: 'None' },
    ]`,
    sections: [
      { kind: 'cards', title: 'Categories', cards: [
        { title: 'Theme and water parks', body: 'Large-format attractions serving both domestic and international demand.' },
        { title: 'Family entertainment centres', body: 'Urban, mall-adjacent and year-round formats.' },
        { title: 'Sports complexes', body: 'Training, competition and community facilities.' },
        { title: 'Marinas', body: 'Berthing, service yards and waterfront leisure.' },
        { title: 'Arenas and live entertainment', body: 'Concert, conference and mixed-use venues.' },
        { title: 'Cultural venues and festivals', body: 'Programming infrastructure as well as buildings.' },
        { title: 'Immersive experiences', body: 'Projection, XR and interpretive attractions at heritage-adjacent sites.' },
        { title: 'Leisure districts', body: 'Mixed-use waterfront and urban regeneration schemes.' },
      ]},
      { kind: 'prose', title: 'Why this is its own category', paras: [
        'Entertainment infrastructure has a different demand curve from heritage tourism. It draws heavily on the domestic market, it is far less seasonal, it monetises differently and it operates year-round. A country with very strong heritage tourism can still be thin on entertainment capacity, and the two require quite different investment cases.',
        'Treating it as a first-class category means the opportunity registry, the demand indicators and the governorate comparisons all work for an operator whose question is footfall and dwell time rather than temple proximity.',
      ]},
      { kind: 'code', title: 'Entertainment opportunities in the registry', expr: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.investment.all().filter((o) => /entertainment|theme|water|marina|sport|event/i.test(o.sector)).slice(0, 9).map((o) => (
          <Link key={o.slug} href={L(locale as Locale, '/investment-opportunities/' + o.slug)} className="surface lift p-4">
            <Badge tone="nile">{o.stage}</Badge>
            <div className="mt-2.5 text-[13.5px] font-semibold text-ink-hi">{o.name}</div>
            <div className="mt-1.5 text-[11.5px] text-ink-faint">USD {(o.investmentRangeUsd[0] / 1e6).toFixed(0)}–{(o.investmentRangeUsd[1] / 1e6).toFixed(0)}M</div>
            <div className="mt-3"><SourceBadge status={o.sourceStatus} size="sm" /></div>
          </Link>
        ))}
      </div>` },
    ],
    boundary: [
      'Footfall, spend and dwell-time indicators here are synthetic demonstration values.',
      'Venue licensing, safety certification and public-event permissions are matters for the competent authority.',
      'Nothing here is an offer, an allocation or a guaranteed return.',
    ],
    related: [['/invest', 'Investor portal', 'The whole module.'], ['/events', 'Events', 'Existing programming.'], ['/new-cities', 'New cities', 'Where new capacity is going.'], ['/corporate-mice', 'Corporate & MICE', 'Business venues.']],
  },
  {
    route: 'new-cities',
    title: 'New cities',
    eyebrow: 'Invest',
    subject: 'modern',
    lead: 'The New Administrative Capital, New Alamein, Sadat City, 10th of Ramadan and the wider new-communities programme — where new residential, commercial and hospitality supply is actually being built.',
    stats: `[
      { label: 'New-city destinations', value: String(db.destinations.all().filter((d) => d.category === 'modern').length) },
      { label: 'Property records', value: String(db.properties.all().length) },
      { label: 'Opportunities', value: String(db.investment.all().filter((o) => /new cities|real estate|commercial|residential/i.test(o.sector)).length) },
      { label: 'Allocation decisions here', value: 'None' },
    ]`,
    sections: [
      { kind: 'cards', title: 'The programme', cards: [
        { title: 'New Administrative Capital', body: 'Government district, business district and large-scale residential east of Cairo.', href: '/governorates/cairo', cta: 'Cairo' },
        { title: 'New Alamein City', body: 'Mediterranean coastal city in Matrouh governorate.', href: '/governorates/matrouh', cta: 'Matrouh' },
        { title: 'Sadat City', body: 'Industrial and residential development in Monufia.', href: '/governorates/monufia', cta: 'Monufia' },
        { title: '10th of Ramadan', body: 'Established industrial city in Sharqia.', href: '/governorates/sharqia', cta: 'Sharqia' },
      ]},
      { kind: 'prose', title: 'What a new city changes for an investor', paras: [
        'New-community development shifts where land is available, who allocates it, what infrastructure exists on day one, and which authority you are dealing with. That is a materially different process from acquiring in an established urban area, and the answers come from the New Urban Communities Authority rather than from a governorate.',
        'This module records which opportunities sit in new-community areas so the right authority is named from the start.',
      ]},
    ],
    boundary: [
      'Land allocation in new communities is decided by the competent authority. Egypt One has no role in it.',
      'Delivery timelines, infrastructure readiness and phasing are not published by this platform.',
      'Property records here are demonstration listings, not offers.',
    ],
    related: [['/real-estate', 'Real estate', 'Property listings.'], ['/invest', 'Investor portal', 'The whole module.'], ['/business-setup', 'Business setup', 'The entity.'], ['/investment-opportunities', 'Registry', 'Opportunities.']],
  },
  {
    route: 'rural-egypt',
    title: 'Rural Egypt',
    eyebrow: 'Discover & invest',
    subject: 'rural',
    lead: 'Village life, farms, handicrafts, agri-tourism and the rural development opportunities behind them — the parts of the country that most itineraries and most investment decks skip entirely.',
    stats: `[
      { label: 'Governorates with rural focus', value: String(db.governorates.all().filter((g) => g.investmentSectors.some((s) => /agri|rural/i.test(s))).length) },
      { label: 'Craft traditions recorded', value: String(new Set(db.governorates.all().flatMap((g) => g.crafts)).size) },
      { label: 'Rural opportunities', value: String(db.investment.all().filter((o) => /rural|agri/i.test(o.sector)).length) },
      { label: 'Product entries', value: String(db.products.all().length) },
    ]`,
    sections: [
      { kind: 'prose', title: 'Two things at once', paras: [
        'Rural Egypt is a travel proposition and a development question in the same breath. A village that can host visitors well is a village with better roads, better water, a market for its crafts and a reason for young people to stay. Treating rural tourism purely as a product misses the point; treating it purely as development misses the demand.',
        'This module keeps both views on one page: where to go and what it is like, alongside what the investment and development picture actually looks like there.',
      ]},
      { kind: 'code', title: 'Craft traditions by governorate', expr: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.governorates.all().filter((g) => g.crafts.length).slice(0, 12).map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift p-4">
            <div className="text-[13px] font-semibold text-ink-hi">{g.name}</div>
            <div className="mt-1 text-[11px] text-ink-faint">{g.region}</div>
            <div className="mt-2.5"><ChipList items={g.crafts} /></div>
          </Link>
        ))}
      </div>` },
      { kind: 'cards', title: 'What rural travel looks like here', cards: [
        { title: 'Village stays', body: 'Small-scale accommodation run by the community rather than around it.', href: '/accommodation', cta: 'Accommodation' },
        { title: 'Craft workshops', body: 'Weaving, pottery, embroidery and metalwork with the people who make it.', href: '/wear-egypt', cta: 'Collections' },
        { title: 'Farm and food', body: 'Agriculture, harvest seasons and regional cuisine.', href: '/restaurants', cta: 'Food' },
        { title: 'Nature and wetlands', body: 'Delta lakes, birdwatching and desert edges.', href: '/heritage', cta: 'Registry' },
      ]},
    ],
    boundary: [
      'Community tourism only works with community consent. Nothing here should be read as an open invitation into private village life.',
      'Rural infrastructure and accessibility vary enormously and are frequently not surveyed.',
      'Development opportunity records are demonstration data; the competent entity decides everything real.',
    ],
    related: [['/governorates', 'Governorates', 'Where the villages are.'], ['/wear-egypt', 'Wear Egypt', 'What they make.'], ['/invest', 'Investor portal', 'The development side.'], ['/traveler-stories', 'Stories', 'What visitors found.']],
  },
  {
    route: 'business-setup',
    title: 'Business setup navigator',
    eyebrow: 'Do business',
    subject: 'city',
    lead: 'A navigator, not an application portal: choose an activity and a location, see the legal structures available, which authorities are involved, what licences and documents are required, and where the official application actually happens.',
    stats: `[
      { label: 'Authorities mapped', value: '8' },
      { label: 'Government integrations connected', value: '0' },
      { label: 'Licences issued here', value: 'None' },
      { label: 'Applications submitted here', value: 'None' },
    ]`,
    sections: [
      { kind: 'steps', title: 'The navigation path', steps: [
        { title: 'Choose the activity', body: 'What the business will actually do determines almost everything downstream — the authority, the licence class and the evidence required.' },
        { title: 'Choose the location', body: 'A governorate, an industrial zone, a free zone or a new community. Each has a different responsible body.' },
        { title: 'Choose the legal structure', body: 'The structure affects capital requirements, foreign ownership rules, tax treatment and which registrations apply.' },
        { title: 'See the required authorities', body: 'The navigator names each body involved and what it is responsible for.' },
        { title: 'See the required licences', body: 'Activity licences, premises approvals and sector-specific permissions.' },
        { title: 'Assemble the documents', body: 'A checklist derived from the activity, structure and location.' },
        { title: 'Apply through the official channel', body: 'The navigator links out. It does not submit, endorse or expedite anything.', note: 'Where an integration exists, application status can be shown read-only. None is connected today.' },
      ]},
      { kind: 'facts', title: 'Bodies commonly involved', rows: [
        ['Investment and free zones', 'Company establishment, incentives and free-zone regimes'],
        ['Commercial registry', 'Registration of the entity'],
        ['Tax authority', 'Registration and ongoing obligations'],
        ['Governorate or local authority', 'Premises, signage and local permissions'],
        ['Sector regulator', 'Tourism, health, education, transport and others each have their own'],
        ['New Urban Communities Authority', 'Where the location is a new community'],
        ['Suez Canal Economic Zone', 'Where the location falls inside the zone'],
        ['Social insurance and labour', 'Employment obligations'],
      ]},
      { kind: 'prose', title: 'What "navigator" means precisely', paras: [
        'Egypt One is an integration and experience layer. It can sequence a process, explain what each step is for, hold your documents in your own account and link you to the right official channel. It cannot issue a licence, approve a registration, influence a decision or shorten a queue — and any platform that claims otherwise should be treated with suspicion.',
      ]},
    ],
    boundary: [
      'Egypt One does not issue licences, approve registrations or submit applications.',
      'This is not legal advice. Take Egyptian legal and tax advice before establishing an entity.',
      'Requirements change and vary by activity, structure and location. Verify with the competent authority.',
      'No government integration is connected in this prototype, so no procedure shown here is authoritative.',
    ],
    related: [['/invest', 'Investor portal', 'Find the opportunity first.'], ['/corporate-mice', 'Corporate & MICE', 'Business travel.'], ['/real-estate', 'Real estate', 'Premises.'], ['/partner', 'Partner portal', 'Integrating with us.']],
  },
  {
    route: 'corporate-mice',
    title: 'Corporate and MICE',
    eyebrow: 'Business travel',
    subject: 'modern',
    lead: 'Meetings, incentives, conferences and exhibitions — venue capacity, business travel coordination, delegate logistics and the incentive programmes that make Egypt competitive for them.',
    stats: `[
      { label: 'MICE events recorded', value: String(db.events.all().filter((e) => /MICE|Conference|Business/i.test(e.category)).length) },
      { label: 'Business governorates', value: String(db.governorates.all().filter((g) => g.investmentSectors.some((s) => /MICE|Business|Corporate/i.test(s))).length) },
      { label: 'Venue opportunities', value: String(db.investment.all().filter((o) => /MICE|Events|Commercial/i.test(o.sector)).length) },
      { label: 'Live delegate booking', value: 'None' },
    ]`,
    sections: [
      { kind: 'cards', title: 'What a MICE programme needs', cards: [
        { title: 'Venue capacity', body: 'Convention centres, hotel conference floors and exhibition space.', href: '/investment-opportunities', cta: 'Venue opportunities' },
        { title: 'Room block', body: 'Accommodation at scale, close to the venue.', href: '/hotels', cta: 'Accommodation' },
        { title: 'Delegate transport', body: 'Airport transfers, shuttles and executive travel.', href: '/vip-transport', cta: 'VIP transport' },
        { title: 'Incentive programme', body: 'The Egypt part of the trip — the reason to hold it here at all.', href: '/activities', cta: 'Experiences' },
        { title: 'Multilingual support', body: 'Guides and interpreters across the delegate languages.', href: '/guides', cta: 'Guides' },
        { title: 'Entry coordination', body: 'Delegate entry requirements handled early, not at the airport.', href: '/visa', cta: 'Visa & entry' },
      ]},
      { kind: 'prose', title: 'The pitch and the constraint', paras: [
        'Egypt has an unusually strong incentive proposition: a conference delegate can stand inside a three-thousand-year-old temple in the same trip as a plenary session. The constraint is rarely the attraction — it is venue capacity, room blocks at scale in the right place, and predictable delegate logistics.',
        'That is why this module sits across both the travel side and the investment side: the same page that helps an organiser plan a programme also shows where the capacity gaps are for anyone thinking of building the venue.',
      ]},
    ],
    boundary: [
      'Venue capacities and event data are demonstration records.',
      'Delegate entry requirements are decided by the competent authority; group applications are not expedited by this platform.',
      'No booking, room block or venue hold is possible in this prototype.',
    ],
    related: [['/events', 'Events', 'The calendar.'], ['/entertainment-investment', 'Entertainment investment', 'Venue development.'], ['/vip-transport', 'VIP transport', 'Delegate logistics.'], ['/business-setup', 'Business setup', 'If you are establishing here.']],
  },
  {
    route: 'my-itinerary',
    title: 'My itinerary',
    eyebrow: 'Your trip',
    subject: 'nile',
    lead: 'The working copy of your trip: day by day, with the attractions, stays, transport, guides and meals in place, and an honest booking state next to each one.',
    stats: `[
      { label: 'Trips in this demo', value: '1' },
      { label: 'Booking adapters live', value: '0' },
      { label: 'Confirmed bookings', value: '0' },
      { label: 'Editable', value: 'Every item' },
    ]`,
    sections: [
      { kind: 'code', title: 'Example itinerary', expr: `<ItineraryPreview locale={locale as Locale} />` },
      { kind: 'facts', title: 'Booking states you will see', rows: [
        ['Draft', 'Planned on the platform. Nothing has been requested from a provider.'],
        ['Pending', 'Requested through a connected adapter and awaiting the provider.'],
        ['Confirmed', 'The provider has confirmed. Requires a live adapter — none in this prototype.'],
        ['Cancelled', 'Cancelled by you or the provider, under the provider’s terms.'],
        ['Refunded', 'Settled back through the licensed payment provider.'],
      ]},
    ],
    boundary: [
      'Every item in this prototype is a draft. Nothing is booked, held, priced or confirmed.',
      'Opening hours and timing suggestions are editorial, not authoritative.',
      'Your itinerary is personal data and is never shared with a government role.',
    ],
    related: [['/trip-builder', 'Trip builder', 'Change the brief.'], ['/account/trips', 'My trips', 'All your trips.'], ['/account/bookings', 'Bookings', 'Booking records.'], ['/guides', 'Guides', 'Add a guide.']],
    extraImports: `import { ItineraryPreview } from '@/components/ItineraryPreview';`,
  },
  {
    route: 'map',
    title: 'National map',
    eyebrow: 'Geography',
    subject: 'desert',
    lead: 'All 27 governorates on one canvas, with layers for heritage, providers, events and investment. The map renders from local vector data because no map vendor is connected — a deliberate choice over an empty frame or a vendor lock-in.',
    stats: `[
      { label: 'Governorates plotted', value: '27' },
      { label: 'Heritage points', value: String(db.heritage.all().filter((h) => h.coordinates).length) },
      { label: 'Map vendor', value: 'None selected' },
      { label: 'Adapter', value: 'MapProviderAdapter' },
    ]`,
    sections: [
      { kind: 'code', title: 'Egypt at a glance', expr: `<EgyptMap locale={locale as Locale} />` },
      { kind: 'prose', title: 'Why there is no vendor here', paras: [
        'Mapping is one of the easiest places to create a dependency that is painful to unwind later. The platform declares a MapProviderAdapter contract with geocoding and tile methods, and every map surface in the product talks to that contract rather than to a vendor SDK. Mapbox, Google or a self-hosted OpenStreetMap stack can all satisfy it.',
        'Until one is chosen, the map draws from local coordinates. It is deliberately schematic rather than pretending to be a survey-grade basemap.',
      ]},
    ],
    boundary: [
      'This canvas is schematic. It is not a survey, and boundaries shown are indicative only.',
      'Coordinates for vulnerable heritage sites are deliberately approximate.',
      'No location data about you is read or stored by this page.',
    ],
    related: [['/governorates', 'Governorates', 'The list view.'], ['/heritage', 'Heritage', 'Registry.'], ['/government/national-map', 'Government map', 'The operations view.'], ['/discover', 'Discover', 'Everything else.']],
    extraImports: `import { EgyptMap } from '@/components/EgyptMap';`,
  },
  {
    route: 'search',
    title: 'Search',
    eyebrow: 'Find anything',
    subject: 'city',
    lead: 'One index across governorates, cities, destinations, heritage, museums, rulers, hotels, guides, restaurants, activities, events, investment, research, medical and products — the same index the AI Concierge queries.',
    stats: `[
      { label: 'Indexed entities', value: '13 types' },
      { label: 'Records', value: String(db.governorates.all().length + db.destinations.all().length + db.heritage.all().length + db.museums.all().length + db.providers.all().length + db.investment.all().length + db.products.all().length + db.countries.all().length) },
      { label: 'Semantic search', value: 'Architecture ready' },
      { label: 'Index backend', value: 'In-memory (demo)' },
    ]`,
    sections: [
      { kind: 'code', title: '', expr: `<SearchSurface locale={locale as Locale} />` },
    ],
    boundary: [
      'Search runs against demonstration content. Results carry the source status of the record behind them.',
      'In production this abstraction is backed by an OpenSearch-compatible index; in the prototype it is in memory.',
    ],
    related: [['/discover', 'Discover', 'Browse instead.'], ['/map', 'Map', 'Search by place.'], ['/ai', 'AI Concierge', 'Ask a question.'], ['/governorates', 'Governorates', 'Start with a region.']],
    extraImports: `import { SearchSurface } from '@/components/SearchSurface';`,
  },
  {
    route: 'trip-builder',
    title: 'Smart trip builder',
    eyebrow: 'Plan',
    subject: 'temple',
    lead: 'A multi-step brief — nationality, dates, party, budget, style, languages, accessibility and interests — that the Trip Planner Agent turns into a routed, editable, day-by-day itinerary.',
    stats: `[
      { label: 'Steps', value: '5' },
      { label: 'Interest categories', value: '19' },
      { label: 'Governorates routable', value: '27' },
      { label: 'Bookings created', value: 'Draft only' },
    ]`,
    sections: [
      { kind: 'code', title: '', expr: `<TripBuilder locale={locale as Locale} />` },
    ],
    boundary: [
      'The itinerary is a plan, not a booking. Nothing is held, priced or confirmed.',
      'Timings are editorial estimates. Opening hours come from the site authority.',
      'Accessibility needs are used to weight the plan, but accessibility at many sites has not been surveyed and the plan says so rather than assuming.',
      'Your brief is personal data. It is never shared with a government role and never used for marketing without consent.',
    ],
    related: [['/my-itinerary', 'My itinerary', 'The working copy.'], ['/guides', 'Guides', 'Add a guide.'], ['/hotels', 'Hotels', 'Add a stay.'], ['/ai', 'AI Concierge', 'Ask instead of filling a form.']],
    extraImports: `import { TripBuilder } from '@/components/TripBuilder';`,
  },
  {
    route: 'ai',
    title: 'Egypt One AI Concierge',
    eyebrow: 'One assistant',
    subject: 'modern',
    lead: 'One conversational interface for everything on the platform. Behind it, fifteen specialised agents each with a defined purpose and a hard permission boundary — and you never have to know which one answered.',
    stats: `[
      { label: 'Agents', value: '16' },
      { label: 'MCP tools declared', value: '30' },
      { label: 'Skills', value: '14' },
      { label: 'Unlabelled answers', value: 'None' },
    ]`,
    sections: [
      { kind: 'code', title: '', expr: `<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ConciergePanel locale={locale as Locale} messages={messages} variant="page" />
        <div className="grid content-start gap-4">
          <InfoCard title="How routing works">
            <p>The Concierge detects intent, decomposes the request, checks whether your role and consents permit the specialist it wants, then composes one answer with source labels attached.</p>
            <p className="mt-3">Routing is deterministic and inspectable rather than buried in a prompt, so what the platform decided and what the model decided stay separable — and both end up in the audit log.</p>
          </InfoCard>
          <InfoCard title="The source rule">
            <p>Any answer touching laws, visas, permits, licences, ticket availability, live pricing, opening hours, medical claims, investment guarantees or government decisions must carry a source label. If no tool returned a labelled record, the answer is downgraded and says so.</p>
          </InfoCard>
          <InfoCard title="What it will not do">
            <ul className="grid gap-1.5">
              <li>· Present demo data as an official answer</li>
              <li>· Invent a price, an opening time or an availability</li>
              <li>· Describe anyone as licensed without a verification record</li>
              <li>· Diagnose, or interpret a medical result</li>
              <li>· Guarantee an investment return</li>
              <li>· Publish anything without human approval</li>
              <li>· Read your location without consent</li>
            </ul>
          </InfoCard>
        </div>
      </div>` },
      { kind: 'code', title: 'The agent graph', expr: `<AgentGraph />` },
    ],
    boundary: [
      'The Concierge answers from demonstration data in this prototype and labels every answer accordingly.',
      'It cannot override a government decision, modify restricted data or act outside the caller’s permissions.',
      'Conversations are stored against your account; sensitive tool calls are audited.',
    ],
    related: [['/admin/ai', 'Agent registry', 'Every agent and boundary.'], ['/trip-builder', 'Trip builder', 'The form version.'], ['/about', 'About', 'Platform boundaries.'], ['/search', 'Search', 'Look it up directly.']],
    extraImports: `import { ConciergePanel } from '@/components/Concierge';\nimport { AgentGraph } from '@/components/AgentGraph';\nimport { getMessages } from '@egypt-one/i18n';`,
    extraSetup: `const messages = getMessages(locale as Locale);`,
  },
];

const renderSection = (s) => {
  switch (s.kind) {
    case 'prose':
      return `<InfoCard title={${JSON.stringify(s.title)}}>
        ${s.paras.map((p, i) => `<p${i ? ' className="mt-3"' : ''}>${p.replace(/'/g, '&rsquo;').replace(/"/g, '&quot;')}</p>`).join('\n        ')}
      </InfoCard>`;
    case 'steps':
      return `<section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">${s.title}</h2>
        <StepList steps={${JSON.stringify(s.steps)}} />
      </section>`;
    case 'facts':
      return `<InfoCard title={${JSON.stringify(s.title)}}>
        <FactList rows={${JSON.stringify(s.rows)}} />
      </InfoCard>`;
    case 'chips':
      return `<InfoCard title={${JSON.stringify(s.title)}}>
        <ChipList items={${JSON.stringify(s.items)}} tone={${JSON.stringify(s.tone ?? 'neutral')}} />
      </InfoCard>`;
    case 'cards':
      return `<section>
        <SectionHeader title={${JSON.stringify(s.title)}}${s.sub ? ` sub={${JSON.stringify(s.sub)}}` : ''} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(${JSON.stringify(s.cards)} as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
      </section>`;
    case 'code':
      return s.title
        ? `<section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">${s.title}</h2>
        ${s.expr}
      </section>`
        : `<section>${s.expr}</section>`;
    default:
      return '';
  }
};

const tpl = (p) => `import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';
${p.extraImports ?? ''}

export const metadata: Metadata = {
  title: ${JSON.stringify(p.title)},
  description: ${JSON.stringify(p.lead.slice(0, 180))},
};

export default async function ${pascal(p.route)}Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  ${p.extraSetup ?? ''}

  return (
    <Page wide>
      <ModuleHero
        eyebrow={${JSON.stringify(p.eyebrow)}}
        title={${JSON.stringify(p.title)}}
        lead={${JSON.stringify(p.lead)}}
        seed={${JSON.stringify(p.route)}}
        subject={${JSON.stringify(p.subject)}}
        stats={${p.stats}}
      />

      <div className="grid gap-8">
        ${p.sections.map(renderSection).join('\n        ')}

        <Boundary points={${JSON.stringify(p.boundary)}} />

        <RelatedLinks
          locale={locale as Locale}
          links={${JSON.stringify(p.related.map(([href, label, body]) => ({ href, label, body })))}}
        />
      </div>
    </Page>
  );
}
`;

let n = 0;
for (const p of PAGES) {
  const dir = join(root, p.route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'page.tsx'), tpl(p));
  n++;
}
console.log(`wrote ${n} editorial routes`);
