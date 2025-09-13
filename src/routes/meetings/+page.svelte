<script lang="ts">
  import { onMount } from 'svelte';
  import { loadMeetingsConfig, type Meeting } from '$lib/config';
  
  let meetings: Meeting[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const config = await loadMeetingsConfig();
      meetings = config.meetings;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load meetings';
      console.error('Failed to load meetings:', err);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function isToday(dateString: string) {
    const today = new Date();
    const meetingDate = new Date(dateString);
    return today.toDateString() === meetingDate.toDateString();
  }
</script>

<div class="meetings-content">
  <h3>Upcoming Meetings</h3>
  
  {#if loading}
    <div class="loading">Loading meetings...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else}
    {#each meetings as meeting}
      <div class="meeting" class:today={isToday(meeting.date)}>
        <strong>{meeting.title}</strong>
        <div class="presenter">Presenter: {meeting.presenter}</div>
        <div class="meeting-date">{formatDate(meeting.date)}</div>
        <div class="desc">{meeting.description}</div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .meetings-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }
  .meetings-content h3 {
    margin-top: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }
  .meeting {
    margin-top: 12px;
    padding: 12px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    font-size: 13px;
    line-height: 1.5;
    border-left: 4px solid transparent;
  }
  .meeting.today {
    border-left: 4px solid #38bdf8;
    background: #e0f2fe;
  }
  .meeting strong {
    display: block;
    font-size: 15px;
    margin-bottom: 4px;
    color: #0f172a;
  }
  .meeting .presenter {
    font-weight: 500;
    color: #334155;
  }
  .meeting .meeting-date {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
  }
  .meeting .desc {
    color: #475569;
  }
  .loading {
    text-align: center;
    color: #64748b;
    font-style: italic;
    padding: 20px;
  }
  .error {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #dc2626;
    padding: 12px;
    border-radius: 6px;
    margin-top: 12px;
  }
</style>
