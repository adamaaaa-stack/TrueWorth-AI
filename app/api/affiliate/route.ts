import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  const { error } = await supabase.from('affiliate_clicks').insert({ target: 'partner' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
