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

<div class="ticker-bar h-9 bg-slate-900 border-b border-slate-700 shrink-0 overflow-hidden flex items-center">
  {#if fetchFailed}
    <span class="px-6 text-slate-500 text-xs">Market data unavailable</span>
  {:else if stocks.length === 0}
    <span class="px-6 text-slate-500 text-xs">Loading market data…</span>
  {:else}
    <div class="ticker-track flex items-center gap-10 whitespace-nowrap" style="animation-duration: {stocks.length * 4}s">
      {#each [...stocks, ...stocks] as s}
        {@const up = s.change >= 0}
        <span class="inline-flex items-center gap-2 text-sm">
          <span class="font-semibold text-slate-300">{s.display}</span>
          <span class="text-white">{fmt(s.price)}</span>
          <span class="inline-flex items-center gap-0.5 {up ? 'text-emerald-400' : 'text-red-400'}">
            {#if s.change === 0}
              <Minus size={11} />
            {:else if up}
              <TrendingUp size={11} />
            {:else}
              <TrendingDown size={11} />
            {/if}
            {up ? "+" : ""}{fmt(s.change)}
            <span class="text-xs opacity-75">({up ? "+" : ""}{s.changePercent.toFixed(2)}%)</span>
          </span>
        </span>
      {/each}
    </div>
    {#if lastUpdated}
      <span class="absolute right-3 text-slate-600 text-xs pointer-events-none">{lastUpdated}</span>
    {/if}
  {/if}
</div>

<style>
  .ticker-bar {
    position: relative;
  }

  .ticker-track {
    animation: ticker-scroll linear infinite;
    padding-left: 2rem;
  }

  @keyframes ticker-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
</style>
