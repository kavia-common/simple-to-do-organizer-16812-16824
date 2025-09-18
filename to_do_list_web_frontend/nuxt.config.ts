/**
 * Nuxt configuration for Ocean Professional To-do App.
 * Includes global CSS, runtimeConfig for API base, and CORS headers for previews.
 */
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Ocean To‑do',
      meta: [
        { name: 'description', content: 'Modern to-do list organizer with Ocean Professional theme' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#2563EB' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
  css: [
    '~/assets/styles/main.css'
  ],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api', // can be overridden by env
    },
  },
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    },
    // Provide mock API routes for development if no backend exists
    preset: 'node',
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    },
  },
});
