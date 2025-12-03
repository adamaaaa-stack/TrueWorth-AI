import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Device Valuation Platform</h1>
      <p className="text-slate-300">Scan the market or upload photos to get valuation.</p>
      <div className="flex gap-3">
        <Link href="/dashboard" className="px-4 py-2 bg-indigo-500 rounded text-white">
          Go to Dashboard
        </Link>
        <Link href="/upload" className="px-4 py-2 bg-emerald-500 rounded text-white">
          Upload Device
        </Link>
      </div>
    </div>
  );
}
