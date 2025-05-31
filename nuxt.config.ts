export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8090', // Asegúrate que esta sea la URL correcta de tu backend Spring
    }
  },

  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  pages: true, // Habilita la detección automática de rutas en la carpeta "pages"

  plugins: [
    '~/plugins/axios.ts', // Asegúrate que el plugin de axios se registre
    '~/plugins/vue3-toastify.ts'
  ],
})