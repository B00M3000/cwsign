<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { Image, Calendar, Folders, RefreshCw, DoorOpen, House } from '@lucide/svelte';

  import "../app.css";
    import { browser } from '$app/environment';

  const navLinks = [
    { href: '/', label: 'Home', icon: House },
    { href: '/cpw', label: 'Project Week', icon: Folders },
    { href: '/free-rooms', label: 'Free Rooms', icon: DoorOpen },
    { href: '/meetings', label: 'Our Meetings', icon: Calendar }
  ];

  let { children } = $props();

  let todayString = $state<string>();
  const activePath = $derived(page.url.pathname);

  if(browser) {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    todayString = "Today is " + today.toLocaleDateString(undefined, options);
  }

  
</script>

<svelte:head>
  <title>CS Club Digital Poster</title>
  <link rel="manifest" href="/manifest.json">
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
          class="grid grid-cols-[auto_1fr] justify-between items-center p-4 w-full bg-slate-500 gap-3 rounded-lg border-1 border-solid border-slate-400 {active ? "text-gray-300" : ""}"
        >
          <link.icon size={32} />
          <span class="text-xl text-center w-full font-medium">{link.label}</span>
          <!-- <div class="w-3 h-3 {active ? 'bg-white' : 'bg-transparent'} transition-all duration-200"></div> -->
        </a>
      {/each}
    </div>
    <div class="mt-auto">
      <button
        onclick={(e) => {
          e.currentTarget.style.animation = 'spin 1s linear infinite';
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

  <div class="w-full h-full">
    {@render children()}
  </div>
</div>

<style>
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
