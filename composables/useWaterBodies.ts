import { ref, computed, onMounted } from 'vue'
import type { WaterBody } from '~/types/models'

export const useWaterBodies = () => {
  // То, что прилетает с backend: id, name, lat, lng
  const waterBodies = ref<WaterBody[]>([])
  const selectedWaterBody = ref<WaterBody | null>(null)
  const isCardOpen = ref(false)

  // Локальная “карта статусов и рейтингов” — как раньше было в хардкоде
  const metaById: Record<number, {
    status: 'clean' | 'at_risk' | 'polluted'
    rating: number
    reviewCount: number
    description: string
  }> = {
    1: {
      status: 'polluted',
      rating: 3,
      reviewCount: 17,
      description: 'Major freshwater lake in North Kazakhstan',
    },
    2: {
      status: 'clean',
      rating: 4.5,
      reviewCount: 8,
      description: 'Important river flowing through the region',
    },
    3: {
      status: 'at_risk',
      rating: 2.8,
      reviewCount: 12,
      description: 'Shallow lake with ecological concerns',
    },
    4: {
      status: 'clean',
      rating: 4.2,
      reviewCount: 5,
      description: 'Northern lake, relatively clean',
    },
   5: {
      status: 'polluted',
      rating: 2.1,
      reviewCount: 21,
      description: 'Needs ecological restoration',
    },
  }

  onMounted(async () => {
    try {
      const res = await fetch('http://localhost:8000/lakes')
      const data = await res.json()

      // Склеиваем данные из БД с нашими статусами/рейтингами
      waterBodies.value = data.map((lake: any) => {
        const meta = metaById[lake.id] ?? {
          status: 'clean',
          rating: 3,
          reviewCount: 0,
          description: '',
        }

        return {
          id: lake.id,
          name: lake.name,
          lat: Number(lake.lat),
          lng: Number(lake.lng),
          status: meta.status,
          rating: meta.rating,
          reviewCount: meta.reviewCount,
          description: meta.description,
        } as WaterBody
      })
    } catch (e) {
      console.error('Error loading lakes', e)
    }
  })

  const getMarkerColor = (status: string): string => {
    switch (status) {
      case 'clean':
        return '#22c55e'
      case 'at_risk':
        return '#eab308'
      case 'polluted':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getMarkerEmoji = (status: string): string => {
    switch (status) {
      case 'clean':
        return '🟢'
      case 'at_risk':
        return '🟡'
      case 'polluted':
        return '🔴'
      default:
        return '⚪'
    }
  }

  const selectWaterBody = (body: WaterBody) => {
    selectedWaterBody.value = body
    isCardOpen.value = true
  }

  const closeCard = () => {
    selectedWaterBody.value = null
    isCardOpen.value = false
  }

  const cleanBodies = computed(() =>
    waterBodies.value.filter((b) => b.status === 'clean')
  )
  const atRiskBodies = computed(() =>
    waterBodies.value.filter((b) => b.status === 'at_risk')
  )
  const pollutedBodies = computed(() =>
    waterBodies.value.filter((b) => b.status === 'polluted')
  )

  return {
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
  }
}
