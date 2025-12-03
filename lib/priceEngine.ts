export type Listing = {
  title: string;
  price: number;
  condition: string;
  image: string;
  link?: string;
};

export type PricingStats = {
  average: number;
  median: number;
  low: number;
  high: number;
  trend: 'up' | 'down' | 'flat';
};

const round = (num: number) => Math.round(num * 100) / 100;

export function removeOutliers(prices: number[]): number[] {
  if (prices.length < 4) return prices;
  const sorted = [...prices].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length / 4)];
  const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return sorted.filter((p) => p >= lower && p <= upper);
}

export function computeStats(prices: number[]): PricingStats {
  if (!prices.length) {
    return { average: 0, median: 0, low: 0, high: 0, trend: 'flat' };
  }
  const sorted = [...prices].sort((a, b) => a - b);
  const average = round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
  const median =
    sorted.length % 2 === 0
      ? round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2)
      : round(sorted[Math.floor(sorted.length / 2)]);
  return {
    average,
    median,
    low: round(sorted[0]),
    high: round(sorted[sorted.length - 1]),
    trend: 'flat'
  };
}

export function priceFromText(text: string): number | null {
  const numeric = text.replace(/[^0-9.,]/g, '').replace(',', '.');
  const value = parseFloat(numeric);
  return Number.isFinite(value) ? value : null;
}
