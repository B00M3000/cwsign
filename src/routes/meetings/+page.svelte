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
    const date = new Date(dateString);
    if(!isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return dateString;
  }

  function isToday(dateString: string) {
    const today = new Date();
    const meetingDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    meetingDate.setHours(0, 0, 0, 0);
    return today.toDateString() === meetingDate.toDateString();
  }

  function isPastMeeting(dateString: string) {
    const today = new Date();
    const meetingDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate < today;
  }

  function isNextMeeting(meeting: Meeting, upcomingMeetings: Meeting[]) {
    if (upcomingMeetings.length === 0) return false;

    upcomingMeetings = upcomingMeetings.filter(m => !isToday(m.date));

    // Sort upcoming meetings by date and get the first one
    const sortedUpcoming = [...upcomingMeetings].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return meeting.id === sortedUpcoming[0].id;
  }

  $: upcomingMeetings = meetings.filter(meeting => !isPastMeeting(meeting.date));
  $: pastMeetings = meetings.filter(meeting => isPastMeeting(meeting.date));
</script>

<div class="meetings-content h-screen">
  <h3>Upcoming Meetings</h3>

  {#if loading}
    <div class="loading">Loading meetings...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else}
    {#if upcomingMeetings.length > 0}
      {#each upcomingMeetings as meeting}
        <div class="meeting"
             class:today={isToday(meeting.date)}
             class:next={isNextMeeting(meeting, upcomingMeetings)}>
          <strong>{meeting.title}</strong>
          <div class="presenter">Presenter: {meeting.presenter}</div>
          <div class="room">Room: {meeting.room}</div>
          <div class="meeting-date">{formatDate(meeting.date)}</div>
          <div class="desc">{meeting.description}</div>
        </div>
      {/each}
    {:else}
      <div class="no-meetings">No upcoming meetings scheduled.</div>
    {/if}

    <h3>Past Meetings</h3>

    {#if pastMeetings.length > 0}
      {#each pastMeetings as meeting}
        <div class="meeting past">
          <strong>{meeting.title}</strong>
          <div class="presenter">Presenter: {meeting.presenter}</div>
          <div class="room">Room: {meeting.room}</div>
          <div class="meeting-date">{formatDate(meeting.date)}</div>
          <div class="desc">{meeting.description}</div>
        </div>
      {/each}
    {:else}
      <div class="no-meetings">No past meetings.</div>
    {/if}
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
    margin-bottom: 16px;
  }
  .meetings-content h3:not(:first-of-type) {
    margin-top: 32px;
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
    border-left: 4px solid #10b981;
    background: linear-gradient(135deg, #d1fae5 0%, #34d399 100%);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    position: relative;
  }
  .meeting.today::before {
    content: "Today";
    position: absolute;
    top: -8px;
    right: 12px;
    background: #10b981;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .meeting.today strong {
    color: #047857;
  }
  .meeting.next {
    border-left: 4px solid #f59e0b;
    background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    position: relative;
  }
  .meeting.next::before {
    content: "Next Meeting";
    position: absolute;
    top: -8px;
    right: 12px;
    background: #f59e0b;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .meeting.next strong {
    color: #92400e;
  }
  .meeting.past {
    opacity: 0.7;
    background: #f8fafc;
    border-left: 4px solid #94a3b8;
  }
  .meeting strong {
    display: block;
    font-size: 15px;
    margin-bottom: 8px;
    color: #0f172a;
  }
  .meeting .presenter {
    font-weight: 500;
    color: #334155;
  }
  .meeting .room {
    font-weight: 500;
    color: #059669;
    margin-bottom: 2px;
  }
  .meeting .meeting-date {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 16px;
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
  .no-meetings {
    text-align: center;
    color: #64748b;
    font-style: italic;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
    margin-top: 12px;
  }
</style>
