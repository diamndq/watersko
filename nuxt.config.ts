// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['leaflet/dist/leaflet.css', '~/assets/css/main.css'],
  ssr: false,
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:8000'
    },
  },
})
