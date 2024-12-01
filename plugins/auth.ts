export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth();
  const router = useRouter();

  // Only check auth on client side
  if (import.meta.client) {
    router.beforeEach(async (to, from, next) => {
      const publicRoutes = [
        "/auth",
        "/",
        "/api/auth/login",
        "/api/auth/register",
      ];

      if (publicRoutes.includes(to.path)) {
        return next();
      }

      const isAuthenticated = await auth.checkAuth();

      if (!isAuthenticated && to.path !== "/auth") {
        return next("/auth");
      }

      return next();
    });

    // Initial auth check on client side
    await auth.checkAuth();
  }
});
