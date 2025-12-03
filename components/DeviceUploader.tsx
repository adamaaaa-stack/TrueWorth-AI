'use client';

import { useState } from 'react';

type Props = {
  onComplete?: (data: any) => void;
};

export default function DeviceUploader({ onComplete }: Props) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [query, setQuery] = useState('iPhone 13');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setError('Please select images');
      return;
    }
    setLoading(true);
    setError(null);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append('files', f));
    form.append('query', query);
    try {
      const res = await fetch('/api/estimate', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      onComplete?.(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-slate-300 mb-1">Device name</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1">Images (4-6)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="text-slate-200"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-emerald-500 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Estimating...' : 'Estimate Value'}
      </button>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
