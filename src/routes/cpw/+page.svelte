<script lang="ts">
  import { onMount } from 'svelte';

  let isLoading = $state(true);
  let iframeElement: HTMLIFrameElement;

  function handleIframeLoad() {
    isLoading = false;
  }

  function handleIframeError() {
    isLoading = false;
  }

  onMount(() => {
    const sessionId = "e4609d7f-3641-4688-8993-dd2b152fdb9c";
    iframeElement.src = `https://cpw.tzhou.net/poster?session_id=${sessionId}`;
  });
</script>

<div class="relative w-full h-full">
  <!-- Loading indicator -->
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-slate-600 text-lg font-medium">Loading CPW...</p>
        <p class="text-slate-500 text-sm mt-2">Please wait while the content loads</p>
      </div>
    </div>
  {/if}

  <!-- Iframe -->
  <iframe
    bind:this={iframeElement}
    title="CPW"
    style="width:100%;height:100vh;border:none;"
    onload={handleIframeLoad}
    onerror={handleIframeError}
    class="{isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300"
  ></iframe>
</div>
