export const prerender = false;

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const SYMBOLS = [
	{ stooq: '^dji',     display: 'DOW' },
	{ stooq: '^spx',     display: 'S&P 500' },
	{ stooq: '^ndx',     display: 'NASDAQ' },
	{ stooq: 'aapl.us',  display: 'AAPL' },
	{ stooq: 'msft.us',  display: 'MSFT' },
	{ stooq: 'nvda.us',  display: 'NVDA' },
	{ stooq: 'amzn.us',  display: 'AMZN' },
	{ stooq: 'meta.us',  display: 'META' },
	{ stooq: 'googl.us', display: 'GOOGL' },
	{ stooq: 'tsla.us',  display: 'TSLA' },
	{ stooq: 'nflx.us', display: 'NFLX' },
];

async function stooqGet(sym: string): Promise<Record<string, unknown> | null> {
	try {
		const url = `https://stooq.com/q/l/?s=${encodeURIComponent(sym)}&f=sd2t2ohlcv&h&e=json`;
		const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
		const data = await res.json();
		return data?.symbols?.[0] ?? null;
	} catch {
		return null;
	}
}

function round2(n: number) { return Math.round(n * 100) / 100; }

let cache: { stocks: object[]; ts: number } | null = null;
const CACHE_TTL_MS = 60_000;

export const GET: RequestHandler = async () => {
	if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return json(cache);

	const quotes = await Promise.all(SYMBOLS.map((s) => stooqGet(s.stooq)));
	const stocks = SYMBOLS.map((def, i) => {
		const q = quotes[i];
		const price = (q?.close as number) ?? 0;
		const open  = (q?.open  as number) ?? price;
		const change = round2(price - open);
		const changePercent = round2(open ? (change / open) * 100 : 0);
		return { display: def.display, price, change, changePercent };
	});

	cache = { stocks, ts: Date.now() };
	return json(cache);
};
