<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import {
    Calendar,
    RefreshCw,
    DoorOpen,
    House,
    FolderOpen,
    Timer,
    ForkKnife,
  } from "@lucide/svelte";
  import StockTicker from "$lib/StockTicker.svelte";

  import "../app.css";

  const navLinks = [
    { href: "/", label: "Home", icon: House },
    { href: "/meetings", label: "Our Meetings", icon: Calendar },
    { href: "/cpw", label: "Project Week", icon: FolderOpen },
    { href: "/free-rooms", label: "Free Rooms", icon: DoorOpen },
    { href: "/lunch-menu", label: "Lunch Menu", icon: ForkKnife },
  ];

  let { children } = $props();

  const SWITCH_TIME_SECONDS = 60;
  const navHrefs = navLinks.map((l) => l.href);

  let todayString = $state("");
  let timeString = $state("");
  let countdown = $state(SWITCH_TIME_SECONDS);
  const activePath = $derived(page.url.pathname);

  let switchTimer: ReturnType<typeof setInterval>;

  function startSwitchTimer() {
    clearInterval(switchTimer);
    countdown = SWITCH_TIME_SECONDS;
    switchTimer = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearInterval(switchTimer);
        const choices = navHrefs.filter((h) => h !== page.url.pathname);
        if (choices.length > 0) {
          goto(choices[Math.floor(Math.random() * choices.length)]);
        }
      }
    }, 1000);
  }

  // Reset the switch timer whenever the route changes
  $effect(() => {
    const _ = activePath;
    startSwitchTimer();
  });

  onMount(() => {
    // Clock
    function updateClock() {
      const now = new Date();
      todayString = now.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    updateClock();
    const clockId = setInterval(updateClock, 1000);

    // Reset switch timer on user activity
    function onActivity() {
      startSwitchTimer();
    }
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      clearInterval(clockId);
      clearInterval(switchTimer);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  });
</script>

<svelte:head>
  <title>CS Club Digital Poster</title>
  <link rel="manifest" href="/manifest.json" />
</svelte:head>

<div class="flex flex-col h-dvh w-screen overflow-hidden">

  <!-- Top nav bar -->
  <div class="flex items-center bg-slate-800 text-white border-b border-slate-700 h-14 px-4 gap-2 shrink-0">
    <nav class="flex items-center gap-1.5 flex-1" data-sveltekit-preload-data="hover" data-sveltekit-preload-code="hover">
      {#each navLinks as link}
        {@const active = activePath === link.href}
        <a
          href={link.href}
          class="nav-link flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-150 text-sm font-medium"
          class:active
        >
          <link.icon size={16} class="shrink-0" />
          <span class="whitespace-nowrap">{link.label}</span>
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-3 shrink-0">
      {#if todayString}
        <span class="text-slate-400 text-xs whitespace-nowrap">{todayString}</span>
      {/if}
      {#if timeString}
        <span class="text-white text-sm font-mono font-semibold tabular-nums">{timeString}</span>
      {/if}
      <div class="flex items-center gap-1 text-slate-500 text-xs">
        <Timer size={13} />
        <span class="tabular-nums">{countdown}s</span>
      </div>
      <button
        onclick={(e) => {
          e.currentTarget.style.animation = "spin 1s linear infinite";
          setTimeout(() => window.location.reload(), 500);
        }}
        title="Refresh"
        class="icon-btn p-1.5 rounded-lg transition-colors duration-150"
      >
        <RefreshCw size={15} />
      </button>
    </div>
  </div>

  <!-- Stock ticker -->
  <StockTicker />

  <!-- Main content -->
  <div class="flex-1 min-h-0 overflow-y-auto">
    {@render children()}
  </div>

</div>

<style>
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .nav-link {
    color: #94a3b8;
    text-decoration: none;
    background-color: #1e293b;
    border: 1px solid #334155;
  }

  .nav-link:hover {
    background-color: #334155;
    border-color: #475569;
    color: #f1f5f9;
  }

  .nav-link.active {
    background-color: #1e40af;
    border-color: #3b82f6;
    color: #ffffff;
  }

  .icon-btn {
    background-color: #1e293b;
    border: 1px solid #334155;
    color: #94a3b8;
    cursor: pointer;
  }

  .icon-btn:hover {
    background-color: #334155;
    border-color: #475569;
    color: #f1f5f9;
  }
</style>
