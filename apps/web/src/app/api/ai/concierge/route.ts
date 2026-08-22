import { NextResponse } from 'next/server';
import { route, composeGuard, SOURCE_LABEL_TEXT } from '@egypt-one/agents';
import {
  planEgyptTrip, findGuide, explainHeritageSite, discoverInvestment,
  generateTourismInsight, searchEverything, quotePayment, findAccommodation,
} from '@egypt-one/skills';
import { db } from '@egypt-one/database';
import { audit } from '@egypt-one/security';
import type { Role } from '@egypt-one/types';

export const runtime = 'nodejs';

type Card = { kind: string; title: string; body?: string; href?: string; cta?: string; rows?: { label: string; value: string }[] };
type Citation = { label: string; sourceStatus: string; owner?: string };

/** Demo principal. A real deployment resolves this from the session. */
function principal() {
  return {
    userId: 'demo-traveller',
    roles: ['TOURIST'] as Role[],
    consents: [] as string[],
    purpose: 'traveller assistance',
  };
}

const num = (s: string) => {
  const m = s.match(/(\d[\d,.]*)\s*(m|million|k|thousand)?/i);
  if (!m) return undefined;
  const base = Number(m[1].replace(/,/g, ''));
  const unit = (m[2] ?? '').toLowerCase();
  if (unit.startsWith('m')) return base * 1_000_000;
  if (unit.startsWith('k') || unit.startsWith('t')) return base * 1_000;
  return base;
};

const INTEREST_WORDS: [RegExp, string][] = [
  [/histor|ancient|pharaoh|temple|pyramid/i, 'Ancient Egypt'],
  [/beach|sea|coast|resort/i, 'Beach'],
  [/nile|cruise|felucca/i, 'Nile'],
  [/food|cuisine|eat/i, 'Food'],
  [/luxur|five.?star/i, 'Luxury'],
  [/adventure|safari|desert/i, 'Adventure'],
  [/div|snorkel|reef/i, 'Diving'],
  [/famil|children|kids/i, 'Family'],
  [/rural|village|farm/i, 'Rural Egypt'],
  [/wellness|spa/i, 'Wellness'],
  [/photo/i, 'Photography'],
  [/business|conference|mice/i, 'Business'],
  [/research|academic|phd/i, 'Research'],
  [/mosque|church|coptic|islamic|religio/i, 'Religious Heritage'],
];

export async function POST(req: Request) {
  let message = '';
  let locale = 'en';
  try {
    const body = await req.json();
    message = String(body.message ?? '').slice(0, 2000);
    locale = String(body.locale ?? 'en');
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }
  if (!message.trim()) return NextResponse.json({ error: 'Empty message.' }, { status: 400 });

  const p = principal();
  const decision = route(message, { roles: p.roles, consents: p.consents });

  audit({
    actorId: p.userId, actorRole: p.roles.join(','), action: 'ai.route',
    resource: `agent:${decision.primary.agent.key}`, dataClass: 'PUBLIC',
    purpose: p.purpose, decision: decision.allowed ? 'ALLOW' : 'DENY',
    outcome: decision.refusal,
  });

  if (!decision.allowed) {
    return NextResponse.json({
      turn: {
        role: 'assistant', denied: true,
        agent: decision.primary.agent.key, agentLabel: decision.primary.agent.publicLabel,
        content: decision.refusal,
        citations: [],
      },
    });
  }

  if (decision.missingConsents.length) {
    return NextResponse.json({
      turn: {
        role: 'assistant', denied: true,
        agent: decision.primary.agent.key, agentLabel: decision.primary.agent.publicLabel,
        content: `Before I can help with that I need your consent for: ${decision.missingConsents.join(', ').toLowerCase()}. You can grant or revoke it at any time in the consent centre, and every access is recorded.`,
        cards: [{ kind: 'link', title: 'Consent centre', body: 'Control location, marketing, data sharing, AI personalisation and health data.', href: '/account/consent', cta: 'Open consent centre' }],
        citations: [],
      },
    });
  }

  const agent = decision.primary.agent;
  let content = '';
  let cards: Card[] = [];
  let citations: Citation[] = [];

  switch (agent.key) {
    case 'TRIP_PLANNER': {
      const days = Math.max(3, Math.min(21, num(message.match(/(\d+)\s*(day|night)/i)?.[0] ?? '') ?? 7));
      const interests = INTEREST_WORDS.filter(([re]) => re.test(message)).map(([, v]) => v);
      const plan = planEgyptTrip({ days, interests, startGovernorate: 'cairo' });
      citations = plan.citations;
      const stops = [...new Set(plan.data.map((d) => d.governorate))];
      content = `Here is a ${days}-day route through ${stops.join(' → ')}${interests.length ? `, weighted towards ${interests.join(', ').toLowerCase()}` : ''}.\n${plan.note}`;
      cards = plan.data.slice(0, 5).map((d) => ({
        kind: 'itinerary', title: `Day ${d.day} · ${d.title}`,
        rows: d.items.map((i) => ({ label: i.kind, value: `${i.time ? i.time + ' — ' : ''}${i.title}` })),
      }));
      cards.push({ kind: 'link', title: 'Refine this in the trip builder', body: 'Add dates, budget, accessibility needs and languages, then edit day by day.', href: '/trip-builder', cta: 'Open trip builder' });
      break;
    }

    case 'HERITAGE': {
      const hits = searchEverything(message.replace(/tell me about|what is|the /gi, '').trim(), 4).data
        .filter((h) => h.kind === 'Heritage site' || h.kind === 'Museum' || h.kind === 'Destination');
      if (hits.length) {
        const site = explainHeritageSite(hits[0].slug);
        citations = site.data ? site.citations : [{ label: hits[0].name, sourceStatus: hits[0].sourceStatus }];
        const s = site.data;
        content = s
          ? `${s.name} is recorded as a ${s.classification} site of the ${s.era.replace(/_/g, ' ').toLowerCase()} period, in ${s.governorateSlug.replace(/-/g, ' ')}. Its access classification is "${s.access.replace(/_/g, ' ').toLowerCase()}".\n${site.note}`
          : `I found ${hits[0].name} in the registry. ${hits[0].summary ?? ''}`;
        cards = hits.slice(0, 3).map((h) => ({ kind: 'link', title: h.name, body: h.summary, href: h.href, cta: 'Open record' }));
      } else {
        const eras = db.eras.all();
        content = `I could not match that to a specific record. Egyptian history on this platform is organised into ${eras.length} eras, from ${eras[0].name} to ${eras[eras.length - 1].name}, with ${db.heritage.all().length} registry entries and ${db.museums.all().length} museums linked to them.`;
        cards = [{ kind: 'link', title: 'Egypt through time', body: 'Browse the timeline and jump into any era.', href: '/egypt-through-time', cta: 'Open the timeline' }];
        citations = [{ label: 'Heritage registry', sourceStatus: 'DEMO' }];
      }
      break;
    }

    case 'GUIDE_MATCH': {
      const lang = ['French', 'German', 'Russian', 'Chinese', 'Japanese', 'Spanish', 'Italian', 'Greek', 'Hindi', 'Korean', 'English', 'Arabic']
        .find((l) => new RegExp(l, 'i').test(message));
      const gov = db.governorates.all().find((g) => new RegExp(g.name, 'i').test(message));
      const res = findGuide({ language: lang, governorate: gov?.slug, limit: 5 });
      citations = res.citations;
      content = res.data.length
        ? `${res.data.length} guides match${lang ? ` ${lang}` : ''}${gov ? ` in ${gov.name}` : ''}.\n${res.note}`
        : `No guide in the demo directory matches${lang ? ` ${lang}` : ''}${gov ? ` in ${gov.name}` : ''}. Widening the governorate or language usually helps.`;
      cards = res.data.map((g) => ({
        kind: 'guide', title: g.name,
        body: `${(g.languages ?? []).join(', ')}${g.specialties?.length ? ` · ${g.specialties.join(', ')}` : ''}`,
        href: `/guides/${g.slug}`, cta: 'View profile',
        rows: [
          { label: 'Verification', value: g.verification === 'VERIFIED' ? 'Verified on platform' : 'In review' },
          { label: 'Rating', value: String(g.rating ?? '—') },
          { label: 'From', value: g.priceFrom ? `${g.currency} ${g.priceFrom}` : '—' },
        ],
      }));
      break;
    }

    case 'INVESTMENT': {
      const budget = num(message) ?? 2_000_000;
      const sector = ['hotel', 'resort', 'entertainment', 'real estate', 'marina', 'healthcare', 'agriculture', 'logistics', 'technology', 'tourism']
        .find((s) => new RegExp(s, 'i').test(message));
      const res = discoverInvestment({ budgetUsd: budget, sector });
      citations = res.citations;
      content = `For roughly USD ${budget.toLocaleString()}${sector ? ` in ${sector}` : ''}, these areas rank highest on the indicators available to me.\n${res.note}`;
      cards = [
        { kind: 'areas', title: 'Recommended areas', rows: res.data.recommendedAreas.map((a) => ({ label: a.name, value: `${a.occupancyPct}% occupancy · ${a.opportunities} opportunities` })) },
        { kind: 'signals', title: 'Demand signals', rows: res.data.demandSignals.map((s, i) => ({ label: `Signal ${i + 1}`, value: s })) },
        { kind: 'risks', title: 'Risks', rows: res.data.risks.map((s, i) => ({ label: `Risk ${i + 1}`, value: s })) },
        { kind: 'next', title: 'Next steps', rows: res.data.nextSteps.map((s, i) => ({ label: `Step ${i + 1}`, value: s })) },
        { kind: 'link', title: 'Browse the opportunity registry', href: '/investment-opportunities', cta: 'Open registry' },
      ];
      break;
    }

    case 'BOOKING': {
      const gov = db.governorates.all().find((g) => new RegExp(g.name, 'i').test(message)) ?? db.governorates.bySlug('cairo')!;
      const res = await findAccommodation({ governorate: gov.slug, checkIn: '', checkOut: '', adults: 2, children: 0 });
      citations = res.citations;
      content = `${res.note ?? ''}\nI can still show you what is in the provider directory for ${gov.name}, but nothing below is a live rate or a confirmed availability.`;
      cards = res.data.directory.slice(0, 4).map((h) => ({
        kind: 'stay', title: h.name, body: h.summary, href: '/hotels', cta: 'Open hotels',
        rows: [{ label: 'Indicative from', value: h.priceFrom ? `${h.currency} ${h.priceFrom}` : '—' }, { label: 'Verification', value: h.verification }],
      }));
      const quote = quotePayment('ACCOMMODATION', 100);
      cards.push({
        kind: 'commercial', title: 'How a booking would settle',
        rows: [
          { label: 'Gross', value: 'USD 100.00' },
          { label: 'Platform share', value: `USD ${quote.data.platformShare.toFixed(2)}` },
          { label: 'Provider share', value: `USD ${quote.data.providerShare.toFixed(2)}` },
          { label: 'Rule', value: quote.data.ruleNote },
        ],
      });
      break;
    }

    case 'TOURISM_INTEL': {
      const res = generateTourismInsight();
      citations = res.citations;
      content = `${res.note}\nAcross the demo dataset: ${(res.data.headline.visitorsThisMonth / 1e6).toFixed(2)}M visitor journeys this month, ${res.data.headline.avgStayNights} nights average stay.`;
      cards = [
        { kind: 'stats', title: 'Top origin markets', rows: res.data.topCountries.slice(0, 5).map((c) => ({ label: c.country, value: `${c.sharePct}%` })) },
        { kind: 'link', title: 'Full dashboard', href: '/government/tourism-intelligence', cta: 'Open dashboard' },
      ];
      break;
    }

    case 'SAFETY': {
      content =
        'For an emergency in Egypt, contact the local emergency services directly rather than waiting for this assistant.\n' +
        'For a lost passport, the first step is a police report, then your country’s embassy or consulate for an emergency travel document. Egypt One can show you the safety centre and the recorded procedure, but it cannot contact authorities for you and it does not read your location unless you turn on emergency location sharing.';
      cards = [
        { kind: 'link', title: 'Safety centre', body: 'Emergency numbers, procedures and embassy navigation.', href: '/safety', cta: 'Open safety centre' },
        { kind: 'link', title: 'Location consent', body: 'Off, trip mode or emergency mode — your choice, revocable at any time.', href: '/account/consent', cta: 'Manage location' },
      ];
      citations = [{ label: 'Safety guidance', sourceStatus: 'DEMO', owner: 'Pending official source' }];
      break;
    }

    case 'MEDICAL': {
      const providers = db.providers.byType('MEDICAL').slice(0, 4);
      content =
        'I can help you find providers and plan the travel around an appointment, but I do not diagnose, recommend treatment or interpret results — that is for a qualified clinician.\n' +
        'The accredited-network integration is not connected in this prototype, so the entries below are demo records and their accreditation is not confirmed.';
      cards = providers.map((m) => ({ kind: 'medical', title: m.name, body: (m.specialties ?? []).join(', '), href: '/medical-tourism', cta: 'Open medical tourism' }));
      citations = [{ label: 'Medical provider directory', sourceStatus: 'DEMO', owner: 'Accredited providers (planned)' }];
      break;
    }

    case 'GOV_SERVICES':
    case 'BUSINESS_SETUP': {
      content =
        agent.key === 'GOV_SERVICES'
          ? 'Entry requirements, permits and residency are decided by the competent Egyptian authority. Egypt One is a navigation layer: it can show you which authority owns a procedure and what an application usually involves, but it cannot issue, approve or confirm anything, and the authority integration is not connected in this prototype.'
          : 'Setting up a business runs: activity → location → legal structure → responsible authorities → licences → documents → official application. Egypt One sequences and explains those steps. It does not submit applications or issue licences.';
      cards = [
        { kind: 'link', title: agent.key === 'GOV_SERVICES' ? 'Visa & entry guidance' : 'Business setup navigator', href: agent.key === 'GOV_SERVICES' ? '/visa' : '/business-setup', cta: 'Open' },
        { kind: 'link', title: 'Integration status', body: 'See exactly which authority exchanges are connected.', href: '/admin/integrations', cta: 'View registry' },
      ];
      citations = [{ label: 'Government integration registry', sourceStatus: 'PLANNED_INTEGRATION', owner: 'Competent authority' }];
      break;
    }

    case 'RESEARCH': {
      const progs = db.research.all().slice(0, 4);
      content = `The research portal lists ${db.research.all().length} demo programmes across ${db.research.universities().length} universities. Admission, fees and any fieldwork permit are decided by the university and the competent authorities, not here.`;
      cards = progs.map((r) => ({ kind: 'research', title: r.name, body: `${r.university} · ${r.languages.join(', ')}`, href: '/research', cta: 'Open research portal' }));
      citations = [{ label: 'Research programme directory', sourceStatus: 'DEMO', owner: 'Universities (planned)' }];
      break;
    }

    case 'TRUST': {
      const hits = searchEverything(message, 3).data;
      content = hits.length
        ? `Here is what the registry actually records for those. Everything in this prototype is demo data unless a badge says otherwise, and platform verification is never the same thing as a government licence.`
        : 'Every record on this platform carries a source status: live, verified, partner, demo, simulated or planned integration. If a claim has no source behind it, the assistant is required to say so rather than fill the gap.';
      cards = hits.map((h) => ({ kind: 'trust', title: h.name, body: `${h.kind} · ${h.sourceStatus.replace(/_/g, ' ').toLowerCase()}`, href: h.href, cta: 'Open record' }));
      citations = hits.map((h) => ({ label: h.name, sourceStatus: h.sourceStatus }));
      break;
    }

    default: {
      const hits = searchEverything(message, 5).data;
      content = hits.length
        ? `Here is what I found across the platform.`
        : `I can help with trips, heritage, guides, transport, stays, events, health, research, business setup and investment. Ask me something specific — for example, "plan five days with history and the Red Sea" or "which governorates suit a boutique hotel".`;
      cards = hits.map((h) => ({ kind: 'link', title: h.name, body: `${h.kind}${h.summary ? ` · ${h.summary}` : ''}`, href: h.href, cta: 'Open' }));
      citations = hits.length ? [{ label: 'Unified index', sourceStatus: 'DEMO' }] : [];
    }
  }

  const guard = composeGuard({ agent, question: message, citations });
  const caveatText = guard.caveats.length ? `\n\n${guard.caveats.join(' ')}` : '';

  return NextResponse.json({
    turn: {
      role: 'assistant',
      agent: agent.key,
      agentLabel: agent.publicLabel,
      content: `${content}${caveatText}`,
      cards,
      citations: [{ label: SOURCE_LABEL_TEXT[guard.label], sourceStatus: guard.label === 'OFFICIAL_SOURCE' ? 'VERIFIED_DATA' : guard.label === 'PARTNER_DATA' ? 'PARTNER_DATA' : guard.label === 'AI_ANALYSIS' ? 'SIMULATED' : 'DEMO' }, ...citations],
    },
    locale,
  });
}
