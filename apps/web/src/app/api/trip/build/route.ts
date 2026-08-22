import { NextResponse } from 'next/server';
import { planEgyptTrip } from '@egypt-one/skills';

export const runtime = 'nodejs';

/** Trip Planner Agent entry point. Produces a draft itinerary — never a booking. */
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Malformed body.' }, { status: 400 }); }

  const days = Math.max(1, Math.min(30, Number(body.days) || 7));
  const interests = Array.isArray(body.interests) ? (body.interests as string[]).slice(0, 20) : [];
  const accessibility = Array.isArray(body.accessibility) ? (body.accessibility as string[]) : [];
  const languages = Array.isArray(body.languages) ? (body.languages as string[]) : [];

  const result = planEgyptTrip({
    days, interests, accessibility, languages,
    budgetUsd: Number(body.budgetUsd) || undefined,
    partyType: typeof body.partyType === 'string' ? body.partyType : undefined,
    startGovernorate: 'cairo',
  });

  return NextResponse.json({
    plan: result.data,
    citations: result.citations,
    note: result.note,
    bookingState: 'DRAFT',
  });
}
