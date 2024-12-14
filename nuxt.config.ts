// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/icon"],
  runtimeConfig: {
    // Server-side environment variables
    dbHost: "",
    dbPort: "",
    dbName: "",
    dbUser: "",
    dbPassword: "",
    jwtSecret: "",

    // Public variables
    public: {
      apiBaseUrl: "",
    },
  },
  plugins: ["~/plugins/auth.ts"],
});
