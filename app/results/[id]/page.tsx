import { supabase } from '@/lib/supabaseClient';

type Props = { params: { id: string } };

export default async function ResultPage({ params }: Props) {
  const { data, error } = await supabase.from('valuations').select('*').eq('id', params.id).single();
  if (error || !data) {
    return <div className="text-red-400">Result not found</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Valuation #{params.id}</h1>
      <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-2">
        <p>
          Estimate: ${data.estimate_low} - ${data.estimate_high}
        </p>
        <p>Condition score: {data.assessment?.conditionScore}</p>
        <p>Model guess: {data.assessment?.modelGuess}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data.images?.map((src: string) => (
          <img key={src} src={src} alt="upload" className="rounded" />
        ))}
      </div>
    </div>
  );
}
