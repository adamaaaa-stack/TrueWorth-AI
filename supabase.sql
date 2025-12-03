-- Run in Supabase SQL editor
create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  listings jsonb,
  stats jsonb,
  created_at timestamptz default now()
);

create table if not exists valuations (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  images jsonb,
  assessment jsonb,
  estimate_low numeric,
  estimate_high numeric,
  created_at timestamptz default now()
);

create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  target text,
  created_at timestamptz default now()
);
