export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800, 900]
    }
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000/api/v1"
    }
  },
  app: {
    head: {
      title: "Wayground-Style Online Quiz System",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Full-stack online quiz and assessment platform based on the uploaded PDF." }
      ]
    }
  }
});
