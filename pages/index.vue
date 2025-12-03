<template>
  <ClientOnly>
    <div id="map-page" class="w-screen h-screen overflow-hidden relative">
      <!-- Map container - MUST have explicit height -->
      <div id="map" ref="mapContainer" class="absolute inset-0 w-full h-full" style="background-color: #e4e4e4;"></div>

      <!-- Legend -->
      <div
        class="absolute top-4 left-4 bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg z-10 max-sm:top-2 max-sm:left-2 max-sm:p-3"
      >
        <div class="text-sm font-bold mb-2">Water Status</div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-lg">🟢</span>
            <span class="text-xs">Clean</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-lg">🟡</span>
            <span class="text-xs">At Risk</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-lg">🔴</span>
            <span class="text-xs">Polluted</span>
          </div>
        </div>
      </div>

      <!-- Stats panel -->
      <div
        class="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg z-10 max-sm:top-2 max-sm:right-2 max-sm:p-3 max-sm:text-sm"
      >
        <div class="text-sm font-bold mb-2">📊 Overview</div>
        <div class="space-y-1">
          <div class="flex justify-between gap-4 text-xs">
            <span>🟢 Clean: {{ cleanBodies.length }}</span>
          </div>
          <div class="flex justify-between gap-4 text-xs">
            <span>🟡 At Risk: {{ atRiskBodies.length }}</span>
          </div>
          <div class="flex justify-between gap-4 text-xs">
            <span>🔴 Polluted: {{ pollutedBodies.length }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation menu -->
      <div
        class="absolute bottom-4 left-4 flex flex-col gap-2 z-10 max-sm:bottom-2 max-sm:left-2 max-sm:flex-row"
      >
        <NuxtLink
          to="/scientific-data"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold transition max-sm:px-3 max-sm:py-1 max-sm:text-xs"
        >
          📊 Scientific Data
        </NuxtLink>
        <NuxtLink
          to="/resident-reviews"
          class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold transition max-sm:px-3 max-sm:py-1 max-sm:text-xs"
        >
          💬 Reviews
        </NuxtLink>
        <NuxtLink
          to="/eco-activism"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold transition max-sm:px-3 max-sm:py-1 max-sm:text-xs"
        >
          🌱 Activism
        </NuxtLink>
      </div>

      <!-- User profile button -->
      <div class="absolute bottom-4 right-4 z-10">
        <NuxtLink
          to="/profile"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold transition max-sm:px-3 max-sm:py-1 max-sm:text-xs"
        >
          👤 Profile
        </NuxtLink>
      </div>
    </div>

    <!-- Water body detail card modal -->
    <WaterBodyCard :water-body="selectedWaterBody" @close="closeCard" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWaterBodies } from '~/composables/useWaterBodies'

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null
let markers: any[] = []

const {
  waterBodies,
  selectedWaterBody,
  isCardOpen,
  getMarkerColor,
  getMarkerEmoji,
  selectWaterBody,
  closeCard,
  cleanBodies,
  atRiskBodies,
  pollutedBodies,
} = useWaterBodies()

/**
 * Generate marker icon URL based on water body status
 * Using online service that generates SVG markers with custom colors
 */
const getMarkerIconUrl = (status: string): string => {
  const colors: Record<string, string> = {
    clean: '22c55e', // green
    at_risk: 'eab308', // yellow
    polluted: 'ef4444', // red
  }
  const color = colors[status] || '6b7280'
  
  // Create SVG icon inline
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 41" width="32" height="41">
      <path fill="#${color}" d="M16 0C7.16 0 0 7.16 0 16c0 12 16 25 16 25s16-13 16-25c0-8.84-7.16-16-16-16z"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `
  
  // Use URL-encoded SVG data URI for broader compatibility
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Initialize the map
 */
const initializeMap = async () => {
  if (!mapContainer.value) return

  // Import Leaflet only on client side (CSS is included via nuxt.config)
  const L = await import('leaflet')
  const leaflet = L.default || L

  // If map already exists (HMR or re-init), remove it first
  if (map) {
    try {
      map.remove()
    } catch (e) {
      // ignore
    }
    map = null
    markers = []
  }

  // Create map instance
  map = leaflet.map(mapContainer.value, {
    center: [54.5, 68.5],
    zoom: 9,
    zoomControl: true,
    scrollWheelZoom: true,
  })

  // Add tile layer (OpenStreetMap)
  leaflet
    .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    })
    .addTo(map)

  // Add markers for each water body (use DivIcon for reliable, CSS-colored pins)
  waterBodies.value.forEach((body: any) => {
    const colorMap: Record<string, string> = {
      clean: '#22c55e',
      at_risk: '#eab308',
      polluted: '#ef4444',
    }
    const color = colorMap[body.status] || '#6b7280'

    // Ensure numeric coordinates
    let lat = Number(body.lat) || 0
    let lng = Number(body.lng) || 0

    // Auto-detect and correct swapped coordinates.
    // Kazakhstan latitudes roughly 40..56, longitudes roughly 46..87 —
    // if lat is outside expected lat range but lng looks like a latitude, swap them.
    const latInRange = lat >= 40 && lat <= 56
    const lngInRange = lng >= 46 && lng <= 87
    if (!latInRange && lng >= 40 && lng <= 56) {
      try {
        // eslint-disable-next-line no-console
        console.debug('[map] detected possible swapped coords, swapping', { id: body.id, origLat: body.lat, origLng: body.lng })
      } catch (e) {
        // ignore
      }
      const tmp = lat
      lat = lng
      lng = tmp
    }

    const html = `
      <div class="marker-pin" style="background:${color}">
        <div class="marker-hole"></div>
      </div>
    `

    const markerIcon = leaflet.divIcon({
      className: 'custom-div-icon',
      html,
      iconSize: [32, 41],
      iconAnchor: [16, 41],
      popupAnchor: [0, -41],
    })

    // Debug: log coordinates and id for each body to help diagnose placement issues
    // (Visible in browser console)
    try {
      // eslint-disable-next-line no-console
      console.debug('[map] adding marker', { id: body.id, name: body.name, lat, lng })
    } catch (e) {
      // ignore
    }

    // Create a DOM-based popup element so each marker gets its own node and handlers
    const popupContainer = document.createElement('div')
    popupContainer.className = 'popup-container'

    const titleEl = document.createElement('div')
    titleEl.className = 'text-sm font-semibold'
    titleEl.textContent = `${getMarkerEmoji(body.status)} ${body.name}`
    popupContainer.appendChild(titleEl)

    const metaEl = document.createElement('div')
    metaEl.className = 'text-xs text-gray-600'
    metaEl.textContent = `Status: ${body.status} | Rating: ${body.rating} ⭐`
    popupContainer.appendChild(metaEl)

    const btn = document.createElement('button')
    btn.className = 'mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded'
    btn.textContent = 'View Details'
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      selectWaterBody(body)
      // close the popup that contains this button (find parent popup)
      try {
        const p = btn.closest('.leaflet-popup')
        if (p) {
          // Leaflet attaches popup element to map; find associated popup instance by position
          // Simpler: just call marker.closePopup()
          marker.closePopup()
        }
      } catch (err) {
        // ignore
      }
    })
    popupContainer.appendChild(btn)

    const marker = leaflet
      .marker([lat, lng], { icon: markerIcon })
      .addTo(map)

    // Bind the DOM node as popup content (ensures unique content per marker)
    marker.bindPopup(popupContainer)

    // Also bind click on marker to open card
    marker.on('click', () => selectWaterBody(body))

    markers.push(marker)
  })

  // no global handlers needed; popup buttons are bound per-marker
}

onMounted(() => {
  // Slight delay to ensure DOM is ready
  setTimeout(() => {
    initializeMap()
  }, 100)
})
</script>

<style scoped>
#map-page {
  margin: 0;
  padding: 0;
}

#map-wrapper {
  margin: 0;
  padding: 0;
}

:deep(.leaflet-container) {
  background: #e4e4e4;
  outline: none;
}

:deep(.leaflet-popup-content) {
  width: auto !important;
  padding: 8px !important;
}

/* CSS for DivIcon markers */
:deep(.custom-div-icon) {
  background: transparent;
  border: none;
}

:deep(.custom-div-icon .marker-pin) {
  width: 28px;
  height: 28px;
  border-radius: 50% 50% 50% 50%/40% 40% 60% 60%;
  transform: rotate(45deg);
  position: relative;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.custom-div-icon .marker-pin .marker-hole) {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  transform: rotate(-45deg);
}
</style>

