<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">📊 Scientific Data</h1>
        <p class="text-gray-600">
          Historical hydrological measurements and water condition archives
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Filter by water body -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Water Body
            </label>
            <select
              v-model="selectedWaterBodyId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null">All Bodies</option>
              <option
                v-for="body in availableWaterBodies"
                :key="body.id"
                :value="body.id"
              >
                {{ body.name }}
              </option>
            </select>
          </div>

          <!-- Filter by date range -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              From Date
            </label>
            <input
              v-model="fromDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              To Date
            </label>
            <input
              v-model="toDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Export buttons -->
        <div class="mt-4 flex gap-2 flex-wrap">
          <button
            @click="exportToCSV"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            📥 Export CSV
          </button>
          <button
            @click="exportToPDF"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            📄 Export PDF
          </button>
          <button
            @click="printReport"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            🖨 Print
          </button>
        </div>
      </div>

      <!-- Measurements table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-blue-600 text-white">
              <tr>
                <th class="px-6 py-3 text-left font-semibold cursor-pointer" @click="sortBy('date')">
                  📅 Date
                  <span v-if="sortField === 'date'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="px-6 py-3 text-left font-semibold">🌍 Water Body</th>
                <th class="px-6 py-3 text-left font-semibold cursor-pointer" @click="sortBy('temperature')">
                  🌡 Temp (°C)
                  <span v-if="sortField === 'temperature'" class="ml-1">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="px-6 py-3 text-left font-semibold">👁 Transparency (m)</th>
                <th class="px-6 py-3 text-left font-semibold">⚡ Conductivity (μS/cm)</th>
                <th class="px-6 py-3 text-left font-semibold">☣ Risk Level</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="measurement in filteredAndSortedMeasurements"
                :key="measurement.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-gray-900">
                  {{ formatDate(measurement.createdAt) }}
                </td>
                <td class="px-6 py-4 font-semibold text-gray-900">
                  {{ getWaterBodyName(measurement.lakeId) }}
                </td>
                <td class="px-6 py-4">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {{ measurement.temperature }}
                  </span>
                </td>
                <td class="px-6 py-4">{{ measurement.transparency }}</td>
                <td class="px-6 py-4">{{ measurement.conductivity }}</td>
                <td class="px-6 py-4">
                  <span :class="getRiskLevelClass(measurement.riskLevel)">
                    {{ measurement.riskLevel }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-if="filteredAndSortedMeasurements.length === 0" class="p-8 text-center">
          <div class="text-gray-500 text-lg">No measurements found</div>
        </div>
      </div>

      <!-- Statistics section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-gray-600 text-sm font-semibold">Avg Temperature</div>
          <div class="text-2xl font-bold text-blue-600 mt-2">
            {{ avgTemperature.toFixed(1) }}°C
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-gray-600 text-sm font-semibold">Avg Transparency</div>
          <div class="text-2xl font-bold text-blue-600 mt-2">
            {{ avgTransparency.toFixed(2) }}m
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-gray-600 text-sm font-semibold">Avg Conductivity</div>
          <div class="text-2xl font-bold text-blue-600 mt-2">
            {{ avgConductivity.toFixed(0) }} μS/cm
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-gray-600 text-sm font-semibold">Total Records</div>
          <div class="text-2xl font-bold text-blue-600 mt-2">
            {{ filteredAndSortedMeasurements.length }}
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
import { ref, onMounted, computed } from 'vue'
import { useWaterBodies } from '~/composables/useWaterBodies'

type ApiRecord = {
  id: number
  date: string
  temperature: number
  transparency: number
  conductivity: number
  risk: string
  lakeId: number
  lake: {
    id: number
    name: string
  }
}

// твой тип Measurement (пример — подстрой под свой)
type Measurement = {
  id: number
  lakeId: number
  lakeName: string
  temperature: number
  transparency: number
  conductivity: number
  riskLevel: string
  createdAt: Date
}

const measurements = ref<Measurement[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// use the shared water bodies composable to get lake names
const { waterBodies } = useWaterBodies()


// Sample measurement data (will be replaced with API calls)
onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8000/data/records')
    const data = await res.json() as ApiRecord[]

    measurements.value = data.map((r) => ({
      id: r.id,
      lakeId: r.lakeId,
      lakeName: r.lake.name,          // используем имя озера из БД
      temperature: r.temperature,
      transparency: r.transparency,
      conductivity: r.conductivity,
      riskLevel: r.risk,
      createdAt: new Date(r.date),
    }))
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load data from server'
  } finally {
    loading.value = false
  }
})

// Filter and sort state
const selectedWaterBodyId = ref<number | null>(null)
const fromDate = ref<string>('')
const toDate = ref<string>('')
const sortField = ref<'date' | 'temperature'>('date')
const sortDirection = ref<'asc' | 'desc'>('desc')

const availableWaterBodies = computed(() => waterBodies.value)

const getWaterBodyName = (id: number): string => {
  return waterBodies.value.find((b) => b.id === id)?.name || 'Unknown'
}

const filteredAndSortedMeasurements = computed(() => {
  let result = [...measurements.value]

  // Filter by water body
  if (selectedWaterBodyId.value) {
    result = result.filter((m) => m.lakeId === selectedWaterBodyId.value)
  }

  // Filter by date range
  if (fromDate.value) {
    const from = new Date(fromDate.value)
    result = result.filter((m) => new Date(m.createdAt) >= from)
  }
  if (toDate.value) {
    const to = new Date(toDate.value)
    to.setHours(23, 59, 59, 999)
    result = result.filter((m) => new Date(m.createdAt) <= to)
  }

  // Sort
  result.sort((a, b) => {
    let aVal, bVal
    if (sortField.value === 'date') {
      aVal = new Date(a.createdAt).getTime()
      bVal = new Date(b.createdAt).getTime()
    } else {
      aVal = a.temperature
      bVal = b.temperature
    }

    const direction = sortDirection.value === 'asc' ? 1 : -1
    return (aVal - bVal) * direction
  })

  return result
})

const sortBy = (field: 'date' | 'temperature') => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Statistics
const avgTemperature = computed(() => {
  const temps = filteredAndSortedMeasurements.value.map((m) => m.temperature)
  return temps.length > 0
    ? temps.reduce((a, b) => a + b, 0) / temps.length
    : 0
})

const avgTransparency = computed(() => {
  const trans = filteredAndSortedMeasurements.value.map((m) => m.transparency)
  return trans.length > 0
    ? trans.reduce((a, b) => a + b, 0) / trans.length
    : 0
})

const avgConductivity = computed(() => {
  const cond = filteredAndSortedMeasurements.value.map((m) => m.conductivity)
  return cond.length > 0
    ? cond.reduce((a, b) => a + b, 0) / cond.length
    : 0
})

const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getRiskLevelClass = (level: string): string => {
  const baseClass = 'px-2 py-1 rounded font-semibold text-sm'
  switch (level) {
    case 'low':
      return `${baseClass} bg-green-100 text-green-800`
    case 'moderate':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'high':
      return `${baseClass} bg-red-100 text-red-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

// Export functions (basic implementations)
const exportToCSV = () => {
  const headers = ['Date', 'Water Body', 'Temperature', 'Transparency', 'Conductivity', 'Risk Level']
  const rows = filteredAndSortedMeasurements.value.map((m) => [
    formatDate(m.createdAt),
    getWaterBodyName(m.lakeId),
    m.temperature,
    m.transparency,
    m.conductivity,
    m.riskLevel,
  ])

  let csv = headers.join(',') + '\n'
  rows.forEach((row) => {
    csv += row.join(',') + '\n'
  })

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'watersko-measurements.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

const exportToPDF = () => {
  alert('PDF export requires a library like jsPDF or pdfkit. Coming soon!')
  // TODO: Implement PDF export
}

const printReport = () => {
  window.print()
}
</script>
