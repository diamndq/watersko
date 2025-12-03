<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">💬 Resident Reviews</h1>
        <p class="text-gray-600">Community feedback and observations about water bodies</p>
      </div>

      <!-- Water body selector -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Select Water Body
        </label>
        <select
          v-model="selectedWaterBodyId"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option :value="null">All Water Bodies</option>
          <option
            v-for="body in waterBodies"
            :key="body.id"
            :value="body.id"
          >
            {{ body.name }}
          </option>
        </select>
      </div>

      <!-- Add review button -->
      <button
        @click="showReviewForm = !showReviewForm"
        class="mb-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition"
      >
        {{ showReviewForm ? '✕ Close' : '✏️ Leave a Review' }}
      </button>

      <!-- Review form (collapsible) -->
      <div
        v-if="showReviewForm"
        class="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-blue-600"
      >
        <h2 class="text-xl font-bold mb-4">Share Your Observation</h2>

        <!-- Water body selection for review -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Which water body?
          </label>
          <select
            v-model="newReview.lakeId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option :value="0">Select a water body...</option>
            <option
              v-for="body in waterBodies"
              :key="body.id"
              :value="body.id"
            >
              {{ body.name }}
            </option>
          </select>
        </div>

        <!-- Star rating -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Rating
          </label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              @click="newReview.rating = star"
              class="text-3xl transition hover:scale-110"
            >
              {{ star <= newReview.rating ? '⭐' : '☆' }}
            </button>
          </div>
        </div>

        <!-- Comment text -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Your Comment
          </label>
          <textarea
            v-model="newReview.comment"
            placeholder="Share your observations..."
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Photo upload (future) -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            📸 Photos (coming soon)
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
            Photo upload functionality will be available soon
          </div>
        </div>

        <!-- Submit button -->
        <button
          @click="submitReview"
          class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ✓ Submit Review
        </button>
      </div>

      <!-- Reviews list -->
      <div class="space-y-4">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="bg-white rounded-lg shadow p-6 border-l-4"
          :class="getReviewBorderClass(review.rating)"
        >
          <!-- Review header -->
          <div class="flex items-center justify-between mb-3">
            <div>
              <div class="font-semibold text-gray-900">
                {{ review.userName }}
              </div>
              <div class="text-sm text-gray-600">
                {{ getWaterBodyName(review.lakeId) }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg">
                {{ '⭐'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}
              </div>
              <div class="text-xs text-gray-500">
                {{ formatDate(review.createdAt) }}
              </div>
            </div>
          </div>

          <!-- Review comment -->
          <p class="text-gray-700">{{ review.comment }}</p>

          <!-- Photos placeholder -->
          <div v-if="review.photos && review.photos.length > 0" class="mt-3">
            <div class="flex gap-2 flex-wrap">
              <div
                v-for="(photo, index) in review.photos"
                :key="index"
                class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"
              >
                🖼 Photo
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredReviews.length === 0" class="text-center py-12">
          <div class="text-gray-500 text-lg">
            No reviews yet. Be the first to share your observation!
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
import type { Review } from '~/types/models'
import { useWaterBodies } from '~/composables/useWaterBodies'

const { waterBodies } = useWaterBodies()

// Reviews data (will be replaced with API calls)
const reviews = ref<Review[]>([
  {
    id: 1,
    lakeId: 1,
    userId: 1,
    userName: 'Aisulu K.',
    rating: 3,
    comment: 'The water is cloudy, there\'s a lot of trash near the beach. The situation has gotten worse over the past year.',
    photos: [],
    createdAt: new Date('2025-05-15'),
  },
  {
    id: 2,
    lakeId: 2,
    userId: 2,
    userName: 'Bекторов М.',
    rating: 5,
    comment: 'Beautiful area, water is clear and clean. Great for swimming and fishing.',
    photos: [],
    createdAt: new Date('2025-05-14'),
  },
  {
    id: 3,
    lakeId: 1,
    userId: 3,
    userName: 'Almira N.',
    rating: 2,
    comment: 'The water smells bad and has a strange color. Concerned about aquatic life.',
    photos: [],
    createdAt: new Date('2025-05-12'),
  },
  {
    id: 4,
    lakeId: 3,
    userId: 4,
    userName: 'Kairat D.',
    rating: 3,
    comment: 'Mixed observations. Some areas are clean but there\'s visible pollution in other spots.',
    photos: [],
    createdAt: new Date('2025-05-10'),
  },
  {
    id: 5,
    lakeId: 4,
    userId: 1,
    userName: 'Aisulu K.',
    rating: 4,
    comment: 'Good condition. Transparency is decent. Only minor litter observed.',
    photos: [],
    createdAt: new Date('2025-05-08'),
  },
])

// State
const selectedWaterBodyId = ref<number | null>(null)
const showReviewForm = ref(false)
const newReview = ref<Partial<Review>>({
  lakeId: 0,
  rating: 5,
  comment: '',
  userName: 'Anonymous',
})

const getWaterBodyName = (id: number): string => {
  return waterBodies.value.find((b) => b.id === id)?.name || 'Unknown'
}

const filteredReviews = computed(() => {
  if (!selectedWaterBodyId.value) {
    return [...reviews.value].reverse() // Most recent first
  }
  return reviews.value
    .filter((r) => r.lakeId === selectedWaterBodyId.value)
    .reverse()
})

const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getReviewBorderClass = (rating: number): string => {
  if (rating >= 4) return 'border-green-500'
  if (rating >= 3) return 'border-yellow-500'
  return 'border-red-500'
}

const submitReview = () => {
  if (newReview.value.lakeId === 0) {
    alert('Please select a water body')
    return
  }
  if (!newReview.value.comment || newReview.value.comment.trim().length === 0) {
    alert('Please write a comment')
    return
  }

  // Create new review
  const review: Review = {
    id: Math.max(...reviews.value.map((r) => r.id)) + 1,
    lakeId: newReview.value.lakeId as number,
    userId: 1, // TODO: Use actual logged-in user
    userName: newReview.value.userName || 'Anonymous',
    rating: newReview.value.rating || 5,
    comment: newReview.value.comment,
    photos: [],
    createdAt: new Date(),
  }

  reviews.value.push(review)

  // Reset form
  newReview.value = {
    lakeId: 0,
    rating: 5,
    comment: '',
    userName: 'Anonymous',
  }
  showReviewForm.value = false
}
</script>
