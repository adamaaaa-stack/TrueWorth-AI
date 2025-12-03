import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Device Valuation',
  description: 'Market scanner and photo-based valuation'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
