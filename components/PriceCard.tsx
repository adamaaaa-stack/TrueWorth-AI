type Props = {
  estimateLow: number;
  estimateHigh: number;
};

export default function PriceCard({ estimateLow, estimateHigh }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-1">
      <p className="text-slate-400 text-sm">Estimated range</p>
      <div className="text-3xl font-semibold">
        ${estimateLow} - ${estimateHigh}
      </div>
    </div>
  );
}
