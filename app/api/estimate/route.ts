import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';
import { assessDeviceFromImages } from '@/lib/gemini';
import { PricingStats } from '@/lib/priceEngine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function uploadToStorage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const filePath = `uploads/${uuidv4()}-${file.name}`;
  const { error } = await supabase.storage.from('uploads').upload(filePath, arrayBuffer, {
    contentType: file.type
  });
  if (error) throw error;
  const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const query = (formData.get('query') as string) || 'device';
    if (!files.length) {
      return NextResponse.json({ error: 'files are required' }, { status: 400 });
    }
    const uploads = await Promise.all(files.map((f) => uploadToStorage(f)));
    const assessment = await assessDeviceFromImages(uploads);

    const { data: recentScan } = await supabase
      .from('scans')
      .select('stats')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const stats: PricingStats =
      recentScan?.stats || { average: 0, median: 0, low: 0, high: 0, trend: 'flat' };

    const multiplier = assessment.conditionScore / 100;
    const estimateLow = Math.round(stats.low * multiplier);
    const estimateHigh = Math.round(stats.high * multiplier);

    const { data, error } = await supabase
      .from('valuations')
      .insert({
        query,
        images: uploads,
        assessment,
        estimate_low: estimateLow,
        estimate_high: estimateHigh
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      assessment,
      estimateLow,
      estimateHigh,
      stats
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Estimation failed' }, { status: 500 });
  }
}
