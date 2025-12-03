import axios from 'axios';
import * as cheerio from 'cheerio';
import { Listing, computeStats, priceFromText, removeOutliers } from './priceEngine';
import { supabase } from './supabaseClient';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY!;
const SCRAPER_BASE = 'http://api.scraperapi.com';

function buildEbayUrl(query: string, page = 1) {
  const encoded = encodeURIComponent(query);
  return `https://www.ebay.com/sch/i.html?_nkw=${encoded}&_pgn=${page}`;
}

async function fetchHtml(url: string) {
  const proxiedUrl = `${SCRAPER_BASE}?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;
  const res = await axios.get(proxiedUrl);
  return res.data as string;
}

function parseListings(html: string): Listing[] {
  const $ = cheerio.load(html);
  const items: Listing[] = [];
  $('li.s-item').each((_, el) => {
    const title = $(el).find('.s-item__title').text().trim();
    const priceText = $(el).find('.s-item__price').first().text();
    const condition = $(el).find('.SECONDARY_INFO').first().text().trim() || 'Unknown';
    const img = $(el).find('.s-item__image-img').attr('src') || '';
    const link = $(el).find('.s-item__link').attr('href') || '';
    const price = priceFromText(priceText);
    if (title && price !== null) {
      items.push({ title, price, condition, image: img, link });
    }
  });
  return items;
}

export async function scrapeEbay(query: string) {
  const pagesToGrab = 4; // target ~200 listings assuming ~50 per page
  const allListings: Listing[] = [];

  for (let p = 1; p <= pagesToGrab; p += 1) {
    const html = await fetchHtml(buildEbayUrl(query, p));
    allListings.push(...parseListings(html));
  }

  const prices = allListings.map((l) => l.price).filter((n) => Number.isFinite(n));
  const cleanedPrices = removeOutliers(prices);
  const stats = computeStats(cleanedPrices);
  const normalized = allListings.filter((l) => cleanedPrices.includes(l.price));

  const { data, error } = await supabase
    .from('scans')
    .insert({
      query,
      listings: normalized,
      stats
    })
    .select()
    .single();

  if (error) throw error;
  return { id: data.id, stats, listings: normalized };
}
