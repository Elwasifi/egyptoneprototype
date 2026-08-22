import { NextResponse } from 'next/server';
import { search } from '@egypt-one/database';

/** Global unified search across every content and supply entity. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q') ?? '';
  if (q.trim().length < 2) return NextResponse.json({ hits: [], query: q });
  return NextResponse.json({ hits: search(q, 30), query: q });
}
