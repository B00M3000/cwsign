<script lang="ts">
  import { page } from "$app/state";
  import {
    Calendar,
    RefreshCw,
    DoorOpen,
    House,
    FolderOpen,
    Timer,
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

  // Configuration - change this to adjust switching time
  const SWITCH_TIME_SECONDS = 60;

  let todayString = $state<string>();
  let countdown = $state<number>(SWITCH_TIME_SECONDS);
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

  // Simple auto-switching logic
  if (browser) {
    let timer: ReturnType<typeof setInterval>;
    const navHrefs = navLinks.map((l) => l.href);

    function startTimer() {
      countdown = SWITCH_TIME_SECONDS;
      timer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          // Switch to random page
          const current = window.location.pathname;
          const choices = navHrefs.filter((h) => h !== current);
          if (choices.length > 0) {
            const next = choices[Math.floor(Math.random() * choices.length)];
            window.location.href = next;
          }
          countdown = SWITCH_TIME_SECONDS;
        }
      }, 1000);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    // Reset timer on user activity
    ["mousemove", "keydown", "mousedown", "touchstart", "scroll"].forEach(
      (evt) => {
        window.addEventListener(evt, resetTimer, { passive: true });
      },
    );

    // Start the timer
    startTimer();
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
    <div class="mt-auto flex justify-between items-center w-full">
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

      <div
        class="text-sm text-slate-300 font-mono bg-slate-700 px-3 py-2 rounded flex items-center gap-2"
      >
        <Timer size={16} />
        {countdown}s
      </div>
    </div>
  </div>

  <div class="w-full h-full overflow-y-auto">
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
