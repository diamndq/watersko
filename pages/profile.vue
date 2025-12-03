<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">👤 User Profile</h1>
        <p class="text-gray-600">Manage your account and role-based capabilities</p>
      </div>

      <!-- Login/Demo section -->
      <div v-if="!currentUser" class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">Welcome to WaterSKO</h2>
        <p class="text-gray-600 mb-6">
          Choose your role to access different features and capabilities:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            @click="loginAsRole('guest')"
            class="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 hover:bg-blue-100 transition cursor-pointer"
          >
            <div class="text-4xl mb-2">👤</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Guest</h3>
            <p class="text-sm text-gray-600 mb-4">
              Read water body info, leave reviews, view data
            </p>
            <div class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold text-center">
              Continue as Guest
            </div>
          </div>

          <div
            @click="loginAsRole('activist')"
            class="bg-green-50 border-2 border-green-300 rounded-lg p-6 hover:bg-green-100 transition cursor-pointer"
          >
            <div class="text-4xl mb-2">🌿</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Activist</h3>
            <p class="text-sm text-gray-600 mb-4">
              Mark cleanup status, create events, organize actions
            </p>
            <div class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold text-center">
              Continue as Activist
            </div>
          </div>

          <div
            @click="loginAsRole('researcher')"
            class="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 hover:bg-purple-100 transition cursor-pointer"
          >
            <div class="text-4xl mb-2">🎓</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Researcher</h3>
            <p class="text-sm text-gray-600 mb-4">
              Add measurements, export data, access scientific tools
            </p>
            <div class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold text-center">
              Continue as Researcher
            </div>
          </div>
        </div>
      </div>

      <!-- User logged in view -->
      <div v-else class="space-y-6">
        <!-- Profile card -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-4xl mb-2">{{ getRoleEmoji(currentUser.role) }}</div>
              <h2 class="text-3xl font-bold">{{ currentUser.name }}</h2>
              <p class="text-blue-100 text-lg mt-1">{{ getRoleTitle(currentUser.role) }}</p>
              <p class="text-blue-100 text-sm">{{ currentUser.email }}</p>
            </div>
            <button
              @click="logout"
              class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Capabilities section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Your Capabilities</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- All users can -->
            <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
              <div class="text-lg font-bold text-gray-900 mb-3">✓ All Users</div>
              <ul class="space-y-2 text-sm text-gray-700">
                <li>✓ View water bodies on map</li>
                <li>✓ Check water quality ratings</li>
                <li>✓ View scientific measurements</li>
                <li>✓ Leave reviews and comments</li>
              </ul>
            </div>

            <!-- Activist specific -->
            <div
              :class="{
                'bg-green-50 border-green-600': currentUser.role === 'activist',
                'bg-gray-100 border-gray-300': currentUser.role !== 'activist',
              }"
              class="rounded-lg p-4 border-l-4 transition"
            >
              <div class="text-lg font-bold mb-3" :class="currentUser.role === 'activist' ? 'text-gray-900' : 'text-gray-500'">
                🌿 Activist Features
              </div>
              <ul class="space-y-2 text-sm" :class="currentUser.role === 'activist' ? 'text-gray-700' : 'text-gray-400'">
                <li>✓ Create cleanup events</li>
                <li>✓ Mark cleanup status</li>
                <li>✓ Organize ecological actions</li>
                <li>✓ Join community initiatives</li>
              </ul>
              <div v-if="currentUser.role !== 'activist'" class="mt-3">
                <button
                  @click="switchRole('activist')"
                  class="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold"
                >
                  Switch to Activist
                </button>
              </div>
            </div>

            <!-- Researcher specific -->
            <div
              :class="{
                'bg-purple-50 border-purple-600': currentUser.role === 'researcher',
                'bg-gray-100 border-gray-300': currentUser.role !== 'researcher',
              }"
              class="rounded-lg p-4 border-l-4 transition"
            >
              <div class="text-lg font-bold mb-3" :class="currentUser.role === 'researcher' ? 'text-gray-900' : 'text-gray-500'">
                🎓 Researcher Features
              </div>
              <ul class="space-y-2 text-sm" :class="currentUser.role === 'researcher' ? 'text-gray-700' : 'text-gray-400'">
                <li>✓ Add hydrological measurements</li>
                <li>✓ Access scientific data</li>
                <li>✓ Export reports (CSV/PDF)</li>
                <li>✓ Analyze water trends</li>
              </ul>
              <div v-if="currentUser.role !== 'researcher'" class="mt-3">
                <button
                  @click="switchRole('researcher')"
                  class="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-semibold"
                >
                  Switch to Researcher
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">📊 Your Activity</h3>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-3xl font-bold text-blue-600">{{ userStats.reviewsSubmitted }}</div>
              <div class="text-sm text-gray-600 mt-1">Reviews</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-3xl font-bold text-green-600">{{ userStats.eventsAttended }}</div>
              <div class="text-sm text-gray-600 mt-1">Events Attended</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-3xl font-bold text-purple-600">{{ userStats.measurementsAdded }}</div>
              <div class="text-sm text-gray-600 mt-1">Measurements</div>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <div class="text-3xl font-bold text-yellow-600">{{ userStats.cleanupHours }}</div>
              <div class="text-sm text-gray-600 mt-1">Cleanup Hours</div>
            </div>
          </div>
        </div>

        <!-- Recent activity -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h3>

          <div class="space-y-3">
            <div class="flex items-center gap-4 pb-3 border-b">
              <div class="text-2xl">💬</div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900">Left a review</div>
                <div class="text-sm text-gray-600">Imantau Lake - 2 hours ago</div>
              </div>
            </div>
            <div class="flex items-center gap-4 pb-3 border-b">
              <div class="text-2xl">🌱</div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900">Joined cleanup event</div>
                <div class="text-sm text-gray-600">Shalkar Lake - May 26, 2025</div>
              </div>
            </div>
            <div class="flex items-center gap-4 pb-3 border-b">
              <div class="text-2xl">🧪</div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900">Added measurement</div>
                <div class="text-sm text-gray-600">Ishim River - May 24, 2025</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Back button -->
        <div>
          <NuxtLink
            to="/"
            class="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            ← Back to Map
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { User, UserRole } from '~/types/models'

// Current user state
const currentUser = ref<User | null>(null)

// Mock user stats
const userStats = ref({
  reviewsSubmitted: 5,
  eventsAttended: 3,
  measurementsAdded: 12,
  cleanupHours: 8,
})

const getRoleEmoji = (role: UserRole): string => {
  switch (role) {
    case 'guest':
      return '👤'
    case 'activist':
      return '🌿'
    case 'researcher':
      return '🎓'
    default:
      return '👤'
  }
}

const getRoleTitle = (role: UserRole): string => {
  switch (role) {
    case 'guest':
      return 'Guest User'
    case 'activist':
      return 'Eco-Activist'
    case 'researcher':
      return 'Researcher'
    default:
      return 'User'
  }
}

const loginAsRole = (role: UserRole) => {
  currentUser.value = {
    id: Math.floor(Math.random() * 1000),
    email: `user@watersko.kz`,
    name: role === 'researcher' ? 'Dr. Aidar K.' : role === 'activist' ? 'Aisulu N.' : 'Guest User',
    role: role,
    createdAt: new Date(),
  }
}

const switchRole = (newRole: UserRole) => {
  if (currentUser.value) {
    currentUser.value.role = newRole
  }
}

const logout = () => {
  currentUser.value = null
}
</script>
