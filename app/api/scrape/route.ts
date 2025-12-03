export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { scrapeEbay } from '@/lib/scraper';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }
    const result = await scrapeEbay(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Scrape failed' }, { status: 500 });
  }
}
