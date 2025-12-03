type Props = {
  score: number;
};

export default function ConditionGauge({ score }: Props) {
  const clamped = Math.min(100, Math.max(0, score));
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-400">
        <span>Condition</span>
        <span>{clamped}/100</span>
      </div>
      <div className="w-full bg-slate-800 h-3 rounded">
        <div
          className="h-3 bg-emerald-500 rounded"
          style={{ width: `${clamped}%`, transition: 'width 0.3s ease' }}
        />
      </div>
    </div>
  );
}
