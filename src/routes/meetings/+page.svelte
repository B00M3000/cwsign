<script lang="ts">
  import { onMount } from "svelte";
  import { loadMeetingsConfig, type Meeting } from "$lib/config";

  let meetings: Meeting[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const config = await loadMeetingsConfig();
      meetings = config.meetings;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load meetings";
      console.error("Failed to load meetings:", err);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
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

    upcomingMeetings = upcomingMeetings.filter((m) => !isToday(m.date));

    // Sort upcoming meetings by date and get the first one
    const sortedUpcoming = [...upcomingMeetings].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return meeting.id === sortedUpcoming[0].id;
  }

  $: upcomingMeetings = meetings.filter(
    (meeting) => !isPastMeeting(meeting.date),
  );
  $: pastMeetings = meetings.filter((meeting) => isPastMeeting(meeting.date));
</script>

<div class="meetings-content h-screen overflow-y-auto p-12">
  <h3 class="text-2xl font-semibold text-slate-800 mb-4">Upcoming Meetings</h3>

  {#if loading}
    <div class="text-center text-slate-500 italic py-5">
      Loading meetings...
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-300 text-red-700 p-4 rounded mt-3">
      Error: {error}
    </div>
  {:else}
    {#if upcomingMeetings.length > 0}
      {#each upcomingMeetings as meeting}
        <div
          class="meeting rounded-lg shadow-md p-4 mb-4 border-l-4 relative"
          class:!bg-green-50={isToday(meeting.date)}
          class:!border-green-300={isToday(meeting.date)}
          class:!bg-yellow-50={isNextMeeting(meeting, upcomingMeetings) &&
            !isToday(meeting.date)}
          class:!border-yellow-300={isNextMeeting(meeting, upcomingMeetings) &&
            !isToday(meeting.date)}
          class:!bg-blue-50={!isToday(meeting.date) &&
            !isNextMeeting(meeting, upcomingMeetings)}
          class:!border-blue-300={!isToday(meeting.date) &&
            !isNextMeeting(meeting, upcomingMeetings)}
        >
          <strong class="block text-lg font-bold text-slate-900 mb-2"
            >{meeting.title}</strong
          >
          <div class="text-base text-slate-600">
            Presenter: {meeting.presenter}
          </div>
          <div class="text-base text-green-600 mb-1">Room: {meeting.room}</div>
          <div class="text-sm text-slate-500 mb-2">
            {formatDate(meeting.date)}
          </div>
          <div class="text-base text-slate-700">{meeting.description}</div>
          {#if isToday(meeting.date)}
            <div
              class="absolute top-[-8px] right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide"
            >
              Today
            </div>
          {/if}
          {#if isNextMeeting(meeting, upcomingMeetings) && !isToday(meeting.date)}
            <div
              class="absolute top-[-8px] right-3 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide"
            >
              Next Meeting
            </div>
          {/if}
        </div>
      {/each}
    {:else}
      <div class="text-center text-slate-500 italic py-5">
        No upcoming meetings scheduled.
      </div>
    {/if}

    <h3 class="text-2xl font-semibold text-slate-800 mt-8 mb-4">
      Past Meetings
    </h3>

    {#if pastMeetings.length > 0}
      {#each pastMeetings.toReversed() as meeting}
        <div
          class="meeting bg-gray-50 rounded-lg shadow-md p-4 mb-4 border-l-4 border-gray-300 opacity-70"
        >
          <strong class="block text-lg font-bold text-slate-900 mb-2"
            >{meeting.title}</strong
          >
          <div class="text-sm text-slate-600">
            Presenter: {meeting.presenter}
          </div>
          <div class="text-sm text-green-600 mb-1">Room: {meeting.room}</div>
          <div class="text-xs text-slate-500 mb-2">
            {formatDate(meeting.date)}
          </div>
          <div class="text-sm text-slate-700">{meeting.description}</div>
        </div>
      {/each}
    {:else}
      <div class="text-center text-slate-500 italic py-5">
        No past meetings.
      </div>
    {/if}
  {/if}
</div>
