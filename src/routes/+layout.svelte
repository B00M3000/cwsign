<script lang="ts">
  import { page } from "$app/state";
  import {
    Calendar,
    RefreshCw,
    DoorOpen,
    House,
    FolderOpen,
  } from "@lucide/svelte";
  import { browser } from "$app/environment";

  import "../app.css";

  const navLinks = [
    { href: "/", label: "Home", icon: House },
    { href: "/meetings", label: "Our Meetings", icon: Calendar },
    { href: "/cpw", label: "Project Week", icon: FolderOpen },
    { href: "/free-rooms", label: "Free Rooms", icon: DoorOpen },
  ];

  let { children } = $props();

  let todayString = $state<string>();
  const activePath = $derived(page.url.pathname);

  if (browser) {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    todayString = "Today is " + today.toLocaleDateString(undefined, options);
  }

  // Inactivity and random page switching logic
  if (browser) {
    let inactivityTimeout: ReturnType<typeof setTimeout>;
    let switchInterval: ReturnType<typeof setInterval>;
    let lastInteraction = Date.now();

    const navHrefs = navLinks.map((l) => l.href);

    function resetInactivity() {
      lastInteraction = Date.now();
      clearTimeout(inactivityTimeout);
      clearInterval(switchInterval);
      inactivityTimeout = setTimeout(startSwitching, 60000); // 1 min
    }

    function startSwitching() {
      switchInterval = setInterval(() => {
        // Pick a random page different from current
        const current = window.location.pathname;
        const choices = navHrefs.filter((h) => h !== current);
        if (choices.length > 0) {
          const next = choices[Math.floor(Math.random() * choices.length)];
          window.location.href = next;
        }
      }, 60000); // every 1 min
    }

    // Listen for user activity
    ["mousemove", "keydown", "mousedown", "touchstart", "scroll"].forEach(
      (evt) => {
        window.addEventListener(evt, resetInactivity, { passive: true });
      },
    );
    inactivityTimeout = setTimeout(startSwitching, 60000);
  }
</script>

<svelte:head>
  <title>CS Club Digital Poster</title>
  <link rel="manifest" href="/manifest.json" />
</svelte:head>

<div class="grid grid-cols-[auto_1fr] h-screen w-screen">
  <div class="flex flex-col items-start bg-slate-800 w-[18rem] text-white p-8">
    <h2 class="text-3xl mb-4 font-semibold">CS Club Digital Poster</h2>
    <div class="mb-8 text-lg text-slate-100">{todayString}</div>
    <div class="flex flex-col gap-4 w-full">
      {#each navLinks as link}
        {@const active = activePath === link.href}
        <a
          href={link.href}
          class="grid grid-cols-[auto_1fr] justify-between items-center p-4 w-full bg-slate-500 gap-3 rounded-lg border-1 border-solid border-slate-400 {active
            ? 'text-gray-300'
            : ''}"
        >
          <link.icon size={32} />
          <span class="text-xl text-center w-full font-medium"
            >{link.label}</span
          >
        </a>
      {/each}
    </div>
    <div class="mt-auto">
      <button
        onclick={(e) => {
          e.currentTarget.style.animation = "spin 1s linear infinite";
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }}
        class="p-2 hover:bg-slate-700 transition-colors duration-200 rounded"
      >
        <RefreshCw size={24} />
      </button>
    </div>
  </div>

  <div class="w-full h-full overflow-hidden">
    {@render children()}
  </div>
</div>

<style>
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
