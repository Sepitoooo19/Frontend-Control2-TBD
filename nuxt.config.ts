export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8090', // Asegúrate que esta sea la URL correcta de tu backend Spring
    }
  },

  modules: [
    '@pinia/nuxt',
  ],

  plugins: [
    '~/plugins/axios.ts', // Asegúrate que el plugin de axios se registre
    '~/plugins/vue3-toastify.ts'
  ],

  css: [
    '@/assets/css/main.css'
  ]

})