<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">🌱 Eco-Activism Hub</h1>
        <p class="text-gray-600">Join community efforts to restore and protect water resources</p>
      </div>

      <!-- Action buttons -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <!-- Create event button -->
        <button
          @click="showEventForm = !showEventForm"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition text-lg"
        >
          📅 {{ showEventForm ? '✕ Cancel' : '+ Create Cleanup Event' }}
        </button>

        <!-- Random spot button -->
        <button
          @click="pickRandomSpot"
          class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-semibold transition text-lg"
        >
          🎲 Random Problematic Spot
        </button>
      </div>

      <!-- Random spot display -->
      <div
        v-if="randomSpot"
        class="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-lg p-6 mb-8"
      >
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-2">🎯 Need Your Help!</h2>
          <p class="text-lg mb-4">{{ randomSpot.name }} needs attention</p>
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div class="text-sm opacity-90">Status</div>
              <div class="text-xl font-bold">{{ randomSpot.status }}</div>
            </div>
            <div>
              <div class="text-sm opacity-90">Rating</div>
              <div class="text-xl font-bold">{{ randomSpot.rating }}/5</div>
            </div>
            <div>
              <div class="text-sm opacity-90">Coordinates</div>
              <div class="text-xl font-bold">{{ randomSpot.lat }}, {{ randomSpot.lng }}</div>
            </div>
          </div>
          <button
            @click="markAsGoing(randomSpot)"
            class="bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition"
          >
            ✓ I'm Going to Clean This!
          </button>
        </div>
      </div>

      <!-- Create event form -->
      <div v-if="showEventForm" class="bg-white rounded-lg shadow p-6 mb-8 border-l-4 border-green-600">
        <h2 class="text-xl font-bold mb-4">Create Cleanup Event</h2>

        <!-- Water body selection -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <select
            v-model="newEvent.lakeId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option :value="0">Select a water body...</option>
            <option
              v-for="body in pollutedBodies"
              :key="body.id"
              :value="body.id"
            >
              {{ body.name }}
            </option>
          </select>
        </div>

        <!-- Event date -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Date
          </label>
          <input
            v-model="newEvent.date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Event description -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="newEvent.description"
            placeholder="What needs to be done? (e.g., remove trash, restore vegetation)"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Submit button -->
        <button
          @click="createEvent"
          class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ✓ Create Event
        </button>
      </div>

      <!-- Events list -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Active Cleanup Events</h2>

        <div
          v-for="event in ecoActions"
          :key="event.id"
          class="bg-white rounded-lg shadow p-6 border-l-4 border-green-600"
        >
          <!-- Event header -->
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-lg font-bold text-gray-900">
                🧹 Cleaning {{ getWaterBodyName(event.lakeId) }}
              </h3>
              <p class="text-sm text-gray-600">{{ event.description }}</p>
            </div>
            <div :class="getStatusBadgeClass(event.status)">
              {{ getStatusText(event.status) }}
            </div>
          </div>

          <!-- Event details -->
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="bg-blue-50 p-3 rounded">
              <div class="text-xs text-gray-600 font-semibold">📅 Date</div>
              <div class="text-sm font-bold text-blue-600">
                {{ formatDate(event.date) }}
              </div>
            </div>
            <div class="bg-blue-50 p-3 rounded">
              <div class="text-xs text-gray-600 font-semibold">👥 Participants</div>
              <div class="text-sm font-bold text-blue-600">
                {{ event.participantsCount }} people
              </div>
            </div>
            <div class="bg-blue-50 p-3 rounded">
              <div class="text-xs text-gray-600 font-semibold">🎯 Type</div>
              <div class="text-sm font-bold text-blue-600">
                {{ event.actionType }}
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-2 flex-wrap">
            <button
              v-if="event.status === 'planned'"
              @click="updateEventStatus(event, 'in_progress')"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              ▶ Start Cleanup
            </button>
            <button
              v-if="event.status === 'in_progress'"
              @click="updateEventStatus(event, 'completed')"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              ✓ Mark Completed
            </button>
            <button
              v-if="event.status !== 'completed'"
              @click="joinEvent(event)"
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              🤝 I'm Going!
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="ecoActions.length === 0" class="text-center py-12">
          <div class="text-gray-500 text-lg">
            No cleanup events yet. Be the first to create one!
          </div>
        </div>
      </div>

      <!-- Polluted spots list -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">🔴 Spots Needing Attention</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="spot in pollutedBodies"
            :key="spot.id"
            class="bg-red-50 rounded-lg p-4 border-l-4 border-red-600"
          >
            <h3 class="font-bold text-lg text-gray-900">{{ spot.name }}</h3>
            <div class="text-sm text-gray-600 mb-3">{{ spot.description }}</div>
            <div class="flex justify-between items-center mb-3">
              <div>
                <span class="text-sm font-semibold text-gray-700">Rating:</span>
                <span class="ml-2 text-red-600 font-bold">{{ spot.rating }}/5</span>
              </div>
            </div>
            <button
              @click="markAsGoing(spot)"
              class="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
            >
              🚀 Going to Clean
            </button>
          </div>
        </div>
      </div>

      <!-- Back button -->
      <div class="mt-8">
        <NuxtLink
          to="/"
          class="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ← Back to Map
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EcoAction, WaterBody } from '~/types/models'
import { useWaterBodies } from '~/composables/useWaterBodies'

const { waterBodies, pollutedBodies } = useWaterBodies()

// Eco actions data (will be replaced with API calls)
const ecoActions = ref<EcoAction[]>([
  {
    id: 1,
    lakeId: 1,
    userId: 1,
    actionType: 'cleanup',
    status: 'planned',
    date: new Date('2025-05-26'),
    participantsCount: 3,
    description: 'Remove trash and debris from the shore',
    createdAt: new Date(),
  },
  {
    id: 2,
    lakeId: 3,
    userId: 2,
    actionType: 'inspection',
    status: 'in_progress',
    date: new Date('2025-05-25'),
    participantsCount: 2,
    description: 'Water quality survey and sampling',
    createdAt: new Date(),
  },
  {
    id: 3,
    lakeId: 5,
    userId: 3,
    actionType: 'cleanup',
    status: 'completed',
    date: new Date('2025-05-20'),
    participantsCount: 5,
    description: 'Beach cleanup and vegetation restoration',
    createdAt: new Date(),
  },
])

// State
const showEventForm = ref(false)
const randomSpot = ref<WaterBody | null>(null)
const newEvent = ref<Partial<EcoAction>>({
  lakeId: 0,
  date: new Date().toISOString().split('T')[0],
  description: '',
  actionType: 'cleanup',
  status: 'planned',
  participantsCount: 1,
})

const getWaterBodyName = (id: number): string => {
  return waterBodies.value.find((b) => b.id === id)?.name || 'Unknown'
}

const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'planned':
      return '📋 Planned'
    case 'in_progress':
      return '🔄 In Progress'
    case 'completed':
      return '✓ Completed'
    default:
      return status
  }
}

const getStatusBadgeClass = (status: string): string => {
  const baseClass = 'px-3 py-1 rounded-full text-sm font-semibold'
  switch (status) {
    case 'planned':
      return `${baseClass} bg-blue-100 text-blue-800`
    case 'in_progress':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'completed':
      return `${baseClass} bg-green-100 text-green-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const pickRandomSpot = () => {
  if (pollutedBodies.value.length === 0) return
  const randomIndex = Math.floor(Math.random() * pollutedBodies.value.length)
  randomSpot.value = pollutedBodies.value[randomIndex]
}

const createEvent = () => {
  if (newEvent.value.lakeId === 0) {
    alert('Please select a location')
    return
  }
  if (!newEvent.value.date) {
    alert('Please select a date')
    return
  }

  const event: EcoAction = {
    id: Math.max(...ecoActions.value.map((e) => e.id), 0) + 1,
    lakeId: newEvent.value.lakeId as number,
    userId: 1,
    actionType: newEvent.value.actionType as any,
    status: 'planned',
    date: new Date(newEvent.value.date as string),
    participantsCount: 1,
    description: newEvent.value.description || '',
    createdAt: new Date(),
  }

  ecoActions.value.push(event)

  newEvent.value = {
    lakeId: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  }
  showEventForm.value = false
}

const updateEventStatus = (event: EcoAction, newStatus: string) => {
  const index = ecoActions.value.findIndex((e) => e.id === event.id)
  if (index !== -1) {
    ecoActions.value[index].status = newStatus as any
  }
}

const joinEvent = (event: EcoAction) => {
  const index = ecoActions.value.findIndex((e) => e.id === event.id)
  if (index !== -1) {
    ecoActions.value[index].participantsCount += 1
  }
}

const markAsGoing = (spot: WaterBody) => {
  // Check if event already exists for this spot
  const existingEvent = ecoActions.value.find((e) => e.lakeId === spot.id && e.status !== 'completed')
  if (existingEvent) {
    joinEvent(existingEvent)
  } else {
    // Create new event
    const event: EcoAction = {
      id: Math.max(...ecoActions.value.map((e) => e.id), 0) + 1,
      lakeId: spot.id,
      userId: 1,
      actionType: 'cleanup',
      status: 'planned',
      date: new Date(),
      participantsCount: 1,
      description: `Cleanup initiative for ${spot.name}`,
      createdAt: new Date(),
    }
    ecoActions.value.push(event)
  }
  alert(`✓ You've marked "${spot.name}" as a spot you're going to help with!`)
}
</script>
