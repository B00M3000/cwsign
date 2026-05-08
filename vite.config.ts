import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import https from 'node:https';
import type { IncomingMessage, ServerResponse } from 'node:http';

const SYMBOLS = [
	// Indices — no .us suffix on stooq
	{ stooq: '^dji',     display: 'DOW' },
	{ stooq: '^spx',     display: 'S&P 500' },
	{ stooq: '^ndx',     display: 'NASDAQ' },
	// Magnificent 7
	{ stooq: 'aapl.us',  display: 'AAPL' },
	{ stooq: 'msft.us',  display: 'MSFT' },
	{ stooq: 'nvda.us',  display: 'NVDA' },
	{ stooq: 'amzn.us',  display: 'AMZN' },
	{ stooq: 'meta.us',  display: 'META' },
	{ stooq: 'googl.us', display: 'GOOGL' },
	{ stooq: 'tsla.us',  display: 'TSLA' },
];

function stooqGet(sym: string): Promise<any> {
	return new Promise((resolve) => {
		const path = `/q/l/?s=${encodeURIComponent(sym)}&f=sd2t2ohlcv&h&e=json`;
		const req = https.request(
			{ hostname: 'stooq.com', path, headers: { 'User-Agent': 'Mozilla/5.0' } },
			(res) => {
				let body = '';
				res.on('data', (c) => (body += c));
				res.on('end', () => {
					try { resolve(JSON.parse(body)?.symbols?.[0] ?? null); }
					catch { resolve(null); }
				});
			},
		);
		req.on('error', () => resolve(null));
		req.end();
	});
}

function round2(n: number) { return Math.round(n * 100) / 100; }

// Simple in-memory cache — avoids hammering stooq on every hot-reload
let cache: { stocks: object[]; ts: number } | null = null;
const CACHE_TTL_MS = 60_000;

async function fetchStocks(): Promise<{ stocks: object[] }> {
	if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache;

	const quotes = await Promise.all(SYMBOLS.map((s) => stooqGet(s.stooq)));
	const stocks = SYMBOLS.map((def, i) => {
		const q = quotes[i];
		const price = q?.close ?? 0;
		const open  = q?.open  ?? price;
		const change = round2(price - open);
		const changePercent = round2(open ? (change / open) * 100 : 0);
		return { display: def.display, price, change, changePercent };
	});

	cache = { stocks, ts: Date.now() };
	return cache;
}

function stocksDevPlugin() {
	return {
		name: 'stocks-dev',
		configureServer(server: any) {
			server.middlewares.use('/api/stocks', async (_req: IncomingMessage, res: ServerResponse) => {
				try {
					const data = await fetchStocks();
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(data));
				} catch (err) {
					console.error('[stocks-dev]', err);
					res.writeHead(502, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ error: String(err) }));
				}
			});
		},
	};
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson(), stocksDevPlugin()],
	server: {
		allowedHosts: ['my-codespace.tail5fe728.ts.net'],
	},
});
