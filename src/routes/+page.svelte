<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import {
    Crown,
    Star,
    Mic,
    Palette,
    Code,
    Users,
    Rocket,
  } from "@lucide/svelte";

  interface TeamMember {
    name: string;
    gradYear?: number;
    badges: (
      | "president"
      | "director"
      | "presenter"
      | "poster"
      | "member"
      | "ROCKETS!"
    )[];
  }

  const teamMembers: TeamMember[] = [
    {
      name: "Thomas",
      gradYear: 2026,
      badges: ["president", "presenter", "poster"],
    },
    { name: "Jacob", gradYear: 2026, badges: ["director", "presenter"] },
    { name: "Nikhil", gradYear: 2027, badges: ["director", "presenter"] },
    { name: "Siri", gradYear: 2027, badges: ["poster"] },
    { name: "Jasmine", gradYear: 2027, badges: ["poster"] },
    { name: "Anand", gradYear: 2029, badges: ["poster"] },
    { name: "Carter", gradYear: 2027, badges: ["poster"] },
    { name: "Ethan", gradYear: 2026, badges: ["presenter"] },
    { name: "Auren", gradYear: 2026, badges: ["ROCKETS!"] },
  ];

  function getBadgeClasses(badge: string): string {
    switch (badge) {
      case "president":
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300";
      case "director":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
      case "presenter":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300";
      case "poster":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300";
      case "ROCKETS!":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300";
      default:
        return "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300";
    }
  }

  function getBadgeIcon(badge: string) {
    switch (badge) {
      case "president":
        return Crown;
      case "director":
        return Star;
      case "presenter":
        return Mic;
      case "poster":
        return Palette;
      case "ROCKETS!":
        return Rocket;
      default:
        return Code;
    }
  }
</script>

<div
  class="flex flex-col items-center w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto"
>
  <div class="text-center space-y-6 max-w-4xl">
    <!-- Main Title -->
    <div class="space-y-2 my-12">
      <h1 class="text-6xl font-bold text-indigo-900 tracking-tight">
        CS Club Digital Poster
      </h1>
      <p class="text-2xl font-semibold text-indigo-700">Version 2.2</p>
      <p class="text-lg mt-8">
        <span class="font-semibold">Designed and Managed by</span><br />
        <span class="text-gray-700 font-bold">Thomas Zhou '26</span>
      </p>
    </div>

    <div
      class="bg-amber-50 border border-amber-200 rounded-lg p-8 text-amber-800"
    >
      <p class="text-base font-medium">
        📢 Other club leaders interested in posting here? Contact Thomas.
      </p>
    </div>

    <!-- Call to Join -->
    <div
      class="bg-white/80 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center shadow-lg border border-indigo-200"
    >
      <p class="text-xl text-gray-800 font-medium mb-4">
        🎉 Brought to you by the CS Club! 🎉
      </p>
      <p class="text-base text-gray-600 max-w-xl">
        Check out the <span class="font-semibold text-indigo-700"
          >Meetings page</span
        > to see when we meet, what topics we discuss, and what we are working on!
      </p>
      <!-- Team Credits -->
      <div class="space-y-4 mt-8">
        <h2 class="text-xl font-bold text-gray-800">Join Us!</h2>
        <div class="flex flex-wrap gap-3 justify-center">
          {#each teamMembers as member}
            <div
              class="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-indigo-200 transition-all duration-200 hover:shadow-xl hover:scale-105"
            >
              <div class="flex items-center space-x-3">
                <div class="flex gap-1">
                  <span class="font-bold text-indigo-900 text-base"
                    >{member.name}</span
                  >
                  {#if member.gradYear}
                    <span class="text-xs text-gray-500 font-medium"
                      >'{member.gradYear.toString().slice(-2)}</span
                    >
                  {/if}
                </div>
                <div class="flex flex-wrap gap-1">
                  {#each member.badges as badge}
                    <span
                      class="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium {getBadgeClasses(
                        badge,
                      )}"
                    >
                      <svelte:component this={getBadgeIcon(badge)} size={12} />
                      <span class="capitalize">{badge}</span>
                    </span>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Projects in the Works -->
    <div
      class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-200"
    >
      <h2 class="text-2xl font-bold mb-4">🚀 Projects in the Works</h2>
      <div class="space-y-4 text-left">
        <div class="flex items-start space-x-3">
          <span class="text-2xl">📋</span>
          <div>
            <h3 class="font-semibold text-gray-800">Digital Club Room Board</h3>
            <p class="text-gray-600 text-sm">
              Replacing traditional bulletin boards with modern digital displays
            </p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <span class="text-2xl">🏢</span>
          <div>
            <h3 class="font-semibold text-gray-800">
              Room Reservation & Occupancy System
            </h3>
            <p class="text-gray-600 text-sm">
              Smart system to track and reserve available campus spaces
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Credits -->
    <div class="space-y-3 text-gray-600">
      <p class="text-base">
        <span class="font-medium">Special Thanks to Mr. Hinterlang</span><br />
        for making this possible! 🙏
      </p>
    </div>
  </div>
</div>
