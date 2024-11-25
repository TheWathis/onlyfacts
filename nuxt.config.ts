// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/icon"],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || "your-default-secret-key",
    public: {
      apiBase: process.env.API_BASE_URL || "/api",
    },
  },
  plugins: ["~/plugins/auth.ts"],
});
