<template>
  <div
    v-if="waterBody"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 max-sm:inset-0"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-sm:mx-2 overflow-hidden"
    >
      <!-- Header with status badge -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-2xl font-bold">{{ waterBody.name }}</h2>
          <span :class="statusBadgeClass">{{ statusEmoji }}</span>
        </div>
        <p class="text-blue-100 text-sm">{{ waterBody.description }}</p>
      </div>

      <!-- Main content -->
      <div class="p-6 space-y-4">
        <!-- Rating -->
        <div class="flex items-center justify-between border-b pb-3">
          <div>
            <div class="font-semibold text-lg">
              ⭐ {{ waterBody.rating }} / 5
            </div>
            <div class="text-xs text-gray-500">
              {{ waterBody.reviewCount }} reviews
            </div>
          </div>
        </div>

        <!-- Water properties -->
<div class="grid grid-cols-2 gap-4">
  <div class="bg-blue-50 p-3 rounded">
    <div class="text-xs text-gray-600 font-semibold">Temperature</div>
    <div class="text-xl font-bold text-blue-600">
      <span v-if="lastRecord">{{ lastRecord.temperature }}°C</span>
      <span v-else class="text-gray-400 text-sm">No data</span>
    </div>
  </div>

  <div class="bg-blue-50 p-3 rounded">
    <div class="text-xs text-gray-600 font-semibold">Transparency</div>
    <div class="text-xl font-bold text-blue-600">
      <span v-if="lastRecord">{{ lastRecord.transparency }} m</span>
      <span v-else class="text-gray-400 text-sm">No data</span>
    </div>
  </div>

  <div class="bg-blue-50 p-3 rounded">
    <div class="text-xs text-gray-600 font-semibold">Conductivity</div>
    <div class="text-xl font-bold text-blue-600">
      <span v-if="lastRecord">{{ lastRecord.conductivity }} μS/cm</span>
      <span v-else class="text-gray-400 text-sm">No data</span>
    </div>
  </div>

  <div class="bg-blue-50 p-3 rounded">
    <div class="text-xs text-gray-600 font-semibold">Bio. Risk</div>
    <div class="text-xl font-bold text-blue-600 capitalize">
      <span v-if="lastRecord">{{ lastRecord.risk }}</span>
      <span v-else class="text-gray-400 text-sm">No data</span>
    </div>
  </div>
</div>

        <!-- Action buttons -->
        <div class="flex flex-col gap-2 pt-2">
          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            📊 View Reports
          </button>
          <button
            class="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded transition"
          >
            💬 Leave a Review
          </button>
          <button
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
          >
            🤝 Want to Help
          </button>
        </div>

        <!-- Close button -->
        <button
          @click="emit('close')"
          class="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { WaterBody } from '~/types/models'

interface LakeRecord {
  id: number
  date: string
  temperature: number
  transparency: number
  conductivity: number
  risk: string
  lakeId: number
}


interface Props {
  waterBody: WaterBody | null
}

const props = withDefaults(defineProps<Props>(), {
  waterBody: null,
})

const emit = defineEmits<{
  close: []
}>()
const lastRecord = ref<LakeRecord | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const API_BASE = 'http://localhost:8000'

const loadLastRecord = async () => {
  if (!props.waterBody) {
    lastRecord.value = null
    return
  }

  loading.value = true
  error.value = null

  try {
    // 1. Берём ВСЕ измерения (ты уже используешь этот эндпоинт на странице Scientific Data)
    const res = await fetch(`${API_BASE}/data/records`)
    const data = await res.json() as any[]

    // 2. Фильтруем по lakeId текущего водоёма
    const recordsForLake = data
      .filter(r => r.lakeId === props.waterBody!.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 3. Берём самое свежее (первое после сортировки)
    lastRecord.value = recordsForLake[0] ?? null
  } catch (e: any) {
    console.error('Failed to load latest record for lake', e)
    error.value = 'Failed to load latest measurements'
    lastRecord.value = null
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  if (props.waterBody) {
    loadLastRecord()
  }
})

watch(
  () => props.waterBody?.id,
  () => {
    if (props.waterBody) {
      loadLastRecord()
    } else {
      lastRecord.value = null
    }
  }
)

const statusEmoji = computed(() => {
  if (!props.waterBody) return ''
  switch (props.waterBody.status) {
    case 'clean':
      return '🟢'
    case 'at_risk':
      return '🟡'
    case 'polluted':
      return '🔴'
    default:
      return '⚪'
  }
})

const statusBadgeClass = computed(() => {
  if (!props.waterBody) return ''
  const baseClass = 'px-3 py-1 rounded-full text-sm font-semibold'
  switch (props.waterBody.status) {
    case 'clean':
      return `${baseClass} bg-green-200 text-green-800`
    case 'at_risk':
      return `${baseClass} bg-yellow-200 text-yellow-800`
    case 'polluted':
      return `${baseClass} bg-red-200 text-red-800`
    default:
      return `${baseClass} bg-gray-200 text-gray-800`
  }
})
</script>
