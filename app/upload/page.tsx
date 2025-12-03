'use client';

import { useState } from 'react';
import DeviceUploader from '@/components/DeviceUploader';
import PriceCard from '@/components/PriceCard';
import ConditionGauge from '@/components/ConditionGauge';

export default function UploadPage() {
  const [result, setResult] = useState<any>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload photos</h1>
      <DeviceUploader onComplete={setResult} />
      {result && (
        <div className="space-y-4">
          <PriceCard estimateLow={result.estimateLow} estimateHigh={result.estimateHigh} />
          <ConditionGauge score={result.assessment?.conditionScore || 0} />
          <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-1 text-sm">
            <p>Scratches: {result.assessment?.scratches}</p>
            <p>Cracks: {result.assessment?.cracks}</p>
            <p>Dents: {result.assessment?.dents}</p>
            <p>Screen: {result.assessment?.screen}</p>
            <p>Wear: {result.assessment?.wear}</p>
            <p>Model guess: {result.assessment?.modelGuess}</p>
          </div>
        </div>
      )}
    </div>
  );
}
