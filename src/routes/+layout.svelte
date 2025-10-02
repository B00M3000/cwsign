<script lang="ts">
  import { page } from "$app/state";
  import {
    Calendar,
    RefreshCw,
    DoorOpen,
    House,
    FolderOpen,
    Timer,
    ForkKnife,
  } from "@lucide/svelte";
  import { browser } from "$app/environment";

  import "../app.css";

  const navLinks = [
    { href: "/", label: "Home", icon: House },
    { href: "/meetings", label: "Our Meetings", icon: Calendar },
    { href: "/cpw", label: "Project Week", icon: FolderOpen },
    { href: "/free-rooms", label: "Free Rooms", icon: DoorOpen },
    { href: "/lunch-menu", label: "Lunch Menu", icon: ForkKnife },
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
          class="nav-button grid grid-cols-[auto_1fr] justify-between items-center p-4 w-full gap-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl {active
            ? 'active'
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
        class="refresh-button p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
      >
        <RefreshCw size={24} />
      </button>

      <div
        class="countdown-display text-slate-200 px-2 py-1 rounded-xl flex items-center gap-2 shadow-lg"
      >
        <Timer size={20}/>
        <span class="text-base mt-[3px]">{countdown}s</span>
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

  .nav-button {
    background: linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #0f766e 100%);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: white;
    text-decoration: none;
    position: relative;
    overflow: hidden;
  }

  .nav-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  .nav-button:hover::before {
    left: 100%;
  }

  .nav-button:hover {
    background: linear-gradient(135deg, #1e3a8a 0%, #0e7490 50%, #134e4a 100%);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .nav-button.active {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  }

  .refresh-button {
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: white;
  }

  .refresh-button:hover {
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .countdown-display {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
