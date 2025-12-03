'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [query, setQuery] = useState('iPhone 13');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [freeCount, setFreeCount] = useState(0);

  const handleScan = async () => {
    if (freeCount >= 5) {
      setError('Free scans used. Upgrade to continue.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Scan failed');
      setStats(json);
      setFreeCount((c) => c + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAffiliate = async () => {
    await fetch('/api/affiliate', { method: 'POST' });
    window.open('https://example.com/partner', '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700 w-72"
          placeholder="Search device"
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 rounded text-white disabled:opacity-50"
        >
          {loading ? 'Scanning...' : 'Scan Market'}
        </button>
      </div>
      {error && <p className="text-red-400">{error}</p>}
      <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Plan</p>
            <p className="font-semibold">Freemium · {5 - freeCount} scans left</p>
          </div>
          <button className="px-3 py-2 bg-amber-500 rounded text-black font-semibold">
            Upgrade to Pro
          </button>
        </div>
        <button onClick={handleAffiliate} className="text-emerald-400 underline text-sm">
          Sell now to partner
        </button>
      </div>
      {stats && (
        <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-2">
          <h2 className="text-xl font-semibold">Pricing</h2>
          <p>Average: ${stats.stats?.average}</p>
          <p>Median: ${stats.stats?.median}</p>
          <p>
            Range: ${stats.stats?.low} - ${stats.stats?.high}
          </p>
          <p>Listings scraped: {stats.listings?.length}</p>
        </div>
      )}
    </div>
  );
}
