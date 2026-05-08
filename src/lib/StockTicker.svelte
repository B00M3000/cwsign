<script lang="ts">
  import { onMount } from "svelte";
  import { TrendingUp, TrendingDown, Minus } from "@lucide/svelte";

  interface Stock {
    display: string;
    price: number;
    change: number;
    changePercent: number;
  }

  let stocks = $state<Stock[]>([]);
  let lastUpdated = $state("");
  let fetchFailed = $state(false);

  async function fetchStocks() {
    try {
      const res = await fetch("/api/stocks", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      stocks = data?.stocks ?? [];
      lastUpdated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      fetchFailed = false;
    } catch {
      fetchFailed = true;
    }
  }

  onMount(() => {
    fetchStocks();
    const id = setInterval(fetchStocks, 5 * 60 * 1000);
    return () => clearInterval(id);
  });

  function fmt(n: number) {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
</script>

<div class="relative h-9 bg-slate-900 border-b border-slate-700 shrink-0 overflow-hidden flex items-center">
  {#if fetchFailed}
    <span class="px-6 text-slate-500 text-xs">Market data unavailable</span>
  {:else if stocks.length === 0}
    <span class="px-6 text-slate-500 text-xs">Loading market data…</span>
  {:else}
    <div class="ticker-track" style="animation-duration: {stocks.length * 4}s">
      {#each [...stocks, ...stocks] as s}
        {@const up = s.change >= 0}
        <span class="ticker-item">
          <span class="sym">{s.display}</span>
          <span class="price">{fmt(s.price)}</span>
          <span class="change {up ? 'up' : 'down'}">
            {#if s.change === 0}<Minus size={11} />{:else if up}<TrendingUp size={11} />{:else}<TrendingDown size={11} />{/if}
            {up ? "+" : ""}{fmt(s.change)}
            <span class="pct">({up ? "+" : ""}{s.changePercent.toFixed(2)}%)</span>
          </span>
        </span>
      {/each}
    </div>

    {#if lastUpdated}
      <div class="timestamp-badge">{lastUpdated}</div>
    {/if}
  {/if}
</div>

<style>
  .ticker-track {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    white-space: nowrap;
    animation: ticker-scroll linear infinite;
    padding-left: 2rem;
    flex-shrink: 0;
  }

  @keyframes ticker-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8125rem;
  }

  .sym   { font-weight: 600; color: #94a3b8; }
  .price { color: #f1f5f9; }

  .change {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
  }
  .up   { color: #34d399; }
  .down { color: #f87171; }
  .pct  { font-size: 0.75rem; opacity: 0.75; }

  .timestamp-badge {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    background-color: #0f172a;
    border-left: 1px solid #1e293b;
    color: #475569;
    font-size: 0.7rem;
    white-space: nowrap;
    z-index: 10;
  }
</style>
